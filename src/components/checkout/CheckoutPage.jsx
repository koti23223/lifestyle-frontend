import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./CheckoutPage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

const FALLBACK_IMAGE = "https://via.placeholder.com/100x100?text=No+Image";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

const getProductId = (item) =>
  item?.product?.id ?? item?.product?.productId ?? item?.productId ?? null;

const getProductTitle = (item) =>
  item?.product?.title ?? item?.productTitle ?? "Product";

const getProductImage = (item) =>
  item?.product?.imageUrl ?? item?.productImageUrl ?? FALLBACK_IMAGE;

const getProductPrice = (item) =>
  Number(item?.product?.price ?? item?.price ?? 0);

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems = [], summary: incomingSummary = {} } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    country: "India",
  });

  const summary = useMemo(() => {
    if (
      incomingSummary &&
      incomingSummary.subtotal !== undefined &&
      incomingSummary.gstAmount !== undefined &&
      incomingSummary.grandTotal !== undefined
    ) {
      return incomingSummary;
    }

    const subtotal = cartItems.reduce((total, item) => {
      const price = getProductPrice(item);
      const quantity = Number(item?.quantity || 1);
      return total + price * quantity;
    }, 0);

    const gstAmount = Number((subtotal * 0.18).toFixed(2));
    const grandTotal = Number((subtotal + gstAmount).toFixed(2));

    return { subtotal, gstAmount, grandTotal };
  }, [cartItems, incomingSummary]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateShipping = () => {
    if (!shipping.fullName.trim()) return "Please enter full name";
    if (!shipping.streetAddress.trim()) return "Please enter street address";
    if (!shipping.city.trim()) return "Please enter city";
    if (!shipping.zipCode.trim()) return "Please enter zip code";
    return null;
  };

  const createRazorpayOrder = async () => {
    const payload = {
      amount: Math.round(summary.grandTotal * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const { data } = await axios.post(
      `${API_BASE_URL}/api/payments/razorpay/create-order`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return data;
  };

  const verifyPayment = async (razorpayOrderId, paymentResponse) => {
    const payload = {
      razorpayOrderId,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpaySignature: paymentResponse.razorpay_signature,
    };

    await axios.post(`${API_BASE_URL}/api/payments/razorpay/verify`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  };

  const buildOrderPayload = (userEmail, razorpayOrderId, paymentResponse) => {
    const mappedCartItems = cartItems.map((item) => ({
      productId: getProductId(item),
      productTitle: getProductTitle(item),
      productImageUrl: getProductImage(item),
      price: getProductPrice(item),
      quantity: Number(item?.quantity || 1),
    }));

    const missingProduct = mappedCartItems.some((item) => !item.productId);
    if (missingProduct) {
      throw new Error("One or more cart items are missing product id");
    }

    return {
      userEmail,
      fullName: shipping.fullName,
      streetAddress: shipping.streetAddress,
      city: shipping.city,
      zipCode: shipping.zipCode,
      country: shipping.country,
      paymentMethod: "RAZORPAY",
      paymentId: paymentResponse.razorpay_payment_id,
      razorpayOrderId,
      subtotal: summary.subtotal,
      tax: summary.gstAmount,
      totalAmount: summary.grandTotal,
      cartItems: mappedCartItems,
    };
  };

  const saveOrder = async (userEmail, razorpayOrderId, paymentResponse) => {
    const payload = buildOrderPayload(userEmail, razorpayOrderId, paymentResponse);

    const { data } = await axios.post(
      `${API_BASE_URL}/api/orders/checkout`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return data;
  };

  const handlePaymentSuccess = async (
    paymentResponse,
    razorpayOrderId,
    userEmail
  ) => {
    try {
      await verifyPayment(razorpayOrderId, paymentResponse);
      const savedOrder = await saveOrder(userEmail, razorpayOrderId, paymentResponse);

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      await Swal.fire({
        icon: "success",
        title: "Order Placed Successfully",
        html: `
          <div style="font-size:15px;">
            <p><strong>Order ID:</strong> ${savedOrder.orderId}</p>
            <p>📧 Confirmation sent to</p>
            <p style="font-weight:600; color:#0f4bd8;">${userEmail}</p>
            <p style="margin-top:10px;">Thank you for shopping with us! 🛍️</p>
          </div>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#0f4bd8",
      });

      navigate("/orders");
    } catch (error) {
      console.error("Checkout error:", error);

      const errorMessage =
        typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data?.message ||
            error?.response?.data?.error ||
            error.message ||
            "Payment completed but order could not be saved";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#0f4bd8",
      });
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayCheckout = (orderData, userEmail) => {
    const razorpayOrderId = orderData?.razorpayOrderId || orderData?.id;

    const options = {
      key: RAZORPAY_KEY,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "LIFESTYLE",
      description: "Order Payment",
      order_id: razorpayOrderId,
      prefill: {
        name: shipping.fullName,
        email: userEmail,
      },
      notes: {
        address: `${shipping.streetAddress}, ${shipping.city}, ${shipping.zipCode}, ${shipping.country}`,
      },
      theme: { color: "#0f4bd8" },
      modal: { ondismiss: () => setLoading(false) },
      handler: async (response) => {
        await handlePaymentSuccess(response, razorpayOrderId, userEmail);
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: response.error?.description || "Unable to complete payment",
        confirmButtonColor: "#0f4bd8",
      });
    });

    razorpay.open();
  };

  const handlePayNow = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first",
      });
      navigate("/login");
      return;
    }

    if (!isValidEmail(userEmail)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "The saved user email is invalid. Please login again or update your profile email.",
      });
      return;
    }

    if (!cartItems.length) {
      Swal.fire({
        icon: "info",
        title: "Cart Empty",
        text: "Please add items to cart",
      });
      navigate("/cart");
      return;
    }

    const validationError = validateShipping();
    if (validationError) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: validationError,
      });
      return;
    }

    if (!API_BASE_URL) {
      Swal.fire({
        icon: "error",
        title: "Configuration Error",
        text: "API URL is missing. Please check VITE_API_URL in your .env file.",
      });
      return;
    }

    if (!RAZORPAY_KEY) {
      Swal.fire({
        icon: "error",
        title: "Configuration Error",
        text: "Razorpay key is missing. Please check VITE_RAZORPAY_KEY in your .env file.",
      });
      return;
    }

    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const orderData = await createRazorpayOrder();
      if (!orderData?.amount || !orderData?.currency) {
        throw new Error("Invalid Razorpay order response from backend");
      }

      openRazorpayCheckout(orderData, userEmail);
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);

      const errorMessage =
        typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data?.message ||
            error?.response?.data?.error ||
            error.message ||
            "Something went wrong";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#0f4bd8",
      });
    }
  };

  if (!location.state || !cartItems.length) {
    return (
      <div className="checkout-empty">
        <h2>No checkout data found</h2>
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper no-navbar-checkout">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-left">
            <div className="checkout-card">
              <h2>Shipping Address</h2>

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={shipping.fullName}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="streetAddress"
                placeholder="Street Address"
                value={shipping.streetAddress}
                onChange={handleInputChange}
              />

              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shipping.city}
                  onChange={handleInputChange}
                />

                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={shipping.zipCode}
                  onChange={handleInputChange}
                />
              </div>

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shipping.country}
                onChange={handleInputChange}
              />
            </div>

            <div className="checkout-card">
              <h2>Payment Method</h2>
              <p>Razorpay (UPI / Cards / Net Banking / Wallets)</p>
            </div>
          </div>

          <div className="checkout-right">
            <div className="order-card">
              <h2>Your Order</h2>

              {cartItems.map((item, index) => (
                <div
                  key={item?.cartId || getProductId(item) || index}
                  className="order-item"
                >
                  <img
                    src={getProductImage(item)}
                    alt={getProductTitle(item)}
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div className="order-item-info">
                    <p>{getProductTitle(item)}</p>
                    <span>
                      Qty: {Number(item?.quantity || 1)} ×{" "}
                      {formatCurrency(getProductPrice(item))}
                    </span>
                  </div>

                  <div className="order-item-price">
                    {formatCurrency(
                      getProductPrice(item) * Number(item?.quantity || 1)
                    )}
                  </div>
                </div>
              ))}

              <hr />

              <div className="price-row">
                <span>Subtotal</span>
                <span>{formatCurrency(summary.subtotal)}</span>
              </div>

              <div className="price-row">
                <span>GST (18%)</span>
                <span>{formatCurrency(summary.gstAmount)}</span>
              </div>

              <div className="price-row total-row">
                <span>Total</span>
                <span>{formatCurrency(summary.grandTotal)}</span>
              </div>

              <button onClick={handlePayNow} disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
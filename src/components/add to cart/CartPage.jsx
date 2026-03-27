import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");
  const GST_PERCENT = 18;

  const fetchCartItems = async () => {
    if (!userEmail) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/cart/user/${userEmail}`
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [userEmail]);

  const handleIncrease = async (cartId, quantity) => {
    try {
      await axios.put(`${API_BASE_URL}/api/cart/update/${cartId}`, {
        quantity: quantity + 1,
      });

      fetchCartItems();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to update quantity",
      });
    }
  };

  const handleDecrease = async (cartId, quantity) => {
    if (quantity <= 1) {
      handleRemove(cartId);
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/api/cart/update/${cartId}`, {
        quantity: quantity - 1,
      });

      fetchCartItems();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to update quantity",
      });
    }
  };

  const handleRemove = async (cartId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cart/remove/${cartId}`);

      fetchCartItems();
      window.dispatchEvent(new Event("cartUpdated"));

      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Item removed from cart",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error removing item:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to remove item",
      });
    }
  };

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    const gstAmount = (subtotal * GST_PERCENT) / 100;
    const grandTotal = subtotal + gstAmount;

    return {
      subtotal,
      gstAmount,
      grandTotal,
    };
  }, [cartItems]);

  const handleProceedToCheckout = () => {
    navigate("/checkout", {
      state: {
        cartItems,
        summary,
      },
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-4">
        <h2 className="text-center mb-4">My Cart</h2>
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 pt-4">
        <h2 className="text-center mb-4">My Cart</h2>
        <div className="card shadow-sm border-0 rounded-4 text-center p-5">
          <h4 className="mb-3">Your cart is empty</h4>
          <p className="text-muted mb-0">
            Add your favorite products to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <h2 className="text-center mb-4">My Cart</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          {cartItems.map((item) => {
            const itemSubtotal = item.product.price * item.quantity;

            return (
              <div
                className="card shadow-sm border-0 rounded-4 mb-4"
                key={item.cartId}
              >
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="img-fluid rounded-3"
                        loading="lazy"
                        style={{
                          width: "150px",
                          height: "180px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150x180?text=No+Image";
                        }}
                      />
                    </div>

                    <div className="col-md-5">
                      <h5 className="mb-2">{item.product.title}</h5>
                      <p className="mb-1 fw-bold fs-5">₹ {item.product.price}</p>
                      <p className="text-muted mb-0">
                        Item Total: ₹ {itemSubtotal.toFixed(2)}
                      </p>
                    </div>

                    <div className="col-md-2 mt-3 mt-md-0">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <button
                          className="btn btn-outline-dark btn-sm rounded-3"
                          onClick={() =>
                            handleDecrease(item.cartId, item.quantity)
                          }
                        >
                          -
                        </button>

                        <span className="fw-bold px-2">{item.quantity}</span>

                        <button
                          className="btn btn-outline-dark btn-sm rounded-3"
                          onClick={() =>
                            handleIncrease(item.cartId, item.quantity)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="col-md-2 text-md-end text-center mt-3 mt-md-0">
                      <button
                        className="btn btn-outline-dark btn-sm rounded-3"
                        onClick={() => handleRemove(item.cartId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-lg-4">
          <div
            className="card shadow-sm border-0 rounded-4 sticky-top"
            style={{ top: "100px" }}
          >
            <div className="card-body p-4">
              <h4 className="mb-4">Order Summary</h4>

              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>₹ {summary.subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>GST ({GST_PERCENT}%)</span>
                <span>₹ {summary.gstAmount.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Delivery</span>
                <span className="text-success">Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Total</span>
                <span>₹ {summary.grandTotal.toFixed(2)}</span>
              </div>

              <button
                className="btn btn-dark w-100 py-2 rounded-3"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
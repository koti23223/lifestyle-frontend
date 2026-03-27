import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderTracking.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const FALLBACK_IMAGE = "https://via.placeholder.com/80x80?text=No+Image";

const ORDER_STEPS = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function OrderTracking() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!email) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/orders/track/${email}`);
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);

        const errorMessage =
          typeof err?.response?.data === "string"
            ? err.response.data
            : err?.response?.data?.message ||
              err?.message ||
              "Failed to fetch orders";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [email]);

  const getStepIndex = (status) => {
    const map = {
      PLACED: 0,
      CONFIRMED: 1,
      SHIPPED: 2,
      OUT_FOR_DELIVERY: 3,
      DELIVERED: 4,
    };

    return map[String(status || "PLACED").toUpperCase()] ?? 0;
  };

  const isStepActive = (stepIndex, status) => {
    return stepIndex <= getStepIndex(status);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

  const handlePrintInvoice = (orderId) => {
    console.log("Print invoice for order:", orderId);
    window.print();
  };

  if (loading) {
    return <p className="center">Loading orders...</p>;
  }

  if (error) {
    return (
      <div className="order-page">
        <h2 className="title">Order Tracking</h2>
        <p className="subtitle">Track your order status and delivery progress.</p>

        <div className="center error-block">
          <p className="error">{error}</p>
          {!email && (
            <button className="invoice-btn" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2 className="title">Order Tracking</h2>
      <p className="subtitle">Track your order status and delivery progress.</p>

      {orders.length === 0 ? (
        <p className="center">No orders found.</p>
      ) : (
        orders.map((order, orderIndex) => (
          <div key={order.orderId || order.id || orderIndex} className="order-card">
            <div className="details-header">
              <h4>Order Details</h4>
              <button
                type="button"
                className="invoice-btn"
                onClick={() => handlePrintInvoice(order.orderId)}
              >
                Download Invoice
              </button>
            </div>

            <div className="order-info">
              <div>
                <p>Order ID</p>
                <strong>#{order.orderId || "N/A"}</strong>
              </div>

              <div>
                <p>Date</p>
                <strong>{formatDate(order.orderDate)}</strong>
              </div>

              <div>
                <p>Status</p>
                <strong className="status">
                  {String(order.orderStatus || "PLACED").replaceAll("_", " ")}
                </strong>
              </div>

              <div>
                <p>Items</p>
                <strong>{order.items?.length || 0}</strong>
              </div>

              <div>
                <p>Total</p>
                <strong>{formatCurrency(order.totalAmount)}</strong>
              </div>
            </div>

            <div className="tracking-header">
              <h4>Order Tracking</h4>
            </div>

            <div className="tracking-box">
              {ORDER_STEPS.map((step, index) => (
                <div key={step} className="tracking-step">
                  <div
                    className={`step ${
                      isStepActive(index, order.orderStatus) ? "active" : ""
                    }`}
                  >
                    <div className="circle">
                      {isStepActive(index, order.orderStatus) ? "✔" : index + 1}
                    </div>
                    <p>{step.replaceAll("_", " ")}</p>
                  </div>

                  {index !== ORDER_STEPS.length - 1 && (
                    <div
                      className={`line ${
                        isStepActive(index + 1, order.orderStatus)
                          ? "active-line"
                          : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <h4 className="items-title">Items</h4>

            {order.items?.length ? (
              order.items.map((item, itemIndex) => (
                <div
                  className="item-row"
                  key={item.productId || item.id || itemIndex}
                >
                  <img
                    src={item.productImageUrl || FALLBACK_IMAGE}
                    alt={item.productTitle || "Product"}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div className="item-info">
                    <strong>{item.productTitle || "Product"}</strong>
                    <p>ID: {item.productId || "N/A"}</p>
                  </div>

                  <div className="item-meta">Qty: {item.quantity || 0}</div>
                  <div className="item-meta">{formatCurrency(item.price)}</div>
                </div>
              ))
            ) : (
              <p className="no-items">No items found in this order.</p>
            )}

            <div className="price-section">
              <div className="box">
                <p>Subtotal</p>
                <strong>{formatCurrency(order.subtotal)}</strong>
              </div>

              <div className="box">
                <p>GST</p>
                <strong>{formatCurrency(order.tax)}</strong>
              </div>

              <div className="box total">
                <p>Total</p>
                <strong>{formatCurrency(order.totalAmount)}</strong>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
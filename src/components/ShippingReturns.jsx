import "./ShippingReturns.css";
import { useNavigate } from "react-router-dom";

export default function ShippingReturns() {
  const navigate = useNavigate();

  return (
    <div className="sr-container">
      <div className="sr-card">

        {/* Header */}
        <div className="sr-header">
          <span className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </span>
          <h1>Shipping & Returns</h1>
          <p className="update">Last Updated: November 2025</p>
        </div>

        {/* Content */}
        <div className="sr-content">

          {/* LEFT SIDE TEXT */}
          <div className="sr-text">

            <p>
              We aim to provide a smooth and reliable shopping experience. This
              page outlines our shipping process, delivery timelines, and return
              policies to ensure complete transparency.
            </p>

            <h3>Shipping Policy</h3>
            <ul>
              <li>Orders are processed within 1–2 business days.</li>
              <li>Delivery typically takes 3–7 business days.</li>
              <li>Free shipping is available on selected orders.</li>
              <li>Tracking details will be shared via email/SMS.</li>
              <li>Delays may occur during peak seasons or due to logistics issues.</li>
            </ul>

            <h3>Return Policy</h3>
            <ul>
              <li>Returns are accepted within 7 days of delivery.</li>
              <li>Items must be unused and in original packaging.</li>
              <li>Damaged or defective products are eligible for full refund.</li>
              <li>Return shipping may be free or chargeable based on reason.</li>
            </ul>

            <h3>Refund Policy</h3>
            <ul>
              <li>Refunds are processed within 5–7 business days.</li>
              <li>Amount will be credited to original payment method.</li>
              <li>In case of COD, refund will be processed to bank account.</li>
            </ul>

          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="sr-image">
            <img
              src="https://cdn-icons-png.flaticon.com/512/869/869636.png"
              alt="shipping illustration"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
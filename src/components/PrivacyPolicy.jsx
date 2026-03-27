import React from "react";
import "./PrivacyPolicy.css";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="privacy-container">
      <div className="privacy-card">

        {/* Header */}
        <div className="privacy-header">
          {/* <span className="back-btn">← Back</span> */}
          <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
       </button>
          <h1>Privacy Policy</h1>
          <p className="update">Last Updated: November 2025</p>
        </div>

        {/* Content */}
        <div className="privacy-content">

          {/* Left Text */}
          <div className="privacy-text">
            <p>
              Your privacy is important to us. It is Mynu UI’s policy to respect
              your privacy regarding any information we may collect from you
              across our website and other services we own and operate.
            </p>

            <h3>Information We Collect</h3>
            <p>
              We only collect information about you if we have a reason to do so.
            </p>

            <ul>
              <li>
                <b>Personal Information:</b> Name, email address, and contact
                details.
              </li>
              <li>
                <b>Usage Data:</b> Pages visited, clicks, and search terms.
              </li>
            </ul>

            <h3>How We Use Information</h3>
            <ul>
              <li>Provide, operate, and maintain our website</li>
              <li>Improve and personalize user experience</li>
              <li>Develop new features and services</li>
              <li>Communicate updates and promotions</li>
            </ul>

            <h3>Data Security</h3>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure networks and is only accessible by authorized personnel who are required to keep the information confidential. We regularly review our security practices to prevent unauthorized access, data breaches, and misuse of information.
            </p>
          </div>

          {/* Right Image */}
          <div className="privacy-image">
            <img
              src="https://img.freepik.com/premium-photo/illustration-woman-writing-sales-copy_863013-53296.jpg"
              alt="privacy illustration"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
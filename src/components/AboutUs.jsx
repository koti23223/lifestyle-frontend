import React from "react";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about-container">

      {/* 🔥 Top Section */}
      <div className="about-top">
        <div className="about-text">
          <h1>ABOUT US.</h1>
          <p>
            ShopEase is your one-stop destination for all your shopping needs.
            From fashion to electronics, we bring you a wide range of quality
            products at the best prices.
          </p>
          <p>
            Our mission is to make online shopping simple, fast, and enjoyable.
            We focus on customer satisfaction, secure payments, and seamless
            delivery experiences.
          </p>
        </div>

        <div className="about-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
            alt="ecommerce"
          />
        </div>
      </div>

      {/* 🔥 Features Section */}
      <div className="about-features">

        <div className="feature-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
            alt="fast delivery"
          />
          <h3>SUPER FAST</h3>
          <p>Quick and reliable delivery at your doorstep.</p>
        </div>

        <div className="feature-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
            alt="secure"
          />
          <h3>SECURE PAYMENTS</h3>
          <p>Safe and trusted payment methods for all users.</p>
        </div>

        <div className="feature-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="design"
          />
          <h3>BEST EXPERIENCE</h3>
          <p>Simple design for a smooth shopping experience.</p>
        </div>

      </div>

      {/* 🔥 Quote Section */}
      <div className="about-quote">
        <h2>“</h2>
        <p>
          Our mission is to deliver quality products with the best customer
          experience, making online shopping easy, fast, and enjoyable.
        </p>
        <span>— Your Ecommerce Team</span>
      </div>

    </div>
  );
}
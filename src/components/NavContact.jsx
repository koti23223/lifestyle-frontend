import React, { useState } from "react";
import Swal from "sweetalert2";
import "./NavContact.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function NavContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.text();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your query has been sent successfully.",
          confirmButtonColor: "#000",
        });

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result || "Failed to send query.",
          confirmButtonColor: "#000",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Server Error!",
        text: "Please try again later.",
        confirmButtonColor: "#000",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Reach out to us for any queries or support.</p>
      </div>

      <div className="contact-container">
        <div className="contact-left">
          <h2>Get In Touch</h2>
          <p>
            We are here to help you. Send your questions, feedback, or support
            requests anytime.
          </p>

          <div className="contact-info">
            <div className="info-item">
              <span className="icon">📍</span>
              <div>
                <strong>Address</strong>
                <p>London Eye, London, UK</p>
              </div>
            </div>

            <div className="info-item">
              <span className="icon">📞</span>
              <div>
                <strong>Phone Number</strong>
                <p>+123-456-7890</p>
              </div>
            </div>

            <div className="info-item">
              <span className="icon">📧</span>
              <div>
                <strong>E-Mail</strong>
                <p>mail@subx.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-right">
          <h2>Send a Message</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <p className="privacy-text">
              By submitting, you agree to our Privacy Policy.
            </p>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <div className="map-section">
        <iframe
          title="map"
          src="https://maps.google.com/maps?q=London%20Eye&t=&z=13&ie=UTF8&iwloc=&output=embed"
        />
      </div>
    </div>
  );
}
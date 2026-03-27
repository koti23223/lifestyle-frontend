import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./faq.css";

const categories = [
  "General Information",
  "Products",
  "Ordering",
  "Account",
  "Delivery"
];

const faqData = [
  {
  category: "General Information",
  question: "What is your online store about?",
  answer: "We offer a wide range of fashion, electronics, and lifestyle products at affordable prices."
},
{
  category: "General Information",
  question: "Do I need an account to place an order?",
  answer: "No, you can checkout as a guest, but creating an account helps track orders easily."
},
{
  category: "General Information",
  question: "Is shopping on your website safe?",
  answer: "Yes, we use secure payment gateways and encryption to protect your data."
},
{
  category: "General Information",
  question: "Do you have a mobile app?",
  answer: "Currently, we operate through our website, but a mobile app is coming soon."
},
{
  category: "General Information",
  question: "How can I contact customer support?",
  answer: "You can contact us via email, phone, or through the Contact Us page."
},
{
  category: "Products",
  question: "Are all products original?",
  answer: "Yes, we sell only genuine and high-quality products from trusted brands."
},
{
  category: "Products",
  question: "How do I check product availability?",
  answer: "Product availability is shown on each product page."
},
{
  category: "Products",
  question: "Do you restock sold-out items?",
  answer: "Yes, most popular items are restocked. You can check back later."
},
{
  category: "Products",
  question: "Can I see product reviews?",
  answer: "Yes, customer reviews are available on each product page."
},
{
  category: "Products",
  question: "Do product prices include taxes?",
  answer: "Yes, all prices shown include applicable taxes."
},
{
  category: "Ordering",
  question: "How do I place an order?",
  answer: "Select your product, add it to cart, and proceed to checkout."
},
{
  category: "Ordering",
  question: "Can I cancel my order?",
  answer: "Yes, you can cancel your order before it is shipped."
},
{
  category: "Ordering",
  question: "Can I modify my order after placing it?",
  answer: "Order modifications are not allowed once confirmed."
},
{
  category: "Ordering",
  question: "What payment methods are available?",
  answer: "We accept UPI, debit/credit cards, and net banking."
},
{
  category: "Ordering",
  question: "Will I receive an order confirmation?",
  answer: "Yes, you will receive a confirmation via email or SMS."
},
{
  category: "Delivery",
  question: "How long does delivery take?",
  answer: "Delivery usually takes 3-7 business days."
},
{
  category: "Delivery",
  question: "Do you offer free shipping?",
  answer: "Yes, free shipping is available on selected orders."
},
{
  category: "Delivery",
  question: "How can I track my order?",
  answer: "You can track your order from your account dashboard."
},
{
  category: "Delivery",
  question: "What if my order is delayed?",
  answer: "You will be notified in case of delays. You can also contact support."
},
{
  category: "Delivery",
  question: "Do you deliver to all locations?",
  answer: "We deliver to most locations across the country."
},
{
  category: "Account",
  question: "How do I create an account?",
  answer: "Click on the Sign Up button and fill in your details to create a new account."
},
{
  category: "Account",
  question: "How do I log into my account?",
  answer: "Click on Login and enter your registered email and password."
},
{
  category: "Account",
  question: "I forgot my password. What should I do?",
  answer: "Click on 'Forgot Password' and follow the instructions to reset your password."
},
{
  category: "Account",
  question: "Can I update my account details?",
  answer: "Yes, you can update your profile information from the account settings page."
},
{
  category: "Account",
  question: "How can I delete my account?",
  answer: "You can request account deletion by contacting customer support."
}
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("General Information");

  const navigate = useNavigate();

  // Filter FAQs based on category
  const filteredFaqs = faqData.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <div className="faq-page">

      {/* Header */}
      <div className="faq-header">
        <h1>FAQs</h1>
        <p>Home / FAQs</p>
      </div>

      <div className="faq-container">

        {/* Sidebar */}
        <div className="faq-sidebar">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`faq-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveIndex(null);
              }}
            >
              {cat}
            </button>
          ))}

          {/* Contact Box */}
          <div className="contact-box">
            <h6>You have different questions?</h6>
            <p>Our team will answer all your questions.</p>

            {/* ✅ Redirect to contact page */}
            <button onClick={() => navigate("/Navcontact")}>
              Contact Us
            </button>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="faq-content">
          {filteredFaqs.map((item, index) => (
            <div key={index} className="faq-item">

              <div
                className={`faq-question ${activeIndex === index ? "open" : ""}`}
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                {item.question}
                <span>{activeIndex === index ? "−" : "+"}</span>
              </div>

              {activeIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
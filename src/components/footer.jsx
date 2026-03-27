import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-light py-4 mt-5">
      <div className="container">
        <div className="row">

          {/* Column 1 */}
          <div className="col-md-4">
            <h5>LIFESTYLE</h5>
            <p>Crafting quality essentials for mindful living.</p>
          </div>

          {/* Column 2 */}
          <div className="col-md-4">
            <h6>Shop</h6>

            <p>
              <Link to="/collections/mens-shirts" className="text-dark text-decoration-none">
                Men
              </Link>
            </p>

            <p>
              <Link to="/collections/womens-dresses" className="text-dark text-decoration-none">
                Women
              </Link>
            </p>

            <p>
              <Link to="/collections/kids" className="text-dark text-decoration-none">
                Kids
              </Link>
            </p>

            <p>
              <Link to="/collections/shoes" className="text-dark text-decoration-none">
                Shoes
              </Link>
            </p>

            <p>
              <Link to="/collections/electronics" className="text-dark text-decoration-none">
                Electronics
              </Link>
            </p>

            <p>
              <Link to="/collections/accessories" className="text-dark text-decoration-none">
                Accessories
              </Link>
            </p>
          </div>

          {/* Column 3 */}
          <div className="col-md-4">
            <h6>Support</h6>

            {/* ✅ FIXED LINK */}
            <p>
              <Link to="/shipping-returns" className="text-dark text-decoration-none">
                Shipping & Returns
              </Link>
            </p>

            <p>
              <Link to="/faq" className="text-dark text-decoration-none">
                FAQs
              </Link>
            </p>

            <p>
              <Link to="/navcontact" className="text-dark text-decoration-none">
                Contact Us
              </Link>
            </p>

            <p>
              <Link to="/privacy-policy" className="text-dark text-decoration-none">
                Privacy Policy
              </Link>
            </p>

          </div>

        </div>

        <div className="text-center mt-3">
          <small>© 2026 Lifestyle Brand. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
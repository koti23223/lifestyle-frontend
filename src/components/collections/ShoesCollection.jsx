import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ShoesCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);

      const shoesProducts = response.data.filter((item) => {
        const category = item.category?.toLowerCase();

        return (
          category === "shoes" ||
          category === "sneakers" ||
          category === "sandals" ||
          category === "flipflops"
        );
      });

      setProducts(shoesProducts);
    } catch (error) {
      console.error("Error fetching products:", error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to load products",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkLogin = async () => {
    const userEmail = localStorage.getItem("userEmail");
    const username = localStorage.getItem("username");

    if (!userEmail || !username) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Please Login",
        text: "You need to login first.",
        confirmButtonText: "Go to Login",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        navigate("/login");
      }

      return false;
    }

    return true;
  };

  const handleAddToCart = async (product) => {
    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) return;

    const userEmail = localStorage.getItem("userEmail");

    try {
      await axios.post(`${API_BASE_URL}/api/cart/add`, {
        email: userEmail,
        productId: product.id,
        quantity: 1,
      });

      window.dispatchEvent(new Event("cartUpdated"));

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${product.title} added successfully`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data || "Unable to add product to cart",
      });
    }
  };

  const handleWishlist = async (product) => {
    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) return;

    const userEmail = localStorage.getItem("userEmail");

    try {
      await axios.post(`${API_BASE_URL}/api/wishlist/add`, {
        email: userEmail,
        productId: product.id,
      });

      window.dispatchEvent(new Event("wishlistUpdated"));

      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        text: `${product.title} added successfully`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data || "Unable to add product to wishlist",
      });
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center mb-4">Shoes Collection</h2>

      {loading ? (
        <h4 className="text-center">Loading Products...</h4>
      ) : (
        <div className="row">
          {products.length === 0 ? (
            <h5 className="text-center">No Shoes Available</h5>
          ) : (
            products.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <div className="card h-100 shadow-sm">
                  {/* <img
                    src={item.imageUrl}
                    className="card-img-top"
                    alt={item.title}
                    loading="lazy"
                    style={{
                      height: "350px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/350x350?text=No+Image";
                    }}
                  /> */}
                      <img
  src={item?.imageUrl || "https://via.placeholder.com/300"}
  alt={item?.title}
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/300";
  }}
/>
                  <div className="card-body text-center">
                  <h6>{item?.title}</h6>
<p>₹ {item?.price}</p>

                    {/* ✅ SAME AS MENS / WOMENS / KIDS */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-dark btn-sm w-50"
                        onClick={() => handleWishlist(item)}
                      >
                        Wishlist
                      </button>

                      <button
                        className="btn btn-outline-dark btn-sm w-50"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
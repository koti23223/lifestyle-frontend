import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("userEmail");

  const fetchWishlistItems = async () => {
    if (!userEmail) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/wishlist/user/${userEmail}`
      );
      setWishlistItems(response.data);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [userEmail]);

  const handleAddToCart = async (productId, title) => {
    try {
      await axios.post(`${API_BASE_URL}/api/cart/add`, {
        email: userEmail,
        productId: productId,
        quantity: 1,
      });

      window.dispatchEvent(new Event("cartUpdated"));

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${title} added successfully`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error adding wishlist item to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data || "Unable to add product to cart",
      });
    }
  };

  const handleRemove = async (wishlistId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/wishlist/remove/${wishlistId}`
      );

      fetchWishlistItems();
      window.dispatchEvent(new Event("wishlistUpdated"));

      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Item removed from wishlist",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to remove item from wishlist",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-4">
        <h2 className="text-center mb-4">My Wishlist</h2>
        <h4 className="text-center">Loading Wishlist...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <h2 className="text-center mb-4">My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <h4 className="text-center">Your wishlist is empty</h4>
      ) : (
        <div className="row">
          {wishlistItems.map((item) => (
            <div className="col-md-3 mb-4" key={item.wishlistId}>
              <div className="card h-100 shadow-sm">
                <img
                  src={item.product.imageUrl}
                  className="card-img-top"
                  alt={item.product.title}
                  loading="lazy"
                  style={{
                    height: "350px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/350x350?text=No+Image";
                  }}
                />

                <div className="card-body text-center">
                  <h6>{item.product.title}</h6>
                  <p className="fw-bold">₹ {item.product.price}</p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-dark btn-sm w-50"
                      onClick={() =>
                        handleAddToCart(item.product.id, item.product.title)
                      }
                    >
                      Add to Cart
                    </button>

                    <button
                      className="btn btn-outline-dark btn-sm w-50"
                      onClick={() => handleRemove(item.wishlistId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
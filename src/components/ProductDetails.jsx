import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const addToCart = async () => {
    if (!userEmail) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to add items to cart",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

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
        text: `${product.title} added successfully 🛒`,
        showCancelButton: true,
        confirmButtonText: "Go to Cart",
        cancelButtonText: "Continue Shopping",
        confirmButtonColor: "#0f172a",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/cart");
        } else {
          navigate("/");
        }
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to add product to cart",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (!product) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="row g-0 align-items-center">
              <div className="col-md-6 text-center bg-light p-4">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="img-fluid rounded-3"
                  style={{
                    maxHeight: "420px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x400?text=No+Image";
                  }}
                />
              </div>

              <div className="col-md-6 p-4 p-md-5">
                <h2 className="fw-bold mb-3">{product.title}</h2>

                <h3 className="text-success fw-bold mb-3">₹ {product.price}</h3>

                <p className="text-muted mb-2">
                  <span className="fw-semibold text-dark">Category:</span>{" "}
                  {product.category}
                </p>

                <p className="text-secondary lh-lg mb-4">
                  High quality product. Best comfort and durability. Perfect
                  choice for daily use.
                </p>

                <button
                  className="btn btn-primary px-4 py-2 rounded-3"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ProductCarousel() {
  const [fashion, setFashion] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products`).then((res) => {
      const filtered = res.data.filter((p) =>
        ["men", "women"].includes((p.category || "").toLowerCase())
      );

      setFashion(filtered);
    });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Trending Products</h2>

      <div
        id="productCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {[0, 4].map((start, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={index}
            >
              <div className="row">
                {fashion.slice(start, start + 4).map((item) => {
                  const isHovered = hoveredId === item.id;

                  return (
                    <div className="col-md-3 mb-3" key={item.id}>
                      <div
                        className="card shadow-sm border-0 rounded-4 overflow-hidden h-100"
                        style={{
                          cursor: "pointer",
                          transform: isHovered
                            ? "translateY(-8px)"
                            : "translateY(0)",
                          boxShadow: isHovered
                            ? "0 10px 25px rgba(0,0,0,0.2)"
                            : "0 0.125rem 0.25rem rgba(0,0,0,0.075)",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          backgroundColor: "#fff",
                        }}
                        onClick={() => navigate(`/product/${item.id}`)}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div
                          className="overflow-hidden position-relative"
                          style={{ borderRadius: "12px 12px 0 0" }}
                        >
                          <img
                            src={item.imageUrl}
                            className="card-img-top"
                            alt={item.title}
                            style={{
                              height: "250px",
                              width: "100%",
                              objectFit: "cover",
                              transform: isHovered ? "scale(1.08)" : "scale(1)",
                              transition: "transform 0.5s ease",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x250?text=No+Image";
                            }}
                          />
                        </div>

                        <div className="card-body text-center">
                          <h6 className="fw-semibold mb-1">{item.title}</h6>
                          <p className="text-success fw-bold mb-0">₹{item.price}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#productCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#productCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
}
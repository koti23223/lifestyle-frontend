import React from "react";
import Collections from "./Collections";
import ProductCarousel from "./ProductCarousel";
import ProductCarousels from "./ProductCarousels";

export function Home() {
  const banners = [
    "/banner1.jpg",
    "/banner2.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
    "/banner5.jpg",
  ];

  return (
    <div>
      {/* Banner Carousel */}
      <div
        id="homeCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Carousel Items */}
        <div className="carousel-inner">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={banner}
                className="d-block w-100"
                alt={`banner${index + 1}`}
                style={{ height: "80vh", objectFit: "cover" }}
              />

              <div className="carousel-caption text-start text-dark">
                <h1 className="fw-bold">Elevate Your Everyday</h1>
                <p className="w-50">
                  Sophisticated essentials crafted with quality and
                  responsibility in mind.
                </p>

                <button className="btn btn-dark me-3">
                  Shop New Arrivals
                </button>
                <button className="btn btn-outline-dark">
                  Explore Collections
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* NEW PRODUCT CAROUSEL */}
      <ProductCarousel />
      <ProductCarousels />

      {/* COLLECTIONS */}
      <Collections />
    </div>
  );
}
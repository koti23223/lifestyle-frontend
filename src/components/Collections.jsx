import React from "react";
import { Link } from "react-router-dom";
import "./Collections.css";

export default function Collections() {

  const collections = [
    {
      title: "Men's Collection",
      img: "/mensFashion.jpg",
      path: "/collections/mens-shirts",
    },
    {
      title: "Women's Collection",
      img: "/Womensfashion.jpg",
      path: "/collections/womens-dresses",
     
    },
    {
      title: "Kids",
      img: "/Kids.jpg",
      path: "/collections/kids",
    },
    {
      title: "Shoes",
      img: "/NewShoes.jpg",
      path: "/collections/shoes",
    },
    {
      title: "Electronics",
      img: "/Electronics.jpg",
      path: "/collections/electronics",
    },
    {
      title: "Accessories",
      img: "/accessories.jpg",
      path: "/collections/accessories",
    }
  ];

  return (
    <div className="container my-5">
      <div className="row g-4">

        {collections.map((item, index) => (
          <div className="col-md-4" key={index}>

            {/* Use Link Instead of Button */}
            <Link to={item.path} className="collection-btn d-block text-decoration-none">

              <img
                src={item.img}
                alt={item.title}
                className="collection-img"
              />

              <div className="overlay">
                <h5>{item.title}</h5>
                <span className="shop-text">Shop Now</span>
              </div>

            </Link>

          </div>
        ))}

      </div>
    </div>
  );
}
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function SearchProducts() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!query) return;

    axios
      .get(`${API_BASE_URL}/api/products/search?keyword=${query}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [query]);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Search Results for "{query}"</h3>

      <div className="row g-4">
        {products.map((p) => (
          <div className="col-md-3" key={p.id}>
            <div className="card h-100 shadow-sm border-0">
              <div
                style={{
                  width: "100%",
                  height: "320px",
                  overflow: "hidden",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="card-img-top"
                  style={{
                    width: "100%",
                    height: "150%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x320?text=No+Image";
                  }}
                />
              </div>

              <div className="card-body text-center">
                <h5 className="card-title">{p.title}</h5>
                <p className="mb-1">₹{p.price}</p>
                <p className="text-muted">{p.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
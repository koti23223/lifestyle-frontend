import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("role") !== "ADMIN") {
      navigate("/");
      return;
    }

    if (!API_BASE_URL) {
      console.error("API URL missing");
      return;
    }

    loadProducts();
  }, [navigate]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}/api/products`);
      console.log("Products:", res.data); // DEBUG

      setProducts(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/products/add`, form);

      Swal.fire({
        icon: "success",
        title: "Added",
        text: "Product Added Successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      setForm({
        title: "",
        price: "",
        category: "",
        imageUrl: "",
      });

      loadProducts();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to add product", "error");
    }
  };

  const editProduct = async (product) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Product",
      html: `
        <input id="swal-title" class="swal2-input" value="${product?.title || ""}">
        <input id="swal-price" class="swal2-input" type="number" value="${product?.price || ""}">
        <input id="swal-category" class="swal2-input" value="${product?.category || ""}">
        <input id="swal-imageUrl" class="swal2-input" value="${product?.imageUrl || ""}">
      `,
      showCancelButton: true,
      preConfirm: () => {
        return {
          title: document.getElementById("swal-title").value,
          price: document.getElementById("swal-price").value,
          category: document.getElementById("swal-category").value,
          imageUrl: document.getElementById("swal-imageUrl").value,
        };
      },
    });

    if (!formValues) return;

    try {
      await axios.put(
        `${API_BASE_URL}/api/products/update/${product.id}`,
        formValues
      );

      Swal.fire("Updated!", "", "success");
      loadProducts();
    } catch (error) {
      Swal.fire("Error", "Failed to update product", "error");
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      Swal.fire("Deleted!", "", "success");
      loadProducts();
    } catch (error) {
      Swal.fire("Error", "Failed to delete product", "error");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container mt-4">
        <h2 className="text-center mb-4">Admin Product Management</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="row mb-4">
          <div className="col-md-3">
            <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
          </div>

          <div className="col-md-2">
            <input name="price" type="number" className="form-control" value={form.price} onChange={handleChange} required />
          </div>

          <div className="col-md-3">
            <input name="category" className="form-control" value={form.category} onChange={handleChange} required />
          </div>

          <div className="col-md-3">
            <input name="imageUrl" className="form-control" value={form.imageUrl} onChange={handleChange} required />
          </div>

          <div className="col-md-1">
            <button className="btn btn-success w-100">Add</button>
          </div>
        </form>

        {/* TABLE */}
        {loading ? (
          <h4>Loading...</h4>
        ) : (
          <table className="table text-center">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p?.id}>
                  <td>{p?.id}</td>

                  <td>
                    <img
                      src={p?.imageUrl || "https://via.placeholder.com/60"}
                      alt={p?.title}
                      width="60"
                      height="60"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/60")}
                    />
                  </td>

                  <td>{p?.title}</td>
                  <td>{p?.price}</td>
                  <td>{p?.category}</td>

                  <td>
                    <button className="btn btn-warning me-2" onClick={() => editProduct(p)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
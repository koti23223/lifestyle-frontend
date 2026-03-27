import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (

    <nav className="navbar navbar-dark bg-dark mb-4 px-4">

      <span className="navbar-brand fw-bold">
        SmartCart Admin
      </span>

      <div className="d-flex align-items-center gap-3">

        <span className="text-white">
          Welcome {username}
        </span>

        <button
          className="btn btn-danger btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>

  );
}
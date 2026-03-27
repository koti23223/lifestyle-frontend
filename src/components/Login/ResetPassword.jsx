import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setForm((prev) => ({
        ...prev,
        email: location.state.email,
      }));
    } else {
      navigate("/login");
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          email: form.email,
          otp: form.otp,
          newPassword: form.newPassword,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Password Updated 🎉",
        text: response.data,
      }).then(() => navigate("/login"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data || "Invalid OTP",
      });
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">
          <div className="card border-0 shadow rounded-4">
            <div className="card-body p-4 p-md-5">

              <div className="text-center mb-4">
                <div style={{ fontSize: "35px" }}>🔐</div>
                <h3 className="fw-bold mt-2">Reset Password</h3>
                <p className="text-muted small">
                  Enter OTP & create new password
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label fw-medium">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    className="form-control rounded-3 bg-light"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">OTP Code</label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={form.otp}
                    onChange={handleChange}
                    required
                    className="form-control rounded-3 text-center fw-bold"
                    style={{ letterSpacing: "3px" }}
                  />
                </div>

                {/* NEW PASSWORD */}
                <div className="mb-3">
                  <label className="form-label fw-medium">New Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Enter new password"
                      value={form.newPassword}
                      onChange={handleChange}
                      required
                      className="form-control rounded-start-3"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-end-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="mb-2">
                  <label className="form-label fw-medium">
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="form-control rounded-start-3"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-end-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                </div>

                <small className="text-muted">
                  Minimum 6 characters required
                </small>

                <button
                  type="submit"
                  className="btn btn-dark w-100 mt-4 py-2 rounded-3"
                >
                  Reset Password
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  className="btn btn-link text-secondary text-decoration-none"
                  onClick={() => navigate("/login")}
                >
                  ← Back to Login
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
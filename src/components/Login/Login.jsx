import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters required")
      .required("Password is required"),
  });

  const showAlert = (icon, title, text, callback) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: icon === "success" ? "#0d6efd" : "#dc3545",
    }).then(() => {
      if (callback) callback();
    });
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Forgot Password?",
      input: "email",
      inputLabel: "Enter your registered email",
      inputPlaceholder: "name@example.com",
      showCancelButton: true,
      confirmButtonText: "Send OTP",
    });

    if (!email) return;

    try {
      await axios.post(`${API_BASE_URL}/send-otp`, { email });

      showAlert("success", "OTP Sent", "Check your email for OTP", () => {
        navigate("/reset-password", { state: { email } });
      });
    } catch (error) {
      showAlert(
        "error",
        "Error",
        error.response?.data || "Email not registered"
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axios.post(`${API_BASE_URL}/login`, values);

        if (data === "Login successful") {
          localStorage.setItem("userEmail", values.email);
          localStorage.setItem("username", values.email);
          localStorage.setItem("role", "USER");

          setUser(values.email);

          const pendingContactQuery = localStorage.getItem("pendingContactQuery");

          showAlert(
            "success",
            "Login Successful",
            "Welcome back to Lifestyle!",
            () => navigate(pendingContactQuery ? "/contact" : "/")
          );
          return;
        }

        showAlert(
          "error",
          "Invalid Credentials",
          "Please check your email and password."
        );
      } catch (error) {
        showAlert(
          "error",
          "Login Failed",
          error.response?.data || "Unable to connect to server."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const styles = {
    page: {
      margin: 0,
      boxSizing: "border-box",
      fontFamily: '"Segoe UI", sans-serif',
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f4f5f7",
      padding: "20px",
    },
    card: {
      display: "flex",
      width: "100%",
      maxWidth: "1000px",
      minHeight: "600px",
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      flexWrap: "wrap",
    },
    leftPanel: {
      flex: 1,
      minWidth: "320px",
      display: "flex",
      alignItems: "flex-end",
      padding: "40px",
      color: "#ffffff",
      position: "relative",
      backgroundImage: 'url("LoginMen.jpg")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
      minHeight: "600px",
    },
    overlay: {
      background: "rgba(0,0,0,0.35)",
      padding: "20px",
      borderRadius: "12px",
      width: "100%",
    },
    smallTitle: {
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: "3px",
      marginBottom: "8px",
    },
    brandTitle: {
      margin: "10px 0",
      fontSize: "42px",
      fontWeight: 700,
    },
    desc: {
      width: "70%",
      fontSize: "14px",
      lineHeight: 1.6,
      opacity: 0.95,
    },
    rightPanel: {
      flex: 1,
      minWidth: "320px",
      padding: "60px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    heading: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#1f2937",
      marginBottom: "10px",
    },
    subtitle: {
      marginBottom: "30px",
      fontSize: "14px",
      color: "#6b7280",
    },
    label: {
      display: "block",
      marginTop: "15px",
      fontSize: "12px",
      fontWeight: 600,
      color: "#374151",
      marginBottom: "5px",
    },
    inputBox: {
      display: "flex",
      alignItems: "center",
      marginTop: "5px",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#f3f4f6",
      border: "1px solid #e5e7eb",
    },
    input: {
      flex: 1,
      marginLeft: "10px",
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: "14px",
      color: "#111827",
    },
    icon: {
      color: "#9ca3af",
    },
    eyeIcon: {
      color: "#9ca3af",
      cursor: "pointer",
    },
    errorText: {
      color: "#dc2626",
      fontSize: "12px",
      marginTop: "6px",
    },
    forgotWrapper: {
      textAlign: "right",
      marginTop: "10px",
    },
    forgotButton: {
      background: "none",
      border: "none",
      color: "#4f46e5",
      cursor: "pointer",
      fontSize: "13px",
      padding: 0,
    },
    signInBtn: {
      width: "100%",
      marginTop: "20px",
      padding: "14px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      fontWeight: 700,
      cursor: "pointer",
      transition: "0.3s ease",
      fontSize: "15px",
    },
    register: {
      marginTop: "25px",
      textAlign: "center",
      fontSize: "13px",
      color: "#6b7280",
    },
    link: {
      color: "#4f46e5",
      textDecoration: "none",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.leftPanel}>
          <div style={styles.overlay}>
            <h5 style={styles.smallTitle}>EXPERIENCE ELEGANCE</h5>
            <h1 style={styles.brandTitle}>LIFESTYLE</h1>
            <p style={styles.desc}>
              Curated experiences for the modern minimalist. Design your life
              with intention.
            </p>
          </div>
        </div>

        <div style={styles.rightPanel}>
          <h2 style={styles.heading}>WELCOME BACK</h2>
          <p style={styles.subtitle}>
            Enter your credentials to access your lifestyle portal.
          </p>

          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <div style={styles.inputBox}>
              <FaEnvelope style={styles.icon} />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={styles.input}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div style={styles.errorText}>{formik.errors.email}</div>
            )}

            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputBox}>
              <FaLock style={styles.icon} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={styles.input}
              />
              <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div style={styles.errorText}>{formik.errors.password}</div>
            )}

            <div style={styles.forgotWrapper}>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={styles.forgotButton}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              style={styles.signInBtn}
            >
              {formik.isSubmitting ? "Signing In..." : "SIGN IN"}
            </button>

            <p style={styles.register}>
              New to the club?{" "}
              <Link to="/signup" style={styles.link}>
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
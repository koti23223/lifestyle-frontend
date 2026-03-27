import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaApple,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, "Full name must be at least 3 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        await axios.post(`${API_BASE_URL}/api/auth/register`, values);

        Swal.fire({
          icon: "success",
          title: "Account Created Successfully!",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/login");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.response?.data || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const styles = {
    page: {
      minHeight: "80vh",
      display: "flex",
      backgroundColor: "#f4f5f7",
      fontFamily: '"Segoe UI", sans-serif',
      flexWrap: "wrap",
    },

    leftWrapper: {
      flex: 1,
      minWidth: "320px",
      padding: "16px",
      display: "flex",
    },

    leftSection: {
      width: "100%",
      borderRadius: "15px",
      overflow: "hidden",
      backgroundImage:
        'url("https://images.unsplash.com/photo-1520975916090-3105956dac38")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "20px",
      color: "white",
      minHeight: "320px",
    },

    overlay: {
      position: "absolute",
      inset: 0,
      background: "rgba(0, 0, 0, 0.25)",
      zIndex: 1,
    },

    overlayContent: {
      position: "relative",
      zIndex: 2,
    },

    leftHeading: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "10px",
      lineHeight: "1.2",
    },

    leftText: {
      fontSize: "13px",
      lineHeight: "1.5",
      maxWidth: "400px",
    },

    rightWrapper: {
      flex: 1,
      minWidth: "420px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8f9fa",
      padding: "16px 12px",
    },

    formContainer: {
      width: "100%",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      padding: "18px",
      borderRadius: "14px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    },

    brand: {
      textTransform: "uppercase",
      fontWeight: "700",
      color: "#6c757d",
      fontSize: "12px",
      letterSpacing: "1px",
    },

    heading: {
      fontSize: "22px",
      fontWeight: "700",
      marginTop: "6px",
      color: "#212529",
    },

    subText: {
      color: "#6c757d",
      marginTop: "6px",
      marginBottom: "15px",
      fontSize: "13px",
    },

    label: {
      display: "block",
      marginBottom: "5px",
      marginTop: "10px",
      fontWeight: "600",
      color: "#343a40",
      fontSize: "13px",
    },

    inputBox: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f1f3f5",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      padding: "8px 10px",
      marginBottom: "4px",
    },

    inputBoxError: {
      border: "1px solid #dc3545",
      backgroundColor: "#fff5f5",
    },

    icon: {
      marginRight: "8px",
      color: "#6c757d",
      fontSize: "14px",
    },

    input: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: "13px",
      color: "#212529",
    },

    eyeIcon: {
      cursor: "pointer",
      color: "#6c757d",
      fontSize: "14px",
    },

    errorText: {
      color: "#dc3545",
      fontSize: "11px",
      marginBottom: "2px",
      marginTop: "1px",
    },

    button: {
      width: "100%",
      backgroundColor: "#212529",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "8px",
      marginTop: "10px",
      marginBottom: "12px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
    },

    divider: {
      textAlign: "center",
      marginBottom: "12px",
      color: "#6c757d",
      fontSize: "12px",
      fontWeight: "500",
    },

    socialRow: {
      display: "flex",
      gap: "10px",
      marginBottom: "16px",
      flexWrap: "wrap",
    },

    socialBtn: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      border: "1px solid #ced4da",
      borderRadius: "8px",
      padding: "8px",
      cursor: "pointer",
      background: "#fff",
      minWidth: "130px",
      fontSize: "13px",
      fontWeight: "500",
    },

    bottomText: {
      textAlign: "center",
      color: "#495057",
      fontSize: "13px",
    },

    link: {
      color: "#0d6efd",
      textDecoration: "none",
      fontWeight: "600",
    },
  };

  const getInputBoxStyle = (fieldName) => ({
    ...styles.inputBox,
    ...(formik.touched[fieldName] && formik.errors[fieldName]
      ? styles.inputBoxError
      : {}),
  });

  return (
    <div style={styles.page}>
      <div style={styles.leftWrapper}>
        <div style={styles.leftSection}>
          <div style={styles.overlay}></div>
          <div style={styles.overlayContent}>
            <h1 style={styles.leftHeading}>
              Curating a life of unparalleled elegance.
            </h1>
            <p style={styles.leftText}>
              Join an exclusive community dedicated to refined living,
              high-end design, and curated experiences.
            </p>
          </div>
        </div>
      </div>

      <div style={styles.rightWrapper}>
        <div style={styles.formContainer}>
          <h6 style={styles.brand}>Lifestyle</h6>
          <h2 style={styles.heading}>Create Account</h2>
          <p style={styles.subText}>
            Elevate your daily experience starting today.
          </p>

          <form onSubmit={formik.handleSubmit}>
            <label style={styles.label}>Full Name</label>
            <div style={getInputBoxStyle("fullName")}>
              <FaUser style={styles.icon} />
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={styles.input}
              />
            </div>
            {formik.touched.fullName && formik.errors.fullName && (
              <div style={styles.errorText}>{formik.errors.fullName}</div>
            )}

            <label style={styles.label}>Email</label>
            <div style={getInputBoxStyle("email")}>
              <FaEnvelope style={styles.icon} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={styles.input}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div style={styles.errorText}>{formik.errors.email}</div>
            )}

            <label style={styles.label}>Password</label>
            <div style={getInputBoxStyle("password")}>
              <FaLock style={styles.icon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={styles.input}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div style={styles.errorText}>{formik.errors.password}</div>
            )}

            <label style={styles.label}>Confirm Password</label>
            <div style={getInputBoxStyle("confirmPassword")}>
              <FaLock style={styles.icon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={styles.input}
              />
              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div style={styles.errorText}>
                  {formik.errors.confirmPassword}
                </div>
              )}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Creating..." : "Create My Account"}
            </button>

            <div style={styles.divider}>OR CONTINUE WITH</div>

            <div style={styles.socialRow}>
              <button type="button" style={styles.socialBtn}>
                <FcGoogle />
                Google
              </button>

              <button type="button" style={styles.socialBtn}>
                <FaApple />
                Apple
              </button>
            </div>

            <p style={styles.bottomText}>
              Already part of the community?{" "}
              <Link to="/login" style={styles.link}>
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
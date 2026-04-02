import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_URL;


export default function AdminLogin() {
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/login`,
        values
      );

      if (res.data === "Login Success") {
        localStorage.setItem("username", values.username);
        localStorage.setItem("role", "ADMIN");

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/admin/products");
      } else {
        Swal.fire("Invalid Credentials", "", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Please try again later", "error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-dark text-white text-center">
              <h3>Admin Login</h3>
            </div>

            <div className="card-body p-4">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="mb-3">
                    <label className="form-label">Username</label>

                    <Field
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Enter Username"
                    />

                    <small className="text-danger">
                      <ErrorMessage name="username" />
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>

                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter Password"
                    />

                    <small className="text-danger">
                      <ErrorMessage name="password" />
                    </small>
                  </div>

                  <button type="submit" className="btn btn-dark w-100 mt-3">
                    Login
                  </button>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
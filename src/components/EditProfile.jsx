import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    bio: "",
    profileImage: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first",
        confirmButtonColor: "#000",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/${email}`);

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        address: data.address || "",
        bio: data.bio || "",
        profileImage: data.profileImage || "",
      });

      setPreviewImage(
        data.profileImage ||
          "https://dummyimage.com/120x120/cccccc/000000&text=User"
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to load profile",
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 20 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid File",
        text: "Please upload JPG, JPEG, PNG, or WEBP image only",
        confirmButtonColor: "#000",
      });
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: "warning",
        title: "Image Too Large",
        text: "Please upload an image smaller than 20MB",
        confirmButtonColor: "#000",
      });
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("userEmail");

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first",
        confirmButtonColor: "#000",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("address", formData.address);
      payload.append("bio", formData.bio);

      if (selectedImage) {
        payload.append("file", selectedImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/profile/${email}`, {
        method: "PUT",
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update profile");
      }

      const updatedUser = await response.json();

      setFormData({
        fullName: updatedUser.fullName || "",
        email: updatedUser.email || "",
        address: updatedUser.address || "",
        bio: updatedUser.bio || "",
        profileImage: updatedUser.profileImage || "",
      });

      setPreviewImage(
        updatedUser.profileImage ||
          "https://dummyimage.com/120x120/cccccc/000000&text=User"
      );

      window.dispatchEvent(new Event("profileUpdated"));

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully",
        confirmButtonText: "OK",
        confirmButtonColor: "#000",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Profile update failed",
        confirmButtonColor: "#000",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
        }}
      >
        Loading profile...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          padding: "30px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#111",
          }}
        >
          Edit Profile
        </h2>

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              margin: "0 auto",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid #ddd",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={
                previewImage ||
                "https://dummyimage.com/120x120/cccccc/000000&text=User"
              }
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            id="profileUpload"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <label
            htmlFor="profileUpload"
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "8px 16px",
              backgroundColor: "#111",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Change Photo
          </label>

          <p
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            Allowed: JPG, PNG, WEBP • Max size: 20MB
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#f1f1f1",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write something about yourself"
              rows="4"
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#111",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
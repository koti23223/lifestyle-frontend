import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Navbar.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [profileImage, setProfileImage] = useState("");

  const updateCartCount = useCallback(async () => {
    const email = localStorage.getItem("userEmail");
    const currentRole = localStorage.getItem("role");

    setUserEmail(email);
    setRole(currentRole);

    if (!email || currentRole === "ADMIN") {
      setCartCount(0);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart/count/${email}`);
      setCartCount(res.data);
    } catch {
      setCartCount(0);
    }
  }, []);

  const updateWishlistCount = useCallback(async () => {
    const email = localStorage.getItem("userEmail");
    const currentRole = localStorage.getItem("role");

    setUserEmail(email);
    setRole(currentRole);

    if (!email || currentRole === "ADMIN") {
      setWishlistCount(0);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/wishlist/count/${email}`);
      setWishlistCount(res.data);
    } catch {
      setWishlistCount(0);
    }
  }, []);

  const fetchProfileImage = useCallback(async () => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      setProfileImage("");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/profile/${email}`);
      setProfileImage(res.data.profileImage || "");
    } catch {
      setProfileImage("");
    }
  }, []);

  useEffect(() => {
    updateCartCount();
    updateWishlistCount();
    fetchProfileImage();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    window.addEventListener("profileUpdated", fetchProfileImage);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
      window.removeEventListener("profileUpdated", fetchProfileImage);
    };
  }, [updateCartCount, updateWishlistCount, fetchProfileImage]);

  useEffect(() => {
    updateCartCount();
    updateWishlistCount();
    fetchProfileImage();
  }, [location.pathname, updateCartCount, updateWishlistCount, fetchProfileImage]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setUserEmail(null);
    setRole(null);
    setProfileImage("");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search?q=${search}`);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold" to="/">
            LIFESTYLE
          </Link>

          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-between"
            id="navContent"
          >
            <ul className="navbar-nav mx-auto gap-4">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/collections">Collections</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/about-us">About Us</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/navcontact">Contact Us</Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <form onSubmit={handleSearch} className="d-flex">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="form-control form-control-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-dark btn-sm ms-2">
                  <i className="bi bi-search"></i>
                </button>
              </form>

              <Link to="/wishlist" className="icon-btn">
                <i className="bi bi-heart"></i>
                {wishlistCount > 0 && (
                  <span className="badge-count">{wishlistCount}</span>
                )}
              </Link>

              <Link to="/cart" className="icon-btn">
                <i className="bi bi-cart"></i>
                {cartCount > 0 && (
                  <span className="badge-count">{cartCount}</span>
                )}
              </Link>

              {user || userEmail ? (
                <div className="dropdown">
                  <button
                    className="profile-btn"
                    data-bs-toggle="dropdown"
                    style={{ background: "transparent", border: "none" }}
                  >
                    <img
                      src={
                        profileImage ||
                        "https://dummyimage.com/40x40/cccccc/000000&text=U"
                      }
                      alt="profile"
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ddd",
                      }}
                    />
                  </button>

                  <ul
                    className="dropdown-menu dropdown-menu-end p-3 shadow border-0"
                    style={{ width: "280px", borderRadius: "12px" }}
                  >
                    <li className="mb-3 border-bottom pb-3">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={
                            profileImage ||
                            "https://dummyimage.com/40x40/cccccc/000000&text=U"
                          }
                          alt="profile"
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            className="fw-bold text-truncate"
                            title={userEmail}
                          >
                            {userEmail}
                          </div>
                          <small className="text-muted">
                            Welcome back 👋
                          </small>
                        </div>
                      </div>
                    </li>

                    <li>
                      <Link className="dropdown-item rounded-3 py-2" to="/edit-profile">
                        <i className="bi bi-person me-2"></i>
                        Edit Profile
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item rounded-3 py-2" to="/orders">
                        <i className="bi bi-box me-2"></i>
                        Orders
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item rounded-3 py-2" to="/wishlist">
                        <i className="bi bi-heart me-2"></i>
                        Wishlist
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item rounded-3 py-2" to="/cart">
                        <i className="bi bi-cart me-2"></i>
                        Cart
                      </Link>
                    </li>

                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item text-danger rounded-3 py-2"
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-dark btn-sm">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ height: "70px" }}></div>
    </>
  );
}
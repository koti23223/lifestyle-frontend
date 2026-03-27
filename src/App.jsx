import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/footer";
import { Home } from "./components/home";
import Login from "./components/Login/Login";
import Collections from "./components/Collections";
import Signup from "./components/SignUp/signup";
import MensCollection from "./components/collections/MensCollection";
import WomensCollection from "./components/collections/WomensCollection";
import ShoesCollection from "./components/collections/ShoesCollection";
import ElectronicsCollection from "./components/collections/ElectronicsCollection";
import AccessoriesCollection from "./components/collections/AccessoriesCollection";
import ResetPassword from "./components/Login/ResetPassword";
import AdminProducts from "./components/admin/AdminProducts";
import AdminLogin from "./components/admin/AdminLogin";
import CartPage from "./components/add to cart/CartPage";
import WishlistPage from "./components/wishlist/WishlistPage";
import KidsCollection from "./components/collections/KidsCollection";
import CheckoutPage from "./components/checkout/CheckoutPage";
import FAQ from "./components/FAQ";
import ShippingReturns from "./components/ShippingReturns";
import PrivacyPolicy from "./components/PrivacyPolicy";
import SearchProducts from "./pages/SearchProducts";
import NavContact from "./components/NavContact";
import AboutUs from "./components/AboutUs";
import OrderTracking from "./components/Order/OrderTracking";
import ProductDetails from "./components/ProductDetails";
import EditProfile from "./components/EditProfile";

function App() {

  // ✅ Load from localStorage initially
  const [user, setUser] = useState(localStorage.getItem("userEmail") || null);

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/collections/mens-shirts" element={<MensCollection />} />
        <Route path="/collections/womens-dresses" element={<WomensCollection />} />
        <Route path="/collections/shoes" element={<ShoesCollection />} />
        <Route path="/collections/electronics" element={<ElectronicsCollection />} />
        <Route path="/collections/accessories" element={<AccessoriesCollection />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
         <Route path="/collections/kids" element={<KidsCollection/>}/>
         <Route path="/checkout" element={<CheckoutPage/>} />
         <Route path="/faq" element={<FAQ/>} />
         <Route path="/shipping-returns" element={<ShippingReturns />} />
         <Route path="/privacy-policy" element={<PrivacyPolicy />} />
         <Route path="/search" element={<SearchProducts />} />
           <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/navcontact" element={<NavContact />} />
        <Route path="/about-us" element={<AboutUs/>} />
         <Route path="/orders" element={<OrderTracking/>} />
         <Route path="/product/:id" element={<ProductDetails />} />
         <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
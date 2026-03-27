import React from "react";
import AdminNavbar from "./AdminNavbar";
import Navbar from "./Navbar";

export default function NavbarSwitcher() {

  const role = localStorage.getItem("role");

  if (role === "admin") {
    return <AdminNavbar />;
  }

  return <Navbar/>;

}
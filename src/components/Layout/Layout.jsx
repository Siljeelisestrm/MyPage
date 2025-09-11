import React from "react";
import Navbar from "../navbar/Navbar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="page-content">{children}</div>
    </>
  );
}

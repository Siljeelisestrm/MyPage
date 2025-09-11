import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">ToDo</Link>
      <Link to="/contact">Game</Link>
      <Link to="/giftPlanner">Julegaver</Link>
      <Link to="/oppskrifter">Oppskrifter</Link>
    </nav>
  );
}

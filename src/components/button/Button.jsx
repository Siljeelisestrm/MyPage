import React from "react";
import "./Button.css";

function Button({ children, onClick, style, type = "button" }) {
  return (
    <button className="button" style={style} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
export default Button;

import React from "react";
import "./Card.css";
import colors from "../../theme/colors";

function Card({ title, children, bg, style = {}, className = "" }) {
  const backgroundColor = bg ? colors[bg] || bg : undefined;

  return (
    <div className={`card ${className}`} style={{ backgroundColor, ...style }}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
}

export default Card;

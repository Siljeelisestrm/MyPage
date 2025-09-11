import React from "react";
import colors from "../../theme/colors";

export default function Input({ value, onChange, onEnter, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onEnter();
      }}
      placeholder={placeholder}
      style={{
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid ",
        borderColor: colors.fog,
        marginRight: "8px",
        width: "200px",
      }}
    />
  );
}

// Separator.jsx
import React from "react";
import colors from "../../theme/colors";

export default function Separator({
  orientation = "horizontal",
  styleType = "solid",
  color = colors.midnight,
  thickness = "0.5px",
  length = "100%",
  margin = "8px 0",
}) {
  const isHorizontal = orientation === "horizontal";

  const separatorStyle = {
    border: "none",
    background: isHorizontal ? color : "transparent",
    borderTop: isHorizontal ? `${thickness} ${styleType} ${color}` : "none",
    borderLeft: !isHorizontal ? `${thickness} ${styleType} ${color}` : "none",
    width: isHorizontal ? length : thickness,
    height: !isHorizontal ? length : thickness,
    margin: isHorizontal ? margin : `0 ${margin}`,
  };

  return <hr style={separatorStyle} />;
}

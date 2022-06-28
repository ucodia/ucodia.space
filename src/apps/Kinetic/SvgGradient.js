import React from "react";
import mapToRange from "../../utils/mapToRange";

const getGradientStops = (colors) => {
  return colors.map((color, index) => {
    return (
      <stop
        key={index}
        offset={mapToRange(index, 0, colors.length - 1, 0, 1)}
        stopColor={color}
      />
    );
  });
};

const SvgGradient = ({ colors, type = "radial", id }) => {
  switch (type) {
    case "linear":
      return (
        <linearGradient id={id} gradientUnits="userSpaceOnUse">
          {getGradientStops(colors)}
        </linearGradient>
      );
    case "radial":
      return (
        <radialGradient id={id} gradientUnits="userSpaceOnUse">
          {getGradientStops(colors)}
        </radialGradient>
      );
    default:
      return null;
  }
};

export default SvgGradient;

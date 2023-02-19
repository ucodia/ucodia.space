import React from "react";

const mapToRange = (n, start1, stop1, start2, stop2) => {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

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

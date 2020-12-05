import React from "react";
import PropTypes from "prop-types";
import mapToRange from "../../utils/mapToRange";

const getGradientStops = colors => {
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

SvgGradient.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string,
  id: PropTypes.string.isRequired
};

export default SvgGradient;

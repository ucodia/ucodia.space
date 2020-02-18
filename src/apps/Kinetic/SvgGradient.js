import React from "react";
import PropTypes from "prop-types";

const SvgGradient = ({ colors, type = "radial", id }) => {
  const step = colors.length === 2 ? 1 : 1 / colors.length - 1;

  if (type === "radial") {
    return (
      <radialGradient id={id} gradientUnits="userSpaceOnUse">
        {colors.map((color, index) => {
          return <stop key={index} offset={index * step} stopColor={color} />;
        })}
      </radialGradient>
    );
  }

  return null;
};

SvgGradient.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string,
  id: PropTypes.string.isRequired
};

export default SvgGradient;

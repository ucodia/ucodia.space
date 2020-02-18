import React, { useState } from "react";
import PropTypes from "prop-types";
import SvgGradient from "./SvgGradient";
import uuid from "uuid";

const SvgPath = ({ viewBox, data, gradient, flipped }) => {
  // it is required to generate unique IDs for each gradient definitions
  // if duplicated, SVG gradients might not re-render on mobile
  const [gradientId] = useState(uuid.v4());
  const fillGradientId = `fill-gradient-${gradientId}`;

  return (
    <svg viewBox={viewBox}>
      <defs>
        <SvgGradient id={fillGradientId} colors={gradient.colors} />
      </defs>
      <path
        style={{ fill: `url(#${fillGradientId})` }}
        transform={flipped && "translate(500,0) scale(-1,1)"}
        d={data}
      />
    </svg>
  );
};

SvgPath.propTypes = {
  viewBox: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  gradient: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  flipped: PropTypes.bool
};

export default SvgPath;

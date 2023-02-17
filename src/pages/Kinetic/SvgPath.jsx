import React, { useState } from "react";
import SvgGradient from "./SvgGradient";
import id from "../../utils/id";

const SvgPath = ({ viewBox, data, gradient, flipped }) => {
  // it is required to generate unique IDs for each gradient definitions
  // if duplicated, SVG gradients might not re-render on mobile
  const [gradientId] = useState(id());
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

export default SvgPath;

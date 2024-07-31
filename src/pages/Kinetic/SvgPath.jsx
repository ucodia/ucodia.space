import React, { useState } from "react";
import SvgGradient from "./SvgGradient";
import { randomString } from "../../utils/random";

const SvgPath = ({ viewBox, data, gradient, flipped, className }) => {
  // it is required to generate unique IDs for each gradient definitions
  // if duplicated, SVG gradients might not re-render on mobile
  const [gradientId] = useState(randomString(8));
  const fillGradientId = `fill-gradient-${gradientId}`;

  return (
    <svg viewBox={viewBox} className={className}>
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

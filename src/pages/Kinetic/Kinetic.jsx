import React, { useState } from "react";
import SvgPath from "./SvgPath";
import gradients from "@/data/gradients";
import shapes from "./data/shapes";
import cyclicIterator from "@/utils/cyclicIterator";
import styles from "./Kinetic.module.css";

export const meta = {
  name: "Kinetic",
  created: "2016-02-02",
};

const Kinetic = () => {
  const [backgroundIterator] = useState(cyclicIterator(["#000000", "#ffffff"]));
  const [gradientIterator] = useState(cyclicIterator(gradients));
  const [shapeIterator] = useState(cyclicIterator(shapes));
  const [background, setBackground] = useState(backgroundIterator.peek());
  const [gradient, setGradient] = useState(gradientIterator.peek());
  const [shape, setShape] = useState(shapeIterator.peek());
  const handleBackgroundTouch = (e) => {
    e.stopPropagation();
    setBackground(backgroundIterator.next());
  };
  const handleShapeTouch = (e) => {
    e.stopPropagation();
    setGradient(gradientIterator.random());
  };
  const handleCenterTouch = (e) => {
    e.stopPropagation();
    setShape(shapeIterator.next());
  };

  return (
    <div
      className={`w-screen h-screen flex items-center justify-center cursor-pointer`}
      style={{ backgroundColor: background }}
      onClick={handleBackgroundTouch}
    >
      <SvgPath
        {...shape}
        gradient={gradient}
        className={`fixed w-4/5 h-4/5 ${styles.zinnia1}`}
      />
      <SvgPath
        {...shape}
        gradient={gradient}
        className={`fixed w-4/5 h-4/5 ${styles.zinnia2}`}
        flipped
      />
      <svg
        viewBox="0 0 100 100"
        className="fixed w-4/5 h-4/5 fill-transparent stroke-transparent z-10"
      >
        <ellipse cx="50" cy="50" rx="50" ry="50" onClick={handleShapeTouch} />
      </svg>
      <svg
        viewBox="0 0 100 100"
        className="fixed w-2/12 h-2/12 fill-transparent stroke-transparent z-20"
      >
        <ellipse cx="50" cy="50" rx="50" ry="50" onClick={handleCenterTouch} />
      </svg>
    </div>
  );
};

export default Kinetic;

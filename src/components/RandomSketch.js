import React from "react";
import FullScreen from "./FullScreen";
import P5Wrapper from "./P5Wrapper";
import sketches from "../sketches";

const RandomSketch = () => {
  const sketch = sketches[Math.floor(Math.random() * sketches.length)];

  return (
    <FullScreen>
      <P5Wrapper sketch={sketch} />
    </FullScreen>
  );
};

export default RandomSketch;

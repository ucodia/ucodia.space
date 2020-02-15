import React from "react";
import FullScreen from "./FullScreen";
import P5Wrapper from "./P5Wrapper";
import sketches from "../sketches";

const pickRandomSketch = () =>
  sketches[Math.floor(Math.random() * sketches.length)];

const RandomSketch = () => {
  return (
    <FullScreen>
      <P5Wrapper sketch={pickRandomSketch()} />
    </FullScreen>
  );
};

export default RandomSketch;

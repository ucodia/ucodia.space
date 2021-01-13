import React, { useState } from "react";
import styled from "styled-components";
import SvgPath from "./SvgPath";
import backgrounds from "./data/backgrounds";
import gradients from "../../data/gradients";
import shapes from "./data/shapes";
import cyclicIterator from "../../utils/cyclicIterator";
import { emitInteraction } from "../../utils/metrics";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.background};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    position: fixed;
  }

  svg:nth-child(-n + 2) {
    width: 80%;
    height: 80%;
  }

  svg:nth-of-type(1) {
    animation-name: zinnia1anim;
    animation-duration: 18s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }

  svg:nth-of-type(2) {
    animation-name: zinnia2anim;
    animation-duration: 12s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }

  @keyframes zinnia1anim {
    100% {
      transform: rotate(-1080deg);
    }
  }

  @keyframes zinnia2anim {
    70% {
      transform: rotate(720deg);
    }
    100% {
      transform: rotate(540deg);
    }
  }
`;

const TouchSurface = styled.svg`
  fill: transparent;
  stroke: transparent;
`;
const ShapeSurface = styled(TouchSurface)`
  width: 80%;
  height: 80%;
  z-index: 10;
`;
const CenterSurface = styled(TouchSurface)`
  width: 10%;
  height: 10%;
  z-index: 20;
`;

const Kinetic = () => {
  const [backgroundIterator] = useState(cyclicIterator(backgrounds));
  const [gradientIterator] = useState(cyclicIterator(gradients));
  const [shapeIterator] = useState(cyclicIterator(shapes));
  const [background, setBackground] = useState(backgroundIterator.peek());
  const [gradient, setGradient] = useState(gradientIterator.peek());
  const [shape, setShape] = useState(shapeIterator.peek());
  const handleBackgroundTouch = (e) => {
    emitInteraction("set-background-color");
    e.stopPropagation();
    setBackground(backgroundIterator.next());
  };
  const handleShapeTouch = (e) => {
    emitInteraction("set-shape-color");
    e.stopPropagation();
    setGradient(gradientIterator.random());
  };
  const handleCenterTouch = (e) => {
    emitInteraction("set-shape");
    e.stopPropagation();
    setShape(shapeIterator.next());
  };

  return (
    <Container background={background} onClick={handleBackgroundTouch}>
      <SvgPath {...shape} gradient={gradient} />
      <SvgPath {...shape} gradient={gradient} flipped />
      <ShapeSurface viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="50" ry="50" onClick={handleShapeTouch} />
      </ShapeSurface>
      <CenterSurface viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="50" ry="50" onClick={handleCenterTouch} />
      </CenterSurface>
    </Container>
  );
};

export default Kinetic;

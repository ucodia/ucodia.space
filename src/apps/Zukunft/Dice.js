import React from "react";
import styled from "styled-components";

const faceToDots = {
  0: [0, 1, 2, 3, 5, 6, 7, 8],
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
  h: [0, 2, 3, 4, 5, 6, 8],
  e: [0, 1, 2, 3, 4, 6, 7, 8],
  l: [0, 3, 6, 7, 8],
  o: [0, 1, 2, 3, 5, 6, 7, 8],
};

const Surface = styled.g`
  cursor: pointer;
`;
const Outline = styled.rect`
  fill: "none";
  stroke: "#333";
  stroke-width: "1px";
`;
const Dot = styled.ellipse`
  fill: white;
  stroke: none;
`;
const Dice = ({ face, size, transform, onClick = () => {} }) => {
  return (
    <Surface transform={transform} onClick={onClick}>
      <Outline width={size} height={size} rx={size / 5} ry={size / 5} />
      {faceToDots[face].map((dot, i) => {
        const cx = (size / 4) * ((dot % 3) + 1);
        const cy = (size / 4) * (Math.floor(dot / 3) + 1);
        const r = size / 10;
        return <Dot key={i} cx={cx} cy={cy} rx={r} ry={r} />;
      })}
    </Surface>
  );
};

export default Dice;

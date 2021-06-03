import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { withSize } from "react-sizeme";
import d3SaveSvg from "d3-save-svg";
import getN from "../../utils/getN";
import id from "../../utils/id";
import randomInt from "../../utils/randomInt";
import Dice from "./Dice";
import randomItem from "../../utils/randomItem";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
`;

const Plot = styled.svg`
  width: 100%;
  height: 100%;
`;

const buttonFaces = [1, "-", "+", "carret-down"];
const createDice = (face = 1, orientation = 0, primary = false) => ({
  face,
  orientation,
  primary,
  id: id(),
});
const randomDice = () => createDice(randomInt(1, 6), randomInt(0, 1));
// eslint-disable-next-line no-unused-vars
const randomHen = () => {
  const faces = [
    ["h", 0],
    [6, 1],
    ["n", 0],
  ];
  return createDice(...randomItem(faces));
};
const zeroDice = () => createDice(0, 0);

const Zukunft = ({ size }) => {
  const svgRef = useRef(null);
  const diceSize = useMemo(() => {
    if (size.width >= 1024) return 40;
    else if (size.width >= 480) return 50;
    else return 55;
  }, [size]);
  const [grid, setGrid] = useState({ dices: [], columns: 0, rows: 0 });

  useEffect(() => {
    setGrid((g) => {
      const columns = Math.floor(size.width / diceSize) - 1;
      const rows = Math.floor(size.height / diceSize) - 1;
      const diff = columns * rows - g.columns * g.rows;
      const dices =
        diff <= 0
          ? g.dices.slice(0, diff + g.dices.length)
          : [...g.dices, ...getN(diff, randomDice)];

      // define buttons faces
      buttonFaces.forEach((face, i) => {
        dices[i] = createDice(face, 0, true);
      });

      return { dices, columns, rows };
    });
  }, [size, diceSize]);

  const handleDiceClick = (diceIndex) => {
    const dices = grid.dices.slice();
    const current = dices[diceIndex];
    dices[diceIndex] = {
      ...current,
      face: dices[0].face,
      orientation: (current.orientation + 1) % 2,
    };
    setGrid((g) => ({ ...g, dices }));
  };
  const handleCycleFace = (diceIndex) => {
    const dices = grid.dices.slice();
    const current = dices[diceIndex];
    dices[diceIndex] = { ...current, face: (current.face + 1) % 7 };
    setGrid((g) => ({ ...g, dices }));
  };
  const handleClearCanvas = () => {
    setGrid((g) => {
      const dices = [
        ...g.dices.slice(0, buttonFaces.length),
        ...getN(g.dices.length - buttonFaces.length, zeroDice),
      ];
      return { ...g, dices };
    });
  };
  const handleRandomizeCanvas = () => {
    setGrid((g) => {
      const dices = [
        ...g.dices.slice(0, buttonFaces.length),
        ...getN(g.dices.length - buttonFaces.length, randomDice),
      ];
      return { ...g, dices };
    });
  };
  const handleDownloadSvg = () => {
    const suggestion = `zukunft-${new Date().getTime()}`;
    const filename = prompt("Choose a filename:", suggestion);
    if (filename) {
      d3SaveSvg.save(svgRef.current, { filename });
    }
  };

  return (
    <Container>
      <Plot ref={svgRef}>
        {grid.dices.map((dice, i) => {
          const x = i % grid.columns;
          const xOff = (size.width - grid.columns * diceSize) / 2;
          const yOff = (size.height - grid.rows * diceSize) / 2;
          const y = Math.floor(i / grid.columns);
          const translate = `translate(${x * diceSize + xOff}, ${
            y * diceSize + yOff
          })`;
          const rotate = `rotate(${dice.orientation * 90}, ${diceSize / 2}, ${
            diceSize / 2
          })`;

          return (
            <Dice
              key={dice.id}
              face={dice.face}
              size={diceSize}
              transform={`${translate} ${rotate}`}
              primary={dice.primary}
              onClick={
                i === 0
                  ? () => handleCycleFace(0)
                  : i === 1
                  ? () => handleClearCanvas()
                  : i === 2
                  ? () => handleRandomizeCanvas()
                  : i === 3
                  ? () => handleDownloadSvg()
                  : () => handleDiceClick(i)
              }
            />
          );
        })}
      </Plot>
    </Container>
  );
};

export default withSize({
  monitorHeight: true,
  refreshRate: 100,
  refreshMode: "debounce",
  // noPlaceholder: true,
})(Zukunft);

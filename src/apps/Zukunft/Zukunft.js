import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { withSize } from "react-sizeme";
import getN from "../../utils/getN";
import id from "../../utils/id";
import randomInt from "../../utils/randomInt";
import Dice from "./Dice";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
`;

const Plot = styled.svg`
  width: 100%;
  height: 100%;
`;

const randomDice = () => ({
  face: randomInt(1, 6),
  orientation: randomInt(0, 3),
  id: id(),
});

const Zukunft = ({ size }) => {
  const diceSize = useMemo(() => {
    if (size.width >= 1024) return 40;
    else if (size.width >= 480) return 50;
    else return 60;
  }, [size]);
  const [grid, setGrid] = useState({ dices: [], columns: 0, rows: 0 });
  useEffect(() => {
    setGrid((g) => {
      const columns = Math.floor(size.width / diceSize);
      const rows = Math.floor(size.height / diceSize);
      const diff = columns * rows - g.columns * g.rows;
      const dices =
        diff < 0
          ? g.dices.slice(0, diff + g.dices.length)
          : [...g.dices, ...getN(diff, randomDice)];

      return { dices, columns, rows };
    });
  }, [size, diceSize]);

  const handleDiceClick = (diceIndex) => {
    const dices = grid.dices.slice();
    const current = dices[diceIndex];
    dices[diceIndex] = { ...randomDice(), face: (current.face + 1) % 7 };
    setGrid((g) => ({ ...g, dices }));
  };
  const handleRandomize = () => {
    setGrid((g) => ({ ...g, dices: getN(g.columns * g.rows, randomDice) }));
  };

  return (
    <Container>
      <Plot>
        {grid.dices.map((dice, i, array) => {
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
          const isFirstDice = i === 0;

          return (
            <Dice
              key={dice.id}
              face={isFirstDice ? "o" : dice.face}
              size={diceSize}
              transform={`${translate} ${rotate}`}
              onClick={isFirstDice ? handleRandomize : () => handleDiceClick(i)}
            />
          );
        })}
      </Plot>
    </Container>
  );
};

export default withSize({ monitorHeight: true })(Zukunft);

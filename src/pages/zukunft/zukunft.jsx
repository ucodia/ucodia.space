import React, { useEffect, useMemo, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { randomString } from "@/utils/random";
import downloadSvgElement from "@/utils/download-svg-element";
import Dice from "./dice";

export const meta = {
  name: "Zukunft",
  created: "2016-04-02",
};

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getN = (n, fn) => Array.from(Array(n).keys()).map(fn);
const createDice = (face = 1, orientation = 0, primary = false) => ({
  face,
  orientation,
  primary,
  id: randomString(8),
});
const randomDice = () => createDice(randomInt(1, 6), randomInt(0, 1));
const generateDices = (columns, rows) => {
  const dices = getN(columns * rows, randomDice);
  const wordAsArray = "zukunft".split("");
  const wordStart =
    (Math.ceil(rows / 2) - 1) * columns +
    Math.floor((columns - wordAsArray.length) / 2);

  wordAsArray.forEach((letter, i) => {
    dices[wordStart + i] = createDice(letter);
  });

  return dices;
};

const fullSizeStyle = { width: "100%", height: "100%" };

const Zukunft = () => {
  const svgRef = useRef(null);
  const { width, height, ref } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 100,
  });
  const diceSize = useMemo(() => {
    return width >= 1024 ? 40 : 30;
  }, [width, height]);
  const [grid, setGrid] = useState({ dices: [], columns: 0, rows: 0 });

  useEffect(() => {
    if (width !== undefined) {
      const columns = Math.floor(width / diceSize) - 1;
      const rows = Math.floor(height / diceSize) - 1;
      const dices = generateDices(columns, rows);
      setGrid({ dices, columns, rows });
    }
  }, [width, height, diceSize]);

  const handleRandomizeCanvas = () => {
    setGrid((g) => {
      const dices = generateDices(g.columns, g.rows);
      return { ...g, dices };
    });
  };

  const handleDownloadSvg = () => {
    downloadSvgElement(svgRef.current, `zukunft-${new Date().getTime()}`);
  };

  return (
    <div className="w-screen h-screen" ref={ref}>
      {width !== undefined && (
        <svg
          style={fullSizeStyle}
          viewBox={`0 0 ${width} ${height}`}
          ref={svgRef}
        >
          <rect fill="black" stroke="none" width={width} height={height} />
          {grid.dices.map((dice, i) => {
            const x = i % grid.columns;
            const xOff = (width - grid.columns * diceSize) / 2;
            const yOff = (height - grid.rows * diceSize) / 2;
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
                onClick={
                  i === grid.dices.length - 1
                    ? () => handleDownloadSvg()
                    : () => handleRandomizeCanvas(i)
                }
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};

export default Zukunft;

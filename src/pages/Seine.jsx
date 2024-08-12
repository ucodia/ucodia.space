import { useEffect, useRef, useState } from "react";
import downloadSvgElement from "@/utils/downloadSvgElement";

const rows = 41;
const columns = (rows + 1) * 2;
const cellWidth = 10;
const cellHeight = cellWidth * 0.7; // cell height is about 70% of width

function generateGrid() {
  const grid = [];
  for (let x = 0; x < rows + 1; x++) {
    grid[x] = generateColumn(x);
    grid[columns - 1 - x] = generateColumn(x);
  }
  return grid;
}

function generateColumn(blackCells) {
  const column = new Array(rows).fill(false);
  while (blackCells > 0) {
    const index = randomInt(0, rows - 1);
    if (!column[index]) {
      column[index] = true;
      blackCells--;
    }
  }
  return column;
}

function randomInt(min, max, rand = Math.random) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const Seine = () => {
  const svgRef = useRef(null);
  const [grid, setGrid] = useState(generateGrid());

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      switch (key) {
        case "s": {
          downloadSvgElement(svgRef.current, `seine-${new Date().getTime()}`);
          break;
        }
        case "n": {
          setGrid(generateGrid());
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {" "}
      <svg
        className="
          cursor-pointer
          max-h-[80%] max-w-[80%] w-full
          shadow-[0_10px_20px_rgba(0,0,0,0.5)]
          dark:shadow-[0_10px_20px_rgba(180,180,180,0.5)]
         "
        ref={svgRef}
        viewBox={`0 0 ${columns * cellWidth} ${rows * cellHeight}`}
        onClick={() => setGrid(generateGrid())}
      >
        {grid.map((column, x) => {
          return column.map((cell, y) => {
            return (
              <rect
                key={`${x}-${y}`}
                x={x * cellWidth}
                y={y * cellHeight}
                width={cellWidth}
                height={cellHeight}
                fill={cell ? "black" : "white"}
                stroke={cell ? "black" : "white"}
              />
            );
          });
        })}
      </svg>
    </div>
  );
};

export default Seine;

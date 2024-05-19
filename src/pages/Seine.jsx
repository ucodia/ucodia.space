import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import downloadSvgElement from "../utils/downloadSvgElement";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SvgCanvas = styled.svg`
  cursor: pointer;
  max-height: 80%;
  max-width: 80%;
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 10px 20px rgba(180, 180, 180, 0.5);
  }
`;

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
    <Container>
      <SvgCanvas
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
      </SvgCanvas>
    </Container>
  );
};

export default Seine;

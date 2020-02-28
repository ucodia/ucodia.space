import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import cyclicIterator from "../utils/cyclicIterator";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  user-select: none;
  cursor: pointer;
  overflow: scroll;

  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  & > div {
    width: 100%;
    height: 30%;

    font-size: 4rem;
    @media only screen and (min-width: 768px) {
      font-size: 7rem;
    }
    @media only screen and (min-width: 1024px) {
      font-size: 9rem;
    }
  }
`;

const Cell = styled.div`
  color: black;
  background-color: white;
  ${props => props.invert && "filter: invert(100%);"}
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const repeatItems = (items, times = 1) => {
  const result = [];
  for (let i = 0; i < times; i++) {
    result.push(...items);
  }
  return result;
};

const sentences = [
  [
    "the best",
    "at doing",
    "the worst",
    "at doing",
    "the worst",
    "at doing",
    "the best",
    "at doing"
  ],
  ["who", "are", "you", "are", "you", "you", "are"],
  ["in", "side", "out", "side", "in", "side", "out", "side"],
  ["less", "is", "more", "is", "more", "is", "less", "is"]
].map(items => repeatItems(items, 20));

const sentenceIterator = cyclicIterator(sentences);

const Conundrum = () => {
  const containerRef = useRef(null);
  const [sentence, setSentence] = useState(sentenceIterator.peek());
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // items are set to 30% of container space
      // we need an offset of -5% above to be centered
      const offset = -container.clientHeight * 0.05;
      container.scrollTop = container.scrollHeight / 2 + offset;
    }
  }, []);

  return (
    <Container ref={containerRef}>
      {sentence.map((word, index) => {
        return (
          <Cell
            key={index}
            invert={index % 2 === 0}
            onClick={() => setSentence(sentenceIterator.next())}
          >
            {word}
          </Cell>
        );
      })}
    </Container>
  );
};

export default Conundrum;

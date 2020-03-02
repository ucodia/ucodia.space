import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { shuffle } from "lodash";
import cyclicIterator from "../../utils/cyclicIterator";
import sentences from "./sentences";

const numberOfWords = 3;
const offsetRatio = 0.1;
const wordRatio = (1 - offsetRatio) / numberOfWords;

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
    height: ${wordRatio * 100}%;

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

const sentencesRepetition = shuffle(sentences).map(items =>
  repeatItems(items, 20)
);
const sentenceIterator = cyclicIterator(sentencesRepetition);

const scrollToCenter = ref => {
  const container = ref.current;
  if (container) {
    const marginTop = (-container.clientHeight * offsetRatio) / 2;
    container.scrollTop = container.scrollHeight / 2 + marginTop;
  }
};

const Conundrum = () => {
  const containerRef = useRef(null);
  const [sentence, setSentence] = useState(sentenceIterator.peek());
  useEffect(() => scrollToCenter(containerRef), []);

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

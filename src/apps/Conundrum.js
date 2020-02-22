import React, { useState, useEffect } from "react";
import styled from "styled-components";
import cyclicIterator from "../utils/cyclicIterator";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;

  & > div {
    width: 100%;
    height: 30vh;

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
  repeatItems(["the best", "at doing", "the worst", "at doing"], 25),
  repeatItems(["in", "side", "out", "side"], 25)
];

const sentenceIterator = cyclicIterator(sentences);

const scrollToMiddle = () => {
  const x = Math.floor(document.body.clientWidth / 2);
  const y = Math.floor(document.body.clientHeight / 2);
  window.scrollTo(x, y);
};

const Conundrum = () => {
  const [sentence, setSentence] = useState(sentenceIterator.peek());
  useEffect(scrollToMiddle, []);

  return (
    <Container>
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

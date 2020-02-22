import React, { useState } from "react";
import styled from "styled-components";
import cyclicIterator from "../utils/cyclicIterator";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const Text = styled.div`
  width: 100%;
  height: 33vh;
  color: black;
  background-color: white;
  ${props => props.invert && "filter: invert(100%);"}
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-size: 4rem;
  @media only screen and (min-width: 768px) {
    font-size: 7rem;
  }
  @media only screen and (min-width: 1024px) {
    font-size: 9rem;
  }
`;

const repeatItems = (items, times = 1) => {
  const result = [];
  for (let i = 0; i < times; i++) {
    result.push(...items);
  }
  return result;
};

const sentences = [
  repeatItems(["in", "side", "out", "side"], 25),
  repeatItems(["the best", "at doing", "the worst", "at doing"], 25)
];

const sentenceIterator = cyclicIterator(sentences);

const Conundrums = () => {
  const [sentence, setSentence] = useState(sentenceIterator.peek());

  return (
    <Container>
      {sentence.map((word, index) => {
        return (
          <Text
            key={index}
            invert={index % 2 === 0}
            onClick={() => setSentence(sentenceIterator.next().value)}
          >
            {word}
          </Text>
        );
      })}
    </Container>
  );
};

export default Conundrums;

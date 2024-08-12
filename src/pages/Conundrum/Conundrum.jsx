import React, { useState, useEffect, useRef } from "react";
import shuffle from "@/utils/shuffle";
import cyclicIterator from "@/utils/cyclicIterator";
import sentences from "./sentences";

export const meta = {
  name: "Conumdrum",
  created: "2020-02-22",
};

const numberOfWords = 3;
const offsetRatio = 0.1;
const wordRatio = (1 - offsetRatio) / numberOfWords;

const repeatItems = (items, times = 1) => {
  const result = [];
  for (let i = 0; i < times; i++) {
    result.push(...items);
  }
  return result;
};

const sentencesRepetition = shuffle(sentences).map((items) =>
  repeatItems(items, 20)
);
const sentenceIterator = cyclicIterator(sentencesRepetition);

const scrollToCenter = (ref) => {
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
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col select-none cursor-pointer overflow-scroll scrollbar-hide"
    >
      {sentence.map((word, index) => {
        return (
          <div
            key={index}
            className={`
              p-4 md:p-8 lg:p-10
              text-center text-7xl md:text-8xl lg:text-9xl
              ${index % 2 === 0 ? "text-white bg-black" : "text-black bg-white"}
            `}
            onClick={() => setSentence(sentenceIterator.next())}
          >
            {word}
          </div>
        );
      })}
    </div>
  );
};

export default Conundrum;

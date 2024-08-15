import React from "react";
import SketchWrapper from "@/components/sketch-wrapper";
import D from "./2020/D";
import e from "./2020/e";
import f from "./2020/f";
const letters = { D: D, e: e, f: f };

const ThirtySixDaysOfType = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      {Object.keys(letters).map((letter) => {
        console.log("render sketch", letter);
        return (
          <div
            key={letter}
            className="m-[30px]"
            style={{ width: 300, height: 300 }}
          >
            <SketchWrapper sketch={letters[letter]} />
          </div>
        );
      })}
    </div>
  );
};

export default ThirtySixDaysOfType;

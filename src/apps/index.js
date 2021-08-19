import React from "react";
import GiphyVox from "./GiphyVox";
import Kinetic from "./Kinetic";
import Zukunft from "./Zukunft";
import Flowtime from "./Flowtime";
import Conundrum from "./Conundrum";
import sketches from "./sketches";
// import ThirtySixDaysOfType from "./36DaysOfType";
import Lorenz from "./Lorenz";

const apps = {
  "giphy-vox": <GiphyVox />,
  kinetic: <Kinetic />,
  zukunft: <Zukunft />,
  flowtime: <Flowtime />,
  conundrum: <Conundrum />,
  // TODO: The UI of this one could use some love,
  //       it's kind of a confusing experience a the moment
  //       It would be nice to be able to type entire words,
  //       pick a different style and some instructions
  // "36daysoftype": <ThirtySixDaysOfType />,
  lorenz: <Lorenz />,
  ...sketches,
};

export default apps;

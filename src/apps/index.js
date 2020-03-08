import React from "react";
import GiphyVox from "./GiphyVox";
import Kinetic from "./Kinetic";
import Zukunft from "./Zukunft";
import Flowtime from "./Flowtime";
import Conundrum from "./Conundrum";
import sketches from "./sketches";
import Drawbot from "./Drawbot/Drawbot";
import ThirtySixDaysOfType from "./36DaysOfType";

export default {
  "giphy-vox": <GiphyVox />,
  kinetic: <Kinetic />,
  zukunft: <Zukunft />,
  flowtime: <Flowtime />,
  conundrum: <Conundrum />,
  drawbot: <Drawbot />,
  "36daysoftype": <ThirtySixDaysOfType />,
  ...sketches
};

import React from "react";
import GiphyVox from "./GiphyVox";
import Kinetic from "./Kinetic";
import Zukunft from "./Zukunft";
import sketches from "./sketches";

export default {
  "giphy-vox": <GiphyVox />,
  kinetic: <Kinetic />,
  zukunft: <Zukunft />,
  ...sketches
};

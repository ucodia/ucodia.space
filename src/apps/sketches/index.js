import React from "react";
import P5Wrapper from "../../components/P5Wrapper";
import diamonds from "./diamonds";
import circuits from "./circuits";
import dizzyWaves from "./dizzyWaves";
import area715 from "./area715";
import illusions from "./illusions";
import lookAbove from "./lookAbove";
import vintage from "./vintage";
import scales from "./scales";
import drawbot001 from "./drawbot001";
import revolutions from "./revolutions";
import fittestBubleBath from "./fittestBubbleBath";

const sketches = {
  diamonds,
  circuits,
  "dizzy-waves": dizzyWaves,
  area715,
  illusions,
  "look-above": lookAbove,
  vintage,
  scales,
  drawbot001,
  revolutions,
  "fittest-bubble-bath": fittestBubleBath,
};

const wrappedSketches = {};
for (const key in sketches) {
  wrappedSketches[key] = <P5Wrapper sketch={sketches[key]} />;
}

export default wrappedSketches;

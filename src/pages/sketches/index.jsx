import React from "react";
import P5Wrapper from "../../components/P5Wrapper";
import diamonds from "./diamonds";
import circuit from "./circuit";
import dizzyWaves from "./dizzyWaves";
import area715 from "./area715";
import illusions from "./illusions";
import lookAbove from "./lookAbove";
import vintage from "./vintage";
import scales from "./scales";
import drawbot from "./drawbot";
import revolutions from "./revolutions";
import fittestBubleBath from "./fittestBubbleBath";
import circleClock from "./circleClock";
import lorenz from "./lorenz";
import cmyDance from "./cmyDance";

const sketches = {
  diamonds,
  circuit,
  "dizzy-waves": dizzyWaves,
  area715,
  illusions,
  "look-above": lookAbove,
  vintage,
  scales,
  drawbot,
  revolutions,
  "fittest-bubble-bath": fittestBubleBath,
  "circle-clock": circleClock,
  lorenz: lorenz,
  "cmy-dance": cmyDance,
};

const wrappedSketches = {};
for (const key in sketches) {
  wrappedSketches[key] = <P5Wrapper sketch={sketches[key]} />;
}

export default wrappedSketches;

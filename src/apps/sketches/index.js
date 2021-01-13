import React from "react";
import { mapValues } from "lodash";
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

const withP5Wrapper = (sketch) => <P5Wrapper sketch={sketch} />;

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
};

export default mapValues(sketches, withP5Wrapper);

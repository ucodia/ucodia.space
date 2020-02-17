import React from "react";
import { mapValues } from "lodash";
import P5Wrapper from "../components/P5Wrapper";
import diamonds from "./diamonds";
import circuits from "./circuits";
import dizzyWaves from "./dizzyWaves";
import area715 from "./area715";
import illusions from "./illusions";
import lookAbove from "./lookAbove";
import vintage from "./vintage";

const withP5Wrapper = sketch => <P5Wrapper sketch={sketch} />;

const sketches = {
  diamonds,
  circuits,
  dizzyWaves,
  area715,
  illusions,
  lookAbove,
  vintage
};

export default mapValues(sketches, withP5Wrapper);

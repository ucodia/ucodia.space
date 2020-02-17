import React from "react";
import P5Wrapper from "../components/P5Wrapper";
import diamonds from "./diamonds";
import circuits from "./circuits";
import dizzyWaves from "./dizzyWaves";
import area715 from "./area715";
import illusions from "./illusions";
import lookAbove from "./lookAbove";
import vintage from "./vintage";

const withP5Wrapper = sketch => <P5Wrapper sketch={sketch} />;

export default [
  diamonds,
  circuits,
  dizzyWaves,
  area715,
  illusions,
  lookAbove,
  vintage
].map(withP5Wrapper);

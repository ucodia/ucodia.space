import React from "react";
import GiphyVox from "./GiphyVox";
import Kinetic from "./Kinetic";
import Zukunft from "./Zukunft";
import Flowtime from "./Flowtime";
import Conundrum from "./Conundrum";
import LorenzSvg from "./LorenzSvg";
import sketches from "./sketches";
import Seine from "./Seine";
import ExternalRedirect from "../components/ExternalRedirect";

const pages = {
  about: (
    <ExternalRedirect to="https://ucodia.notion.site/Who-is-Ucodia-15cd507c414146c098df52f557a1c1d5" />
  ),
  contact: <ExternalRedirect to="https://linktr.ee/ucodia" />,
  shop: <ExternalRedirect to="https://ucodia.square.site" />,
  "giphy-vox": <GiphyVox />,
  kinetic: <Kinetic />,
  zukunft: <Zukunft />,
  flowtime: <Flowtime />,
  conundrum: <Conundrum />,
  "lorenz-svg": <LorenzSvg />,
  seine: <Seine />,
  ...sketches,
};

export default pages;

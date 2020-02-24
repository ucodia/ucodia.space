import React from "react";
import GiphyVox from "../apps/GiphyVox";
import withFullScreen from "./decorators/withFullScreen";

export default {
  title: "GiphyVox",
  component: GiphyVox,
  decorators: [withFullScreen]
};

export const Showcase = () => <GiphyVox />;

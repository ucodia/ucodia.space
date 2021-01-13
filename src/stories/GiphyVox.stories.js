import React from "react";
import GiphyVox from "../apps/GiphyVox";
import withFullScreen from "./decorators/withFullScreen";

const GiphyVoxStories = {
  title: "GiphyVox",
  component: GiphyVox,
  decorators: [withFullScreen],
};

export const Showcase = () => <GiphyVox />;
export default GiphyVoxStories;

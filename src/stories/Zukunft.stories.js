import React from "react";
import Zukunft from "../apps/Zukunft";
import withFullScreen from "./decorators/withFullScreen";

const ZukunftStories = {
  title: "Zukunft",
  component: Zukunft,
  decorators: [withFullScreen],
};

export const Showcase = () => <Zukunft />;
export default ZukunftStories;

import React from "react";
import Kinetic from "../apps/Kinetic";
import withFullScreen from "./decorators/withFullScreen";

const KineticStories = {
  title: "Kinetic",
  component: Kinetic,
  decorators: [withFullScreen],
};

export const Showcase = () => <Kinetic />;
export default KineticStories;

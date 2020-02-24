import React from "react";
import Kinetic from "../apps/Kinetic";
import withFullScreen from "./decorators/withFullScreen";

export default {
  title: "Kinetic",
  component: Kinetic,
  decorators: [withFullScreen]
};

export const Showcase = () => <Kinetic />;

import React from "react";
import Flowtime from "../apps/Flowtime";
import withFullScreen from "./decorators/withFullScreen";

export default {
  title: "Flowtime",
  component: Flowtime,
  decorators: [withFullScreen],
};

export const Showcase = () => <Flowtime />;

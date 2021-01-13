import React from "react";
import Conundrum from "../apps/Conundrum";
import withFullScreen from "./decorators/withFullScreen";

export default {
  title: "Conundrum",
  component: Conundrum,
  decorators: [withFullScreen],
};

export const Showcase = () => <Conundrum />;

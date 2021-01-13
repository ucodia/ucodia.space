import React from "react";
import Conundrum from "../apps/Conundrum";
import withFullScreen from "./decorators/withFullScreen";

const ConundrumStories = {
  title: "Conundrum",
  component: Conundrum,
  decorators: [withFullScreen],
};

export const Showcase = () => <Conundrum />;
export default ConundrumStories;

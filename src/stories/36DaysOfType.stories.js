import React from "react";
import ThirthySixDaysOfType from "../apps/36DaysOfType";
import withFullScreen from "./decorators/withFullScreen";

const ThirtySixDaysOfTypeStories = {
  title: "36DaysOfType",
  component: ThirthySixDaysOfType,
  decorators: [withFullScreen],
};

export const Showcase = () => <ThirthySixDaysOfType />;
export default ThirtySixDaysOfTypeStories;

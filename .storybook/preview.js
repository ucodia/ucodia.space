import React from "react";
import AppContext from "../src/components/AppContext";

export const decorators = [
  (Story) => (
    <AppContext theme="default">
      <Story />
    </AppContext>
  ),
];

import React from "react";
import { addDecorator } from "@storybook/react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContext from "../src/components/AppContext";

addDecorator(storyFn => <AppContext>{storyFn()}</AppContext>);

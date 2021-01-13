import ReactGA from "react-ga";
import { IS_PROD } from "../utils/constants";

const noop = () => {};
const interaction = (actionName) => {
  ReactGA.event({
    category: "Interaction",
    action: actionName,
  });
};

export const emitInteraction = IS_PROD ? interaction : noop;

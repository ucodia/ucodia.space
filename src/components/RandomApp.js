import { values, has } from "lodash";
import { useState } from "react";
import apps from "../apps";
import { useParams } from "react-router-dom";
import randomItem from "../utils/randomItem";

const RamdomApp = () => {
  const { appId } = useParams();
  const [randomApp] = useState(randomItem(values(apps)));

  return appId && has(apps, appId) ? apps[appId] : randomApp;
};

export default RamdomApp;

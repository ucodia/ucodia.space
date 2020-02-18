import { values, size, has } from "lodash";
import { useState } from "react";
import apps from "../apps";
import { useParams } from "react-router-dom";

const pickRandomApp = () =>
  values(apps)[Math.floor(Math.random() * size(apps))];

const RamdomApp = () => {
  const { appId } = useParams();
  const [randomApp] = useState(pickRandomApp());

  return appId && has(apps, appId) ? apps[appId] : randomApp;
};

export default RamdomApp;

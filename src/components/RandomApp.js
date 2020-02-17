import { useState } from "react";
import sketches from "../sketches";

const apps = [...sketches];
const pickRandomApp = () => apps[Math.floor(Math.random() * apps.length)];

const RamdomApp = () => {
  const [app] = useState(pickRandomApp());
  return app;
};

export default RamdomApp;

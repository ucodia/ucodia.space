import { useEffect, useState } from "react";
import { GUI } from "dat.gui";

const useGui = (config) => {
  const [settings, setSettings] = useState(() => getDefault(config));

  useEffect(() => {
    const gui = new GUI();

    Object.keys(config).forEach((key) => {
      const item = config[key];

      if (typeof item === "function") {
        gui.add(config, key);
      } else if (item.options) {
        gui.add(settings, key, item.options).onChange((newValue) => {
          setSettings((prevSettings) => ({ ...prevSettings, [key]: newValue }));
        });
      } else if (item.range) {
        const step = item.step || (item.range[1] - item.range[0]) / 100;
        gui
          .add(settings, key, item.range[0], item.range[1], step)
          .onChange((newValue) => {
            setSettings((prevSettings) => ({
              ...prevSettings,
              [key]: newValue,
            }));
          });
      }
    });
    return () => gui.destroy();
  }, []);

  return settings;
};

function getDefault(config) {
  const result = {};
  for (const key in config) {
    if (typeof config[key] === "object" && "default" in config[key]) {
      result[key] = config[key].default;
    } else if (typeof config[key] === "object") {
      result[key] = getDefault(config[key]);
    } else {
      result[key] = config[key];
    }
  }
  return result;
}

export default useGui;

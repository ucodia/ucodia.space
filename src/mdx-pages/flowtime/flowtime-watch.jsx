import React, { useEffect, useRef } from "react";
import watchJsUrl from "./watch/watch.js?url";
import wasmUrl from "./watch/firmware.wasm?url";
import skinUrl from "./watch/watch-skin.svg?url";
import displaySvg from "./watch/watch-body.svg?raw";
import styles from "./flowtime-watch.module.css";

// watch.js is an Emscripten MODULARIZE build: loading the script defines a
// global factory (window.Module) that boots a fresh firmware instance each time
// it is called. The script itself only needs to load once; cache that promise.
let factoryPromise;
function loadWatchFactory() {
  if (!factoryPromise) {
    factoryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = watchJsUrl;
      script.onload = () => resolve(window.Module);
      script.onerror = () => reject(new Error("Failed to load watch firmware"));
      document.body.appendChild(script);
    });
  }
  return factoryPromise;
}

export default function FlowtimeWatch() {
  const layersRef = useRef(null);

  useEffect(() => {
    // Defaults the firmware reads as globals before boot.
    window.lat = 0;
    window.lon = 0;
    window.tx = "";
    window.temp_c = 25.0;
    window.volumeGain = 0.1;

    // The firmware drives the display by mutating live SVG nodes (an <img>
    // would hide them), so inject the markup, then overlay the skin on top.
    layersRef.current.innerHTML = displaySvg;
    const skin = document.createElement("img");
    skin.src = skinUrl;
    skin.alt = "";
    skin.className = styles.skin;
    layersRef.current.appendChild(skin);

    let instance;
    let cancelled = false;
    loadWatchFactory()
      .then((createWatch) =>
        createWatch({
          locateFile: (path) => (path.endsWith(".wasm") ? wasmUrl : path),
        }),
      )
      .then((m) => {
        instance = m;
        if (cancelled) m.pauseMainLoop?.();
      });

    return () => {
      cancelled = true;
      instance?.pauseMainLoop?.();
    };
  }, []);

  return (
    <div className={`not-prose ${styles.container}`}>
      <div className={styles.layers} ref={layersRef} />
    </div>
  );
}

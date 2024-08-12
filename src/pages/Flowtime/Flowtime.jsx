import React, { useState } from "react";
import { fromDate } from "flowtime";
import useInterval from "../../hooks/useInterval";
import styles from "./Flowtime.module.css";

export const meta = {
  name: "Flowtime",
  created: "2018-07-09",
};

const timeFormatter = new Intl.DateTimeFormat(
  Intl.DateTimeFormat().resolvedOptions().locale,
  { timeStyle: "medium" }
);

const Flowtime = () => {
  const [time, setTime] = useState(fromDate(new Date()).toDate());
  const [realityCheck, setRealityCheck] = useState(false);
  useInterval(() => {
    setTime(realityCheck ? new Date() : fromDate(new Date()).toDate());
  }, 1000);

  const showReality = () => {
    setRealityCheck(true);
    setTime(new Date());
  };
  const showFlowtime = () => {
    setRealityCheck(false);
    setTime(fromDate(new Date()).toDate());
  };

  return (
    <div className="w-screen h-screen">
      <div
        className={`
          grid grid-rows-[auto_1fr] grid-cols-1
          w-full h-full
          select-none cursor-pointer
          text-black
          ${styles.backgroundGradient}
        `}
        onMouseDown={showReality}
        onTouchStart={showReality}
        onMouseUp={showFlowtime}
        onTouchEnd={showFlowtime}
      >
        <h1
          className="
          text-center font-thin bg-white m-0 p-8
          shadow-[0_0_10px_rgb(51,51,51)]
          text-5xl lg:text-6xl
        "
        >
          ~ flowtime ~
        </h1>
        <code
          className="
          text-center self-center
          text-5xl md:text-7xl lg:text-8xl
        "
        >
          {timeFormatter.format(time)}
        </code>
      </div>
    </div>
  );
};

export default Flowtime;

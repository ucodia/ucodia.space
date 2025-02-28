import React, { useState } from "react";
import flowtime from "flowtime";
import useInterval from "@/hooks/use-interval";
import styles from "./flowtime-clock.module.css";

const timeFormatter = new Intl.DateTimeFormat(
  Intl.DateTimeFormat().resolvedOptions().locale,
  { timeStyle: "medium" }
);

export default function FlowtimeClock() {
  const [time, setTime] = useState(flowtime.fromDate(new Date()).date);
  const [realityCheck, setRealityCheck] = useState(false);

  useInterval(() => {
    setTime(realityCheck ? new Date() : flowtime.fromDate(new Date()).date);
  }, 1000);

  const showReality = () => {
    setRealityCheck(true);
    setTime(new Date());
  };

  const showFlowtime = () => {
    setRealityCheck(false);
    setTime(flowtime.fromDate(new Date()).date);
  };

  return (
    <div>
      <div
        className={`w-full cursor-pointer select-none p-4 border border-gray-300 dark:border-gray-700 rounded-lg ${styles.colorCycle}`}
        onMouseDown={showReality}
        onTouchStart={showReality}
        onMouseUp={showFlowtime}
        onTouchEnd={showFlowtime}
      >
        <div
          className={`text-center text-4xl md:text-6xl lg:text-7xl font-mono ${styles.colorCycle}`}
        >
          {timeFormatter.format(time)}
        </div>
      </div>
      <div className="text-center italic text-xs md:text-sm mt-4">
        hold down for a reality check
      </div>
    </div>
  );
}

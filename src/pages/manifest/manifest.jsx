import SketchWrapper from "@/components/sketch-wrapper";
import React from "react";
import sketch from "../sketches/manifest";
import "./manifest.css";
export const meta = {
  name: "Kinetic",
  created: "2016-02-02",
};

const Manifest = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="card relative w-[500px] h-[600px] border-2 border-gray-200 rounded-lg shadow-lg bg-white flex flex-col">
        <div className="h-5/6">
          <SketchWrapper sketch={sketch} />
        </div>
        <div className="card-name h-1/6 flex items-center justify-center text-xl">
          manifest
        </div>
      </div>
    </div>
  );
};

export default Manifest;

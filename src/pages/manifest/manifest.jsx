import SketchWrapper from "@/components/sketch-wrapper";
import React from "react";
import sketch from "../sketches/manifest";
import "./manifest.css";

export const meta = {
  name: "Kinetic",
  created: "2016-02-02",
};

// Instructions:
// 1. Focus: Ask for what you need
// 2. Shuffle: Mix the deck while infusing your thoughts
// 3. Draw: Select a card and channel its energy

// Manifest is a digital oracle deck to facilitate tuning
// into your intuition and generate well being.

const Manifest = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="card-view relative w-[500px] h-[600px] border-1 border-gray-200 rounded-3xl shadow-2xl bg-white flex flex-col">
        <div className="h-3/4 pt-16">
          <SketchWrapper sketch={sketch} />
        </div>
        <div className="card-name h-1/4 flex items-center justify-center text-xl">
          manifest
        </div>
      </div>
    </div>
  );
};

export default Manifest;

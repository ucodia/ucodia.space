import ExternalRedirect from "@/components/ExternalRedirect";
import SketchWrapper from "@/components/SketchWrapper";
import GiphyVox from "@/pages/GiphyVox";
import Kinetic from "@/pages/Kinetic";
import Zukunft from "@/pages/Zukunft";
import Flowtime from "@/pages/Flowtime";
import Conundrum from "@/pages/Conundrum";
import LorenzSvg from "@/pages/LorenzSvg";
import Seine from "@/pages/Seine";
import ThirtySixDaysOfType from "@/pages/36DaysOfType";
import * as diamonds from "@/pages/sketches/diamonds";
import * as circuit from "@/pages/sketches/circuit";
import * as dizzyWaves from "@/pages/sketches/dizzyWaves";
import * as area715 from "@/pages/sketches/area715";
import * as illusions from "@/pages/sketches/illusions";
import * as lookAbove from "@/pages/sketches/lookAbove";
import * as vintage from "@/pages/sketches/vintage";
import * as scales from "@/pages/sketches/scales";
import * as drawbot from "@/pages/sketches/drawbot";
import * as revolutions from "@/pages/sketches/revolutions";
import * as fittestBubleBath from "@/pages/sketches/fittestBubbleBath";
import * as circleClock from "@/pages/sketches/circleClock";
import * as lorenz from "@/pages/sketches/lorenz";
import * as cmyDance from "@/pages/sketches/cmyDance";
import * as squircle from "@/pages/sketches/squircle";
import * as infiniteChaos from "@/pages/sketches/infiniteChaos";
import * as spinnySquares from "@/pages/sketches/spinnySquares";

const FullscreenSketch = ({ sketch }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SketchWrapper sketch={sketch.default} renderer={sketch.meta.renderer} />
    </div>
  );
};

const routes = [
  {
    name: "about",
    path: "/about",
    element: (
      <ExternalRedirect to="https://ucodia.notion.site/Who-is-Ucodia-15cd507c414146c098df52f557a1c1d5" />
    ),
  },
  {
    name: "contact",
    path: "/contact",
    element: <ExternalRedirect to="https://linktr.ee/ucodia" />,
  },
  {
    name: "shop ✨",
    path: "/shop",
    element: <ExternalRedirect to="https://ucodia.square.site" />,
  },
  {
    name: "mycologue 🍄",
    path: "/mycologue",
    element: <ExternalRedirect to="https://mycologue.org" />,
  },
  { name: "giphy vox", path: "/giphy-vox", element: <GiphyVox /> },
  { name: "kinetic", path: "/kinetic", element: <Kinetic /> },
  {
    name: "zukunft",
    path: "/zukunft",
    element: <Zukunft />,
  },
  { name: "flowtime", path: "/flowtime", element: <Flowtime /> },
  { name: "conundrum", path: "/conundrum", element: <Conundrum /> },
  { name: "lorenz-svg", path: "/lorenz-svg", element: <LorenzSvg /> },
  { name: "seine", path: "/seine", element: <Seine /> },
  {
    name: "36 days of type",
    path: "/36days/2020",
    element: <ThirtySixDaysOfType />,
    disabled: true,
  },
  {
    name: "diamonds",
    path: "/diamonds",
    element: <FullscreenSketch sketch={diamonds} />,
  },
  {
    name: "circle clock",
    path: "/circle-clock",
    element: <FullscreenSketch sketch={circleClock} />,
  },
  {
    name: "circuit",
    path: "/circuit",
    element: <FullscreenSketch sketch={circuit} />,
  },
  {
    name: "dizzy waves",
    path: "/dizzy-waves",
    element: <FullscreenSketch sketch={dizzyWaves} />,
  },
  {
    name: "area715",
    path: "/area715",
    element: <FullscreenSketch sketch={area715} />,
  },
  {
    name: "illusions",
    path: "/illusions",
    element: <FullscreenSketch sketch={illusions} />,
  },
  {
    name: "look above",
    path: "/look-above",
    element: <FullscreenSketch sketch={lookAbove} />,
  },
  {
    name: "vintage",
    path: "/vintage",
    element: <FullscreenSketch sketch={vintage} />,
  },
  {
    name: "scales",
    path: "/scales",
    element: <FullscreenSketch sketch={scales} />,
  },
  {
    name: "drawbot",
    path: "/drawbot",
    element: <FullscreenSketch sketch={drawbot} />,
  },
  {
    name: "revolutions",
    path: "/revolutions",
    element: <FullscreenSketch sketch={revolutions} />,
  },
  {
    name: "fittest bubble bath",
    path: "/fittest-bubble-bath",
    element: <FullscreenSketch sketch={fittestBubleBath} />,
  },
  {
    name: "lorenz",
    path: "/lorenz",
    element: <FullscreenSketch sketch={lorenz} />,
  },
  {
    name: "cmy dance",
    path: "/cmy-dance",
    element: <FullscreenSketch sketch={cmyDance} />,
  },
  {
    name: "squircle",
    path: "/squircle",
    element: <FullscreenSketch sketch={squircle} />,
  },
  {
    name: "infinite chaos",
    path: "/infinite-chaos",
    element: <FullscreenSketch sketch={infiniteChaos} />,
  },
  {
    name: "spinny squares",
    path: "/spinny-squares",
    element: <FullscreenSketch sketch={spinnySquares} />,
  },
];

export default routes.filter(({ disabled }) => !disabled);

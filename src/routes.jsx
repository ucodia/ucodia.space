import SketchWrapper from "@/components/SketchWrapper";
import LorenzSvg from "@/pages/LorenzSvg";
import * as cmyDance from "@/pages/sketches/cmyDance";
import * as squircle from "@/pages/sketches/squircle";

const FullscreenSketch = ({ sketch }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SketchWrapper sketch={sketch.default} renderer={sketch.meta.renderer} />
    </div>
  );
};

const routes = [
  { name: "lorenz-svg", path: "/lorenz-svg", element: <LorenzSvg /> },
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
];

export default routes.filter(({ disabled }) => !disabled);

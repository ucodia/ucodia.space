import { Suspense, lazy } from "react";
import ExternalRedirect from "@/components/external-redirect";
import LoadingSpinner from "@/components/loading-spinner";
import SketchWrapper from "@/components/sketch-wrapper";
import MDXLayout from "@/components/mdx-layout";
import GiphyVox from "@/pages/giphy-vox";
import Kinetic from "@/pages/kinetic";
import Manifest from "@/pages/manifest";
import Zukunft from "@/pages/zukunft";
import Conundrum from "@/pages/conundrum";
import LorenzSvg from "@/pages/lorenz-svg";
import Seine from "@/pages/seine";
import ThirtySixDaysOfType from "@/pages/36-days-of-type";
import mdxPages from "@/mdx-pages";
import sketches from "@/pages/sketches";

const BadRng = lazy(() => import("@/pages/bad-rng"));

const FullscreenSketch = ({ sketch }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SketchWrapper sketch={sketch.default} renderer={sketch.meta.renderer} />
    </div>
  );
};

const mdxRoutes = Object.entries(mdxPages).map(([name, MdxComponent]) => ({
  name: name.replace(/-/g, " "),
  path: name,
  element: (
    <MDXLayout>
      <MdxComponent />
    </MDXLayout>
  ),
}));

const sketchesRoutes = Object.entries(sketches)
  .filter(([name]) => name)
  .map(([name, sketch]) => {
    const mdxPath = mdxRoutes.find((route) => route.path === name);
    return {
      name: `${name.replace(/-/g, " ")}${mdxPath ? " (fullscreen)" : ""}`,
      path: mdxPath ? `${name}/fullscreen` : name,
      element: <FullscreenSketch sketch={sketch} />,
    };
  });

const routes = [
  ...mdxRoutes,
  ...sketchesRoutes,
  // {
  //   name: "computer observing itself",
  //   path: "computer-observing-itself",
  //   element: (
  //     <MDXLayout>
  //       <ComputerObservingItselfMdx />
  //     </MDXLayout>
  //   ),
  // },
  // {
  //   name: "events 📅",
  //   path: "events",
  //   element: (
  //     <MDXLayout>
  //       <EventsMdx />
  //     </MDXLayout>
  //   ),
  // },
  // {
  //   name: "flowtime",
  //   path: "flowtime",
  //   element: (
  //     <MDXLayout>
  //       <Flowtime />
  //     </MDXLayout>
  //   ),
  // },
  // {
  //   name: "infinite chaos",
  //   path: "infinite-chaos",
  //   element: (
  //     <MDXLayout>
  //       <InfiniteChaos />
  //     </MDXLayout>
  //   ),
  // },
  // {
  //   name: "code is a paintbrush",
  //   path: "code-is-a-paintbrush",
  //   element: (
  //     <MDXLayout>
  //       <CodeIsAPaintbrush />
  //     </MDXLayout>
  //   ),
  // },
  {
    name: "cv",
    path: "cv",
    element: (
      <ExternalRedirect to="https://ucodia.notion.site/Ucodia-CV-ca7805ca1c404dc58112ab885fe3f55e" />
    ),
  },
  {
    name: "contact",
    path: "contact",
    element: <ExternalRedirect to="https://linktr.ee/ucodia" />,
  },
  {
    name: "compovision",
    path: "compovision",
    element: (
      <ExternalRedirect to="https://www.instagram.com/reel/C7fOHZpS9Ut/" />
    ),
  },
  {
    name: "shop ✨",
    path: "shop",
    element: <ExternalRedirect to="https://ucodia.square.site" />,
  },
  {
    name: "mycologue 🍄",
    path: "mycologue",
    element: <ExternalRedirect to="https://mycologue.org" />,
  },
  {
    name: "bad rng",
    path: "bad-rng",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <BadRng />
      </Suspense>
    ),
  },
  { name: "giphy vox", path: "giphy-vox", element: <GiphyVox /> },
  { name: "kinetic", path: "kinetic", element: <Kinetic /> },
  { name: "manifest", path: "manifest", element: <Manifest /> },
  {
    name: "zukunft",
    path: "zukunft",
    element: <Zukunft />,
  },
  { name: "conundrum", path: "conundrum", element: <Conundrum /> },
  { name: "lorenz (for plotters)", path: "lorenz-svg", element: <LorenzSvg /> },
  { name: "seine", path: "seine", element: <Seine /> },
  {
    name: "36 days of type",
    path: "36days/2020",
    element: <ThirtySixDaysOfType />,
    disabled: true,
  },
  // {
  //   name: "diamonds",
  //   path: "diamonds",
  //   element: <FullscreenSketch sketch={diamonds} />,
  // },
  // {
  //   name: "circle clock",
  //   path: "circle-clock",
  //   element: <FullscreenSketch sketch={circleClock} />,
  // },
  // {
  //   name: "circuit",
  //   path: "circuit",
  //   element: <FullscreenSketch sketch={circuit} />,
  // },
  // {
  //   name: "dizzy waves",
  //   path: "dizzy-waves",
  //   element: <FullscreenSketch sketch={dizzyWaves} />,
  // },
  // {
  //   name: "area715",
  //   path: "area715",
  //   element: <FullscreenSketch sketch={area715} />,
  // },
  // {
  //   name: "illusions",
  //   path: "illusions",
  //   element: <FullscreenSketch sketch={illusions} />,
  // },
  // {
  //   name: "look above",
  //   path: "look-above",
  //   element: <FullscreenSketch sketch={lookAbove} />,
  // },
  // {
  //   name: "vintage",
  //   path: "vintage",
  //   element: <FullscreenSketch sketch={vintage} />,
  // },
  // {
  //   name: "scales",
  //   path: "scales",
  //   element: <FullscreenSketch sketch={scales} />,
  // },
  // {
  //   name: "drawbot",
  //   path: "drawbot",
  //   element: <FullscreenSketch sketch={drawbot} />,
  // },
  // {
  //   name: "revolutions",
  //   path: "revolutions",
  //   element: <FullscreenSketch sketch={revolutions} />,
  // },
  // {
  //   name: "fittest bubble bath",
  //   path: "fittest-bubble-bath",
  //   element: <FullscreenSketch sketch={fittestBubleBath} />,
  // },
  // {
  //   name: "lorenz",
  //   path: "lorenz",
  //   element: <FullscreenSketch sketch={lorenz} />,
  // },
  // {
  //   name: "cmy dance",
  //   path: "cmy-dance",
  //   element: <FullscreenSketch sketch={cmyDance} />,
  // },
  // {
  //   name: "squircle",
  //   path: "squircle",
  //   element: <FullscreenSketch sketch={squircle} />,
  // },
  // {
  //   name: "infinite chaos (fullscreen)",
  //   path: "infinite-chaos/fullscreen",
  //   element: <FullscreenSketch sketch={infiniteChaos} />,
  // },
  // {
  //   name: "spinny squares",
  //   path: "spinny-squares",
  //   element: <FullscreenSketch sketch={spinnySquares} />,
  // },
  // {
  //   name: "solar",
  //   path: "solar",
  //   element: <FullscreenSketch sketch={solar} />,
  // },
];

export default routes.filter(({ disabled }) => !disabled);

import React from "react";
import useURLParams from "@/hooks/useURLParams";
import U5Wrapper from "@/components/U5Wrapper";

const P5Wrapper = React.lazy(() => import(`./P5Wrapper`));

const SketchWrapper = ({ sketch, renderer = "p5" }) => {
  const urlParams = useURLParams();

  if (
    (renderer === "u5" || urlParams.renderer === "u5") &&
    urlParams.renderer !== "p5"
  ) {
    return <U5Wrapper sketch={sketch} />;
  }

  return (
    <React.Suspense fallback={<>...</>}>
      <P5Wrapper sketch={sketch} />
    </React.Suspense>
  );
};

export default SketchWrapper;

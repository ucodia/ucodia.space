import React from "react";
import useURLParams from "@/hooks/use-url-params";
import U5Wrapper from "@/components/u5-wrapper";
import LoadingSpinner from "@/components/loading-spinner";

const P5Wrapper = React.lazy(() => import(`./p5-wrapper`));

const SketchWrapper = ({ sketch, renderer = "p5" }) => {
  const urlParams = useURLParams();

  if (
    (renderer === "u5" || urlParams.renderer === "u5") &&
    urlParams.renderer !== "p5"
  ) {
    return <U5Wrapper sketch={sketch} />;
  }

  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <P5Wrapper sketch={sketch} />
    </React.Suspense>
  );
};

export default SketchWrapper;

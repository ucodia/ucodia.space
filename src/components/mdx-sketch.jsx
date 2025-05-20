import FullscreenOverlay from "@/components/fullscreen-overlay";
import SketchWrapper from "@/components/sketch-wrapper";

const MdxSketch = ({ sketch }) => {
  return (
    <div>
      <div className="relative rounded-lg overflow-hidden h-[600px]">
        <SketchWrapper
          sketch={sketch.default}
          renderer={sketch.meta.renderer}
        />
        <FullscreenOverlay />
      </div>
      <div className="mt-2 text-sm text-gray-600 text-center italic">
        {sketch.meta.name}
      </div>
    </div>
  );
};

export default MdxSketch;

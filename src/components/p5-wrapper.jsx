import React, { useRef, useEffect } from "react";
import p5 from "p5";

const P5Wrapper = ({ sketch }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    // prevent scrolling on mobile
    const preventScrolling = (event) => event.preventDefault();
    container.addEventListener("touchmove", preventScrolling, {
      passive: true,
    });
    return () => container.removeEventListener("touchmove", preventScrolling);
  }, []);

  useEffect(() => {
    const newP5Instance = new p5(sketch, containerRef.current);

    // cleanup when sketch changes
    return () => {
      newP5Instance.remove();
      if (newP5Instance.cleanup) {
        newP5Instance.cleanup();
      }
    };
  }, [sketch]);

  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default P5Wrapper;

import React, { useRef, useEffect, useState } from "react";
import p5 from "p5";

const P5Wrapper = ({ sketch }) => {
  const [, setP5Instance] = useState(null);
  const p5Container = useRef(null);
  useEffect(() => {
    if (p5Container.current) {
      const newP5Instance = new p5(sketch, p5Container.current);

      // prevent scrolling on mobile
      p5Container.current.addEventListener("touchmove", event =>
        event.preventDefault()
      );

      setP5Instance(newP5Instance);
    }
  }, [sketch]);

  return <div ref={p5Container} />;
};

export default P5Wrapper;

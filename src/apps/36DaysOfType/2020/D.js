import { debounce } from "lodash";
import autoStretchP5 from "../../../utils/autoStretchP5";
import cyclicIterator from "../../../utils/cyclicIterator";
import pointsToSegments from "../utils/pointsToSegments";

export default p5 => {
  let letter = "D";
  let font;
  let points;
  let bounds;
  let segments;
  let segmentsIterators = [];

  p5.preload = () => {
    font = p5.loadFont("fonts/Righteous-Regular.ttf");
  };

  const efficientLayout = debounce(layout, 400);

  function layout() {
    const fontSize = p5.height * 0.8;
    points = font.textToPoints(letter, 0, 0, fontSize, {
      sampleFactor: 2
    });
    bounds = font.textBounds(letter, 0, 0, fontSize);
    segments = pointsToSegments(points);
    segmentsIterators = segments.map(cyclicIterator);
  }

  p5.setup = () => {
    p5.createCanvas(100, 100);
    p5.frameRate(30);
    // p5.noLoop();

    autoStretchP5(p5, layout);
    p5.draw();
  };

  p5.draw = () => {
    p5.background("#0F146A");
    p5.fill("#FFBE03");
    p5.noStroke();

    // TODO: Fix the translation to always be centered automatically!
    //       This currently uses fixed offset that need to be changed
    //       and manually aligned based on container size...
    p5.translate(p5.width / 2 - bounds.w / 2 - 20, p5.width / 2 + bounds.h / 2);

    segmentsIterators.forEach(iterator => {
      // speed of movement
      iterator.cycle(Math.floor(iterator.items.length * 0.03));
      const points = iterator.items.slice(
        0,
        Math.floor(iterator.items.length / 2)
      );
      points.forEach(point => {
        p5.ellipse(point.x, point.y, 10, 10);
      });
    });

    // let capture = true;
    // let lastFrame = 34;
    // if (capture && p5.frameCount < lastFrame) {
    //   p5.saveCanvas(
    //     `36days_${letter}_${p5.frameCount.toString().padStart(6, "0")}`,
    //     "png"
    //   );
    // }
  };

  p5.keyTyped = () => {
    letter = p5.key;
    efficientLayout();
  };
};

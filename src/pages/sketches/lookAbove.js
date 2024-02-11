import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  slug: "look-above",
  name: "Look Above",
  created: "2015",
  updated: "2024-02-09",
};

const lookAbove = (sketch) => {
  let stars = [];
  let posX = 0;
  let posY = 0;

  const sx = {
    universeSize: 1080 * 4,
    starDensity: 0.001,
    lightPolution: 0.1,
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    const centerPos = Math.round(sx.universeSize / 2);
    posX = centerPos;
    posY = centerPos;

    const starCount = Math.round(
      sx.universeSize * sx.universeSize * sx.starDensity
    );
    generateStars(starCount);

    autoStretchP5(sketch);
  };

  sketch.draw = () => {
    sketch.background(0);
    sketch.noStroke();
    sketch.fill(`hsl(0 ,0% ,${(1 - sx.lightPolution) * 100}%)`);

    const deltaEdgeX = posX + sketch.width - sx.universeSize;
    const deltaEdgeY = posY + sketch.height - sx.universeSize;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const x = star.x - posX;
      const y = star.y - posY;

      // normal case
      if (x > 0 && x < sketch.width && y > 0 && y < sketch.height) {
        sketch.ellipse(x, y, star.starSize, star.starSize);
      }
      // beyond bottom right edge case
      else if (
        deltaEdgeX > 0 &&
        star.x < deltaEdgeX &&
        deltaEdgeY > 0 &&
        star.y < deltaEdgeY
      ) {
        sketch.ellipse(
          sketch.width - deltaEdgeX + star.x,
          sketch.height - deltaEdgeY + star.y,
          star.starSize,
          star.starSize
        );
      }
      // beyond right edge case
      else if (deltaEdgeX > 0 && star.x < deltaEdgeX) {
        sketch.ellipse(
          sketch.width - deltaEdgeX + star.x,
          y,
          star.starSize,
          star.starSize
        );
      }
      // beyond bottom edge case
      else if (deltaEdgeY > 0 && star.y < deltaEdgeY) {
        sketch.ellipse(
          x,
          sketch.height - deltaEdgeY + star.y,
          star.starSize,
          star.starSize
        );
      }
    }

    // draw the edge of the universe
    // sketch.stroke(255, 0, 0);
    // sketch.line(
    //   sketch.width - deltaEdgeX,
    //   0,
    //   sketch.width - deltaEdgeX,
    //   sketch.height
    // );
    // sketch.line(
    //   0,
    //   sketch.height - deltaEdgeY,
    //   sketch.width,
    //   sketch.height - deltaEdgeY
    // );
  };

  sketch.mouseDragged = () => {
    posX += sketch.pmouseX - sketch.mouseX;
    posY += sketch.pmouseY - sketch.mouseY;
    if (posX > sx.universeSize) posX -= sx.universeSize;
    if (posX < 0) posX += sx.universeSize;
    if (posY > sx.universeSize) posY -= sx.universeSize;
    if (posY < 0) posY += sx.universeSize;
  };

  function generateStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      const x = randomInt(0, sx.universeSize);
      const y = randomInt(0, sx.universeSize);
      const starSize = getStarSize();
      stars.push({ x: x, y: y, starSize });
    }
  }

  function getStarSize() {
    const n = Math.random();
    if (n < 0.0001) return 7;
    if (n < 0.001) return 6;
    if (n < 0.01) return 5;
    if (n < 0.1) return 4;
    if (n < 0.25) return 3;
    if (n < 0.5) return 2;
    return 1;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

export default lookAbove;

import { GUI } from "dat.gui";
import autoStretchP5 from "../../utils/autoStretchP5";

export const meta = {
  slug: "look-above",
  name: "Look Above",
  created: "2015",
  updated: "2024-02-09",
};

const defaultSx = {
  universeSize: 16000,
  starDensity: 0.0005,
  lightPolution: 0.1,
};

const lookAbove = (sketch) => {
  const sx = { ...defaultSx };

  let stars = [];
  let posX = 0;
  let posY = 0;
  let velocityX = 0;
  let velocityY = 0;
  const damping = 0.95;
  const inertia = 0.2;

  const gui = new GUI();
  gui.width = 300;
  gui.hide();
  gui.add(sx, "universeSize", 16000, 32000, 1000).onFinishChange(update);
  gui.add(sx, "starDensity", 0.00001, 0.001).onFinishChange(update);
  gui.add(sx, "lightPolution", 0, 0.8, 0.05);
  // prevent mouseDragged when using sliders
  gui.domElement.addEventListener("mousedown", (event) => {
    event.stopPropagation();
  });

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    autoStretchP5(sketch);

    randomizeFeatures();
    gui.updateDisplay();
    update();
  };

  function update() {
    const centerPos = Math.round(sx.universeSize / 2);
    posX = centerPos;
    posY = centerPos;
    const starCount = Math.round(
      sx.universeSize * sx.universeSize * sx.starDensity
    );
    generateStars(starCount);
  }

  sketch.draw = () => {
    // update position
    posX += velocityX;
    posY += velocityY;
    if (posX > sx.universeSize) posX -= sx.universeSize;
    if (posX < 0) posX += sx.universeSize;
    if (posY > sx.universeSize) posY -= sx.universeSize;
    if (posY < 0) posY += sx.universeSize;
    velocityX *= damping;
    velocityY *= damping;

    // draw sky
    sketch.background("#000C1A");
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

  sketch.mousePressed = () => {
    velocityX = 0;
    velocityY = 0;
  };

  sketch.mouseDragged = () => {
    velocityX += (sketch.pmouseX - sketch.mouseX) * inertia;
    velocityY += (sketch.pmouseY - sketch.mouseY) * inertia;
  };

  sketch.cleanup = () => {
    gui.destroy();
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

  function randomRange(start, end) {
    return sketch.map(Math.random(), 0, 1, start, end);
  }

  function getFeature(variants) {
    const variantsByRarity = variants.sort((a, b) => a.rarity - b.rarity);
    const value = Math.random();
    let runningSum = 0;

    for (let i = 0; i < variantsByRarity.length; i++) {
      const variant = variantsByRarity[i];
      runningSum += variant.rarity;
      if (value < runningSum) {
        return {
          name: variant.name,
          value: variant.value(),
        };
      }
    }
  }

  function randomizeFeatures() {
    const universeSizeFeature = getFeature([
      {
        name: "32K",
        rarity: 1 / 10,
        value: () => 32000,
      },
      {
        name: "24K",
        rarity: 1 / 5,
        value: () => 24000,
      },
      {
        name: "16K",
        rarity: 1,
        value: () => 16000,
      },
    ]);
    const starDensityFeature = getFeature([
      {
        name: "High",
        rarity: 1 / 10,
        value: () => randomRange(0.0008, 0.001),
      },
      {
        name: "Medium",
        rarity: 1,
        value: () => randomRange(0.0002, 0.0005),
      },
      {
        name: "Low",
        rarity: 1 / 5,
        value: () => randomRange(0.00001, 0.0001),
      },
    ]);
    const lightPolutionFeature = getFeature([
      {
        name: "High",
        rarity: 1 / 10,
        value: () => randomRange(0.4, 0.7),
      },
      {
        name: "Medium",
        rarity: 1 / 5,
        value: () => randomRange(0.1, 0.4),
      },
      {
        name: "Low",
        rarity: 1,
        value: () => randomRange(0.05, 0.1),
      },
    ]);

    sx.universeSize = universeSizeFeature.value;
    sx.starDensity = starDensityFeature.value;
    sx.lightPolution = lightPolutionFeature.value;
  }
};

export default lookAbove;

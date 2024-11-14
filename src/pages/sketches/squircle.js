import { GUI } from "lil-gui";
import { hsv } from "chroma-js";
import autoStretchP5 from "@/utils/autoStretchP5";

export const meta = {
  name: "Squircle",
  created: "2021-11-16",
};

const defaultSx = {
  lineCount: 18,
  marginRatio: 0.2,
  thickness: 2,
  squareness: 1,
  background: "#fff",
  stroke: "#000",
  transparent: true,
  noise: {
    seed: 2,
    res: 1 / 20,
  },
  radius: {
    fn: "linear",
    inc: 30,
    reverse: false,
  },
  rotate: {
    fn: "linear",
    inc: (Math.PI * 2) / 120,
    reverse: false,
  },
  translate: {
    fn: "none",
    inc: 3,
    reverse: false,
  },
};

const squircle = (sketch) => {
  const sx = { ...defaultSx };

  const gui = new GUI();
  gui.add(sx, "lineCount", 3, 500, 1);
  gui.add(sx, "thickness", 0.1, 10, 0.1);
  gui.add(sx, "squareness", 0, 1, 0.01);
  gui.add(sx, "marginRatio", 0, 1, 0.01);
  gui.addColor(sx, "background");
  gui.addColor(sx, "stroke");
  gui.add(sx, "transparent");
  const radiusFolder = gui.addFolder("radius");
  radiusFolder.open();
  radiusFolder.add(sx.radius, "fn", ["none", "fixed", "linear"]);
  radiusFolder.add(sx.radius, "inc", 1, 100);
  radiusFolder.add(sx.radius, "reverse");
  const rotateFolder = gui.addFolder("rotate");
  rotateFolder.open();
  rotateFolder.add(sx.rotate, "fn", ["none", "linear", "sin", "noise"]);
  rotateFolder.add(sx.rotate, "inc", 0, Math.PI / 4);
  rotateFolder.add(sx.rotate, "reverse");
  const translateFolder = gui.addFolder("translate");
  translateFolder.open();
  translateFolder.add(sx.translate, "fn", ["none", "fixed", "linear"]);
  translateFolder.add(sx.translate, "inc", -500, 500, 0.01);
  translateFolder.add(sx.translate, "reverse");
  const actions = {
    randomize: () => {
      randomizeFeatures();
      sketch.draw();
    },
    save: () => {
      const svg = sketch.createGraphics(
        sketch.windowWidth,
        sketch.windowHeight,
        sketch.SVG
      );
      svg.rectMode(sketch.CENTER);
      sketch.draw(svg);
      svg.save(`squircle-${sx.noise.seed}.svg`);
    },
  };
  Object.keys(actions).forEach((name) => gui.add(actions, name));

  const data = { colors: {}, palettes: {} };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.colorMode(sketch.HSB);
    sketch.rectMode(sketch.CENTER);

    data.colors = {
      black: "#000000",
      white: "#ffffff",
    };
    data.palettes = {
      bw: [data.colors.black, data.colors.white],
    };

    randomizeFeatures();
    autoStretchP5(sketch);
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        actions.save();
        break;
      }
      case "n": {
        actions.randomize();
      }
    }
  };

  sketch.draw = (ctx) => {
    if (!ctx) ctx = sketch;

    ctx.clear();
    ctx.background(sx.background);
    ctx.stroke(sx.stroke);
    ctx.strokeWeight(sx.thickness);
    if (sx.transparent) {
      ctx.noFill();
    } else {
      ctx.fill(sx.background);
    }

    const minSide = getMinSide();
    const portrait = minSide === ctx.width;
    const maxWidth = minSide * (1 - sx.marginRatio);
    const minWidth = minSide * 0.01;
    const inc = (maxWidth - minWidth) / (sx.lineCount - 1);

    for (let i = 0; i < sx.lineCount; i++) {
      const rot = getRotation(sx, i);
      const trans = getTranslation(sx, i);
      const rads = getRadiuses(sx, i);
      const w = maxWidth - i * inc;

      ctx.push();
      ctx.translate(ctx.width / 2, ctx.height / 2);
      ctx.rotate(rot);
      ctx.translate(-ctx.width / 2 + trans, -ctx.height / 2 + trans);
      ctx.rect(
        ctx.width / 2,
        ctx.height / 2,
        portrait ? w * sx.squareness : w,
        portrait ? w : w * sx.squareness,
        ...rads
      );
      ctx.pop();
    }

    // ctx.noLoop();
  };

  sketch.cleanup = () => {
    gui.destroy();
  };

  function getMinSide() {
    return Math.min(sketch.width, sketch.height);
  }

  function getRotation(sx, i) {
    switch (sx.rotate.fn) {
      case "linear": {
        return sx.rotate.inc * i * (sx.rotate.reverse ? -1 : 1);
      }
      case "sin": {
        const period = sx.lineCount;
        const pos = sketch.map(i % period, 0, period, 0, sketch.TWO_PI);
        const factor = sketch.map(Math.sin(pos), 0, 1, -1, 1);
        return (sx.rotate.inc / (period * 0.3)) * 4 * i * factor;
      }
      case "noise": {
        sketch.noiseSeed(sx.noise.seed);
        return (
          sx.rotate.inc *
          sketch.map(sketch.noise(i * sx.noise.res), 0, 1, -0.5, 0.5) *
          10
        );
      }
      default: {
        return 0;
      }
    }
  }

  function getTranslation({ translate }, i) {
    switch (translate.fn) {
      case "fixed": {
        return translate.inc;
      }
      case "linear": {
        return translate.inc * i * (translate.reverse ? -1 : 1);
      }
      default: {
        return 0;
      }
    }
  }

  function getRadiuses({ radius, lineCount }, i) {
    switch (radius.fn) {
      case "fixed": {
        return [radius.inc, radius.inc, radius.inc, radius.inc];
      }
      case "linear": {
        const r = radius.reverse
          ? sketch.map(i, 0, lineCount - 1, getMinSide() * 0.1, 0)
          : sketch.map(i, 0, lineCount - 1, 0, getMinSide() * 0.1);
        return [r, r, r, r];
      }
      default: {
        return [0, 0, 0, 0];
      }
    }
  }

  // palette generation

  function hueDivisions(offset, n, hueMax = 360) {
    const hues = [];
    const inc = hueMax / n;
    for (let i = 0; i < n; i++) {
      hues.push(Math.round((offset * hueMax + i * inc) % hueMax));
    }
    return hues;
  }

  function bw(offset) {
    return offset < 0.5
      ? data.palettes.bw.slice()
      : data.palettes.bw.slice().reverse();
  }

  function complementary(offset) {
    return hueDivisions(offset, 2).map((h) => hsv(h, 1, 1).hex());
  }

  function triadic(offset) {
    return hueDivisions(offset, 3).map((h) => hsv(h, 1, 1).hex());
  }

  function analogous(offset) {
    return hueDivisions(offset, 12).map((h) => hsv(h, 1, 1).hex());
  }

  // feature generation

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
          value: variant.value(Math.random),
        };
      }
    }
  }

  function randomizeFeatures() {
    const densityVariants = [
      {
        name: "High",
        rarity: 1 / 30,
        value: (rand) => Math.round(sketch.map(rand(), 0, 1, 51, 100)),
      },
      {
        name: "Medium",
        rarity: 1 / 10,
        value: (rand) => Math.round(sketch.map(rand(), 0, 1, 31, 50)),
      },
      {
        name: "Low",
        rarity: 1,
        value: (rand) => Math.round(sketch.map(rand(), 0, 1, 10, 30)),
      },
    ];
    const rotationVariants = [
      {
        name: "Noisy",
        rarity: 1 / 30,
        value: () => "noise",
      },
      {
        name: "Linear",
        rarity: 2 / 5,
        value: () => "linear",
      },
      {
        name: "Sinusoid",
        rarity: 2 / 5,
        value: () => "sin",
      },
      {
        name: "None",
        rarity: 1,
        value: () => "none",
      },
    ];
    const rotationStrengthVariants = [
      {
        name: "High",
        rarity: 1 / 10,
        value: (rand) => (Math.PI * 2) / sketch.map(rand(), 0, 1, 30, 60),
      },
      {
        name: "Medium",
        rarity: 1 / 5,
        value: (rand) => (Math.PI * 2) / sketch.map(rand(), 0, 1, 60, 120),
      },
      {
        name: "Low",
        rarity: 1,
        value: (rand) => (Math.PI * 2) / sketch.map(rand(), 0, 1, 120, 360),
      },
    ];
    const radiusVariants = [
      {
        name: "Linear",
        rarity: 2 / 5,
        value: () => "linear",
      },
      {
        name: "None",
        rarity: 1,
        value: () => "none",
      },
    ];

    const paletteOffset = Math.random();
    const paletteVariants = [
      {
        name: "Complementary",
        rarity: 1 / 3,
        value: () => complementary(paletteOffset),
      },
      {
        name: "Analogous",
        rarity: 1 / 3,
        value: () => analogous(paletteOffset),
      },
      { name: "Triadic", rarity: 1, value: () => triadic(paletteOffset) },
    ];
    const paletteFeature = getFeature(paletteVariants);

    const colorVariant = [
      {
        name: "Black & White",
        rarity: 1 / 2,
        value: () => bw(paletteOffset),
      },
      { name: "Color", rarity: 1 / 2, value: () => paletteFeature.value },
    ];
    const paperColorFeature = getFeature(colorVariant);
    const inkColorFeature = getFeature(colorVariant);

    const densityFeature = getFeature(densityVariants);
    const rotationFeature = getFeature(rotationVariants);
    let rotationStrengthFeature = {
      name: "None",
      value: 0,
    };
    if (rotationFeature.value !== "none") {
      rotationStrengthFeature = getFeature(rotationStrengthVariants);
    }
    const radiusFeature = getFeature(radiusVariants);

    sx.noise.seed = sketch.map(Math.random(), 0, 1, 0, 10000);
    sx.lineCount = densityFeature.value;
    sx.rotate.fn = rotationFeature.value;
    sx.rotate.inc = rotationStrengthFeature.value;
    sx.rotate.reverse = Math.random() > 0.5;
    sx.radius.fn = radiusFeature.value;
    sx.background = paperColorFeature.value[0];
    sx.stroke = inkColorFeature.value[1];

    console.log(sx);
    gui.controllersRecursive().forEach((c) => c.updateDisplay());
  }
};

export default squircle;

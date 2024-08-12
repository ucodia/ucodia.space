import autoStretchP5 from "@/utils/autoStretchP5";

export const meta = {
  name: "Circle Clock",
  created: "2021-10-12",
  renderer: "u5",
};

const circleClock = (sketch) => {
  let darkBg = window.matchMedia("(prefers-color-scheme: dark)").matches;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.frameRate(25);
    sketch.noStroke();
    autoStretchP5(sketch);
  };

  sketch.draw = () => {
    const bodyR = Math.min(sketch.width, sketch.height) * 0.4;
    const { hour, minute, second } = getHandsCircles(new Date(), bodyR);

    sketch.background(darkBg ? "black" : "white");
    sketch.translate(sketch.width / 2, sketch.height / 2);

    sketch.fill(darkBg ? "white" : "black");
    sketch.circle(0, 0, bodyR * 2);
    sketch.fill(darkBg ? "black" : "white");
    sketch.circle(hour.x, hour.y, hour.r * 2);
    sketch.fill(darkBg ? "white" : "black");
    sketch.circle(minute.x, minute.y, minute.r * 2);
    sketch.fill(darkBg ? "black" : "white");
    sketch.circle(second.x, second.y, second.r * 2);
  };

  sketch.doubleClicked = () => {
    darkBg = !darkBg;
  };
};

function getHandsCircles(date, radius = 1) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const milli = date.getMilliseconds();

  const hourOffset = map(minute, 0, 60, 0, 1);
  const minuteOffset = map(second, 0, 60, 0, 1);
  const secondOffset = map(milli, 0, 1000, 0, 1);
  const hourA =
    map((hour % 12) + hourOffset, 0, 12, 0, Math.PI * 2) - Math.PI * 0.5;
  const minuteA =
    map(minute + minuteOffset, 0, 60, 0, Math.PI * 2) - Math.PI * 0.5;
  const secondA =
    map(second + secondOffset, 0, 60, 0, Math.PI * 2) - Math.PI * 0.5;

  // 3/4 2/3 1/2 design
  const hourR = radius * (3 / 4);
  const minuteR = hourR * (2 / 3);
  const secondR = minuteR * (1 / 2);

  const posOnRadius = pointOnCircle(0, 0, hourA, radius);
  const hourPos = pointOnCircle(...posOnRadius, hourA + Math.PI, hourR);
  const posOnHours = pointOnCircle(...hourPos, minuteA, hourR);
  const minutePos = pointOnCircle(...posOnHours, minuteA + Math.PI, minuteR);
  const posOnMinutes = pointOnCircle(...minutePos, secondA, minuteR);
  const secondPos = pointOnCircle(...posOnMinutes, secondA + Math.PI, secondR);

  return {
    hour: { x: hourPos[0], y: hourPos[1], r: hourR },
    minute: { x: minutePos[0], y: minutePos[1], r: minuteR },
    second: { x: secondPos[0], y: secondPos[1], r: secondR },
  };
}

function map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function pointOnCircle(x, y, angle, radius) {
  return [radius * Math.cos(angle) + x, radius * Math.sin(angle) + y];
}

export default circleClock;

// circle clock
// 2021-10-12
// lionel ringenbach

const circleClock = (sketch) => {
  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.blendMode(sketch.DIFFERENCE);
    sketch.noStroke();
    sketch.fill(255);
  };

  sketch.draw = () => {
    sketch.clear();
    sketch.background(255);

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const millis = now.getMilliseconds();
    const minSide = Math.min(sketch.width, sketch.height);
    const centerX = sketch.width / 2;
    const centerY = sketch.height / 2;

    const outerR = minSide * 0.4;
    const hoursR = minSide * 0.3;
    const minutesR = minSide * 0.2;
    const secondsR = minSide * 0.1;
    const hoursA = sketch.map(
      (hours % 12) + sketch.map(minutes, 0, 60, 0, 1),
      0,
      12,
      -sketch.HALF_PI,
      sketch.TWO_PI - sketch.HALF_PI
    );
    const minutesA = sketch.map(
      minutes + sketch.map(seconds, 0, 60, 0, 1),
      0,
      60,
      -sketch.HALF_PI,
      sketch.TWO_PI - sketch.HALF_PI
    );
    const secondsA = sketch.map(
      seconds + sketch.map(millis, 0, 1000, 0, 1),
      0,
      60,
      -sketch.HALF_PI,
      sketch.TWO_PI - sketch.HALF_PI
    );

    const posOnOuter = pointOnCircle(centerX, centerY, hoursA, outerR);
    const hoursCenter = pointOnCircle(
      posOnOuter.x,
      posOnOuter.y,
      hoursA + sketch.PI,
      hoursR
    );
    const posOnHours = pointOnCircle(
      hoursCenter.x,
      hoursCenter.y,
      minutesA,
      hoursR
    );
    const minutesCenter = pointOnCircle(
      posOnHours.x,
      posOnHours.y,
      minutesA + sketch.PI,
      minutesR
    );
    const posOnMinutes = pointOnCircle(
      minutesCenter.x,
      minutesCenter.y,
      secondsA,
      minutesR
    );
    const secondsCenter = pointOnCircle(
      posOnMinutes.x,
      posOnMinutes.y,
      secondsA + sketch.PI,
      secondsR
    );

    sketch.ellipse(centerX, centerY, outerR * 2, outerR * 2);
    sketch.ellipse(hoursCenter.x, hoursCenter.y, hoursR * 2, hoursR * 2);
    sketch.ellipse(
      minutesCenter.x,
      minutesCenter.y,
      minutesR * 2,
      minutesR * 2
    );
    sketch.ellipse(
      secondsCenter.x,
      secondsCenter.y,
      secondsR * 2,
      secondsR * 2
    );
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };

  const pointOnCircle = (x, y, angle, radius) => {
    return {
      x: radius * Math.cos(angle) + x,
      y: radius * Math.sin(angle) + y,
    };
  };
};

export default circleClock;

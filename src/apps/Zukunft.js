import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import randomInt from "../utils/randomInt";

const Canvas = styled.svg`
  background-color: #000;
  cursor: pointer;

  .outline {
    stroke: #222;
    fill: #000;
  }

  .dot {
    fill: #fff;
  }

  .dice1 .dot1 {
    visibility: hidden;
  }
  .dice1 .dot2 {
    visibility: hidden;
  }
  .dice1 .dot3 {
    visibility: hidden;
  }
  .dice1 .dot4 {
    visibility: hidden;
  }
  .dice1 .dot5 {
    visibility: visible;
  }
  .dice1 .dot6 {
    visibility: hidden;
  }
  .dice1 .dot7 {
    visibility: hidden;
  }
  .dice1 .dot8 {
    visibility: hidden;
  }
  .dice1 .dot9 {
    visibility: hidden;
  }

  .dice2 .dot1 {
    visibility: hidden;
  }
  .dice2 .dot2 {
    visibility: hidden;
  }
  .dice2 .dot3 {
    visibility: visible;
  }
  .dice2 .dot4 {
    visibility: hidden;
  }
  .dice2 .dot5 {
    visibility: hidden;
  }
  .dice2 .dot6 {
    visibility: hidden;
  }
  .dice2 .dot7 {
    visibility: visible;
  }
  .dice2 .dot8 {
    visibility: hidden;
  }
  .dice2 .dot9 {
    visibility: hidden;
  }

  .dice3 .dot1 {
    visibility: hidden;
  }
  .dice3 .dot2 {
    visibility: hidden;
  }
  .dice3 .dot3 {
    visibility: visible;
  }
  .dice3 .dot4 {
    visibility: hidden;
  }
  .dice3 .dot5 {
    visibility: visible;
  }
  .dice3 .dot6 {
    visibility: hidden;
  }
  .dice3 .dot7 {
    visibility: visible;
  }
  .dice3 .dot8 {
    visibility: hidden;
  }
  .dice3 .dot9 {
    visibility: hidden;
  }

  .dice4 .dot1 {
    visibility: visible;
  }
  .dice4 .dot2 {
    visibility: hidden;
  }
  .dice4 .dot3 {
    visibility: visible;
  }
  .dice4 .dot4 {
    visibility: hidden;
  }
  .dice4 .dot5 {
    visibility: hidden;
  }
  .dice4 .dot6 {
    visibility: hidden;
  }
  .dice4 .dot7 {
    visibility: visible;
  }
  .dice4 .dot8 {
    visibility: hidden;
  }
  .dice4 .dot9 {
    visibility: visible;
  }

  .dice5 .dot1 {
    visibility: visible;
  }
  .dice5 .dot2 {
    visibility: hidden;
  }
  .dice5 .dot3 {
    visibility: visible;
  }
  .dice5 .dot4 {
    visibility: hidden;
  }
  .dice5 .dot5 {
    visibility: visible;
  }
  .dice5 .dot6 {
    visibility: hidden;
  }
  .dice5 .dot7 {
    visibility: visible;
  }
  .dice5 .dot8 {
    visibility: hidden;
  }
  .dice5 .dot9 {
    visibility: visible;
  }

  .dice6 .dot1 {
    visibility: visible;
  }
  .dice6 .dot2 {
    visibility: hidden;
  }
  .dice6 .dot3 {
    visibility: visible;
  }
  .dice6 .dot4 {
    visibility: visible;
  }
  .dice6 .dot5 {
    visibility: hidden;
  }
  .dice6 .dot6 {
    visibility: visible;
  }
  .dice6 .dot7 {
    visibility: visible;
  }
  .dice6 .dot8 {
    visibility: hidden;
  }
  .dice6 .dot9 {
    visibility: visible;
  }
`;

const zukunft = (svgElement) => {
  // app settings
  var settings = {};
  settings.diceSize = 30;
  settings.diceCorner = settings.diceSize / 5;
  settings.dotSize = settings.diceSize / 10;

  // app data
  var dataset = [];

  // select svg
  var svg = d3.select(svgElement);

  // hookup events
  const handleResize = () => {
    layout();
    gen();
    draw();
  };
  const handleClick = () => {
    gen();
    draw();
  };
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleClick);

  // startup
  layout();
  gen();
  draw();

  // TODO: fix this
  //       draw needs to be called twice for some reason
  //       otherwise dices do not receive data and transform
  draw();

  function layout() {
    svg.attr("width", window.innerWidth);
    svg.attr("height", window.innerHeight);
    settings.columns = Math.ceil(window.innerWidth / settings.diceSize);
    settings.rows = Math.ceil(window.innerHeight / settings.diceSize);
  }

  function gen() {
    var count = settings.columns * settings.rows;
    dataset.splice(0, count);

    for (var i = 0; i < count; i++) {
      dataset[i] = {
        value: randomInt(1, 6),
        orientation: randomInt(0, 1),
      };
    }
  }

  function draw() {
    // data join
    var dices = svg.selectAll(".dice").data(dataset);

    // add new elements
    var entering = dices.enter().append("g").attr("class", "dice");

    appendDiceTo(entering);

    // update elements
    dices
      .attr("class", function (d, i) {
        return "dice dice" + d.value;
      })
      .attr("transform", function (d, i) {
        var col = i % settings.columns;
        var row = Math.floor(i / settings.columns);

        const translate = `translate(${col * settings.diceSize}, ${
          row * settings.diceSize
        })`;
        const rotate = `rotate(${d.orientation * 90}, ${
          settings.diceSize / 2
        }, ${settings.diceSize / 2})`;

        return `${translate} ${rotate}`;
      });

    // remove old elements
    var exiting = dices.exit();
    exiting.remove();
  }

  function appendDiceTo(element) {
    element
      .append("rect")
      .attr("class", "outline")
      .attr("width", settings.diceSize)
      .attr("height", settings.diceSize)
      .attr("rx", settings.diceCorner)
      .attr("ry", settings.diceCorner);

    for (var i = 0; i < 9; i++) {
      element
        .append("ellipse")
        .attr("class", "dot dot" + (i + 1))
        .attr("cx", (settings.diceSize / 4) * ((i % 3) + 1))
        .attr("cy", (settings.diceSize / 4) * (Math.floor(i / 3) + 1))
        .attr("rx", settings.dotSize)
        .attr("ry", settings.dotSize);
    }
  }

  return {
    remove: () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClick);
    },
  };
};

const Zukunft = () => {
  const svgRef = useRef(null);
  useEffect(() => {
    const { remove } = zukunft(svgRef.current);
    return () => remove();
  }, []);

  return <Canvas ref={svgRef} />;
};

export default Zukunft;

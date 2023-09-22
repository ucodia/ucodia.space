import React, { useState } from "react";
import styled from "styled-components";
import { fromNow } from "flowtime";
import useInterval from "../../hooks/useInterval";

export const meta = {
  name: "Flowtime",
  created: "2018-07-09",
};

const timeFormatter = new Intl.DateTimeFormat(
  Intl.DateTimeFormat().resolvedOptions().locale,
  { timeStyle: "medium" }
);

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-auto-rows: 1fr;
  width: 100%;
  height: 100%;
  user-select: none;
  cursor: pointer;
  color: #000000;

  animation-name: background-gradient;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-direction: alternate;

  @keyframes background-gradient {
    from {
      background-color: #00c3ff;
    }
    to {
      background-color: #ffff1c;
    }
  }
`;

const Header = styled.h1`
  text-align: center;
  font-weight: 100;
  background-color: white;
  margin: 0;
  padding 16px;
  box-shadow: rgb(51, 51, 51) 0px 0px 10px;
  font-size: 3rem;

  @media only screen and (min-width: 1024px) {
    font-size: 4rem;
  }
`;

const Time = styled.code`
  text-align: center;
  align-self: center;
  font-size: 3rem;

  @media only screen and (min-width: 768px) {
    font-size: 5rem;
  }

  @media only screen and (min-width: 1024px) {
    font-size: 7rem;
  }
`;

const Flowtime = () => {
  const [time, setTime] = useState(fromNow().toDate());
  const [realityCheck, setRealityCheck] = useState(false);
  useInterval(() => {
    setTime(realityCheck ? new Date() : fromNow().toDate());
  }, 1000);

  const showReality = () => {
    setRealityCheck(true);
    setTime(new Date());
  };
  const showFlowtime = () => {
    setRealityCheck(false);
    setTime(fromNow().toDate());
  };

  return (
    <Container
      onMouseDown={showReality}
      onTouchStart={showReality}
      onMouseUp={showFlowtime}
      onTouchEnd={showFlowtime}
    >
      <Header>~ flowtime ~</Header>
      <Time>{timeFormatter.format(time)}</Time>
    </Container>
  );
};

export default Flowtime;

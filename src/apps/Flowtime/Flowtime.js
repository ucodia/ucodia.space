import React, { useState } from "react";
import styled from "styled-components";
import { fromNow } from "flowtime";
import useInterval from "../../utils/useInterval";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  -user-select: none;

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

const Time = styled.div`
  font-size: 3rem;

  @media only screen and (min-width: 768px) {
    font-size: 5rem;
  }

  @media only screen and (min-width: 1200px) {
    font-size: 7rem;
  }
`;

const Flowtime = () => {
  const [time, setTime] = useState(fromNow().toDate());
  const [realityCheck, setRealityCheck] = useState(false);
  useInterval(() => {
    setTime(realityCheck ? new Date() : fromNow().toDate());
  }, 1000);

  return (
    <Container
      onTouchStart={() => setRealityCheck(true)}
      onTouchEnd={() => setRealityCheck(false)}
    >
      <Time>{time.toLocaleTimeString()}</Time>
    </Container>
  );
};

export default Flowtime;

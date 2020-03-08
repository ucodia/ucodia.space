import React from "react";
import P5Wrapper from "../../components/P5Wrapper";
import D from "./2020/D";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  jusitify-content: center;

  flex-direction: row;
  @media only screen and (max-width: 425px) {
    flex-direction: column;
  }

  & > div {
  }
`;
const Frame = styled.div`
  margin: 30px;
  height: 60vh;
  width: 60vh;
  @media only screen and (max-width: 425px) {
    height: 60vw;
    width: 60vw;
  }
`;
const ThirtySixDaysOfType = () => {
  return (
    <Container>
      <Frame>
        <P5Wrapper sketch={D} />
      </Frame>
    </Container>
  );
};

export default ThirtySixDaysOfType;

import React from "react";
import P5Wrapper from "../../components/P5Wrapper";
// import D from "./2020/D";
// import e from "./2020/e";
import f from "./2020/f";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  jusitify-content: center;

  flex-direction: row;
  @media only screen and (max-width: 425px) {
    flex-direction: column;
  }
`;
const Frame = styled.div`
  margin: 30px;
  height: 60vh;
  width: 60vh;
  // height: 540px;
  // width: 540px;
  @media only screen and (max-width: 425px) {
    height: 60vw;
    width: 60vw;
  }
`;

const ThirtySixDaysOfType = () => {
  return (
    <Container>
      <Frame>
        {/* <P5Wrapper sketch={D} /> */}
        {/* <P5Wrapper sketch={e} /> */}
        <P5Wrapper sketch={f} />
      </Frame>
    </Container>
  );
};

export default ThirtySixDaysOfType;

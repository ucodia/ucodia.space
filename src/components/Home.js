import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as LogoSvg } from "../svg/ucodia-logo.svg";
import { singleDiamond } from "../apps/sketches/diamonds";
import apps from "../apps";
import P5Wrapper from "./P5Wrapper";

const Container = styled.div`
  padding: 50px 0;
  color: ${({ theme }) => theme.fg};
  background-color: ${({ theme }) => theme.bg};
`;
const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const Sketch = styled.div`
  margin-right: 50px;
  height: 200px;
  width: 200px;

  @media only screen and (max-width: 425px) {
    margin-right: 25px;
    height: 100px;
    width: 100px;
  }
`;
const Logo = styled(LogoSvg)`
  height: 100px;
  fill: ${({ theme }) => theme.fg};

  @media only screen and (max-width: 425px) {
    height: 50px;
  }
`;
const List = styled.div`
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const StyledLink = styled(Link)`
  padding: 10px;
  text-decoration: none;
  color: ${(props) => props.color};
  font-size: 3rem;
  @media only screen and (max-width: 425px) {
    font-size: 2rem;
  }
`;

const Home = ({ appsByName = apps }) => {
  return (
    <Container>
      <Heading>
        <Sketch>
          <P5Wrapper sketch={singleDiamond} />
        </Sketch>
        <Logo />
      </Heading>
      <List>
        {Object.keys(appsByName)
          .sort()
          .map((key, index, items) => {
            const inc = Math.round(360 / items.length);
            const color = `hsl(${index * inc}, 80%, 60%)`;
            return (
              <StyledLink color={color} key={key} to={key}>
                {key}
              </StyledLink>
            );
          })}
      </List>
    </Container>
  );
};

export default Home;

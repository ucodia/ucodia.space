import styled from "styled-components";

const FullScreen = styled.div`
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  align-items: center;
  justify-content: center;

  color: #000000;
  background-color: #ffffff;

  @media (prefers-color-scheme: dark) {
    color: #ededed;
    background-color: #121212;
  }
`;

export default FullScreen;

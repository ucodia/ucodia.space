import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  color: #121212;
  @media (prefers-color-scheme: dark) {
    color: #ededed;
  }
`;

const Alert = ({ title, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
      <StyledLink to="/">← Back to home</StyledLink>
    </div>
  );
};

export default Alert;

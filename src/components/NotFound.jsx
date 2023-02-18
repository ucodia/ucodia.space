import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  color: #121212;
  @media (prefers-color-scheme: dark) {
    color: #ededed;
  }
`

const NotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <p>Ceci n'est pas une page.</p>
      <StyledLink to="/">← Back to home</StyledLink>
    </div>
  );
};

export default NotFound;

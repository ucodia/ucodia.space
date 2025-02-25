const ExternalLink = (props) => {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
};

export default ExternalLink;

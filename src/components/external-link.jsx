const ExternalLink = (props) => {
  return (
    <a href={props.to} target="_blank" rel="noopener noreferrer" {...props}>
      {props.children}
    </a>
  );
};

export default ExternalLink;

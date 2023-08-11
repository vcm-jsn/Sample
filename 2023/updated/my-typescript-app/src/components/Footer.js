function Footer(props) {
  const footerStyle = {
    backgroundColor: "green",
    color: "white",
    padding: "10px",
    position: "fixed",
    bottom: "0",
    width: "100%",
  };
  return (
    <p style={footerStyle}>
      {" "}
      Hey {props.firstName} Testing This is the footer.
    </p>
  );
}

export default Footer;

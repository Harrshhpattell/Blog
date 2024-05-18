import React from "react";
import Logo from "../img/logo.png";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="" />
      <span>
        <b>React.js, Node.js, Mysql ( react query, socket.io )</b>.
      </span>
    </footer>
  );
};

export default Footer;

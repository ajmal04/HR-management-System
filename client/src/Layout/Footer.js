import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer" style={{ textAlign: "center", padding: "1rem", background: "#f5f5f5" }}>
      <strong className="mr-1">
        © {currentYear} <a href="https://shanmugha.edu.in/" target="_blank" rel="noopener noreferrer">Sri Shanmugha Educational Institution</a>.
      </strong> All rights reserved.
      <div style={{ marginTop: "0.5rem" }}>
        <b>Version</b> 1.0.0
      </div>
    </footer>
  );
};

export default Footer;

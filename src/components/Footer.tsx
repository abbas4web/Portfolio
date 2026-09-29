import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Footer.scss'

function Footer() {
  return (
    <footer>
      <div>
        <a href="https://github.com/abbas4web" target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon/></a>
        <a href="https://linkedin.com/in/mrshaikhabbas" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a>
      </div>
      <p>A portfolio designed & built by <a href="https://linkedin.com/in/mrshaikhabbas" target="_blank" rel="noreferrer">Shaikh Abbas</a></p>
    </footer>
  );
}

export default Footer;
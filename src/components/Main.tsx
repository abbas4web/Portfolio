import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';

function Main() {

  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img src="https://my-aws-assets.s3.us-west-2.amazonaws.com/portfolio-img/avatar_circle.jpeg" alt="Shaikh Abbas - Senior Software Engineer" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/abbas4web" target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon/></a>
            <a href="https://linkedin.com/in/mrshaikhabbas" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a>
          </div>
          <h1>Shaikh Abbas</h1>
          <p>Senior Software Engineer</p>

          <div className="mobile_social_icons">
            <a href="https://github.com/abbas4web" target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon/></a>
            <a href="https://linkedin.com/in/mrshaikhabbas" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
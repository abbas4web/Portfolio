import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Footer.scss'

interface FooterProps {
  profile?: any;
}

function Footer({ profile }: FooterProps) {
  const fullName = profile?.fullName || "Shaikh Abbas";
  const githubLink = profile?.socialLinks?.find((s: any) => s.platform.toLowerCase().includes('github'))?.url || "https://github.com/abbas4web";
  const linkedinLink = profile?.socialLinks?.find((s: any) => s.platform.toLowerCase().includes('linkedin'))?.url || "https://linkedin.com/in/mrshaikhabbas";

  return (
    <footer>
      <div>
        <a href={githubLink} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon/></a>
        <a href={linkedinLink} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a>
      </div>
      <p>A portfolio designed & built by <a href={linkedinLink} target="_blank" rel="noreferrer">{fullName}</a></p>
    </footer>
  );
}

export default Footer;
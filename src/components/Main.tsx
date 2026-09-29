import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';

interface MainProps {
  profile?: any;
}

function Main({ profile }: MainProps) {
  const fullName = profile?.fullName || "Shaikh Abbas";
  const title = profile?.title || "Senior Software Engineer";
  const avatarUrl = profile?.avatarUrl || "https://my-aws-assets.s3.us-west-2.amazonaws.com/portfolio-img/avatar_circle.jpeg";
  const avatarAlt = profile?.avatarAlt || `${fullName} - ${title}`;
  
  // Extract social links if provided by API
  const githubLink = profile?.socialLinks?.find((s: any) => s.platform.toLowerCase().includes('github'))?.url || "https://github.com/abbas4web";
  const linkedinLink = profile?.socialLinks?.find((s: any) => s.platform.toLowerCase().includes('linkedin'))?.url || "https://linkedin.com/in/mrshaikhabbas";

  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img
            src={avatarUrl}
            alt={avatarAlt}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = "https://my-aws-assets.s3.us-west-2.amazonaws.com/portfolio-img/avatar_circle.jpeg";
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href={githubLink} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon/></a>
            <a href={linkedinLink} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a>
          </div>
          <h1>{fullName}</h1>
          <p>{title}</p>

          <div className="mobile_social_icons">
            <a href={githubLink} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon/></a>
            <a href={linkedinLink} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
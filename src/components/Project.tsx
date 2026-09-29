import React from "react";
import mock01 from '../assets/images/mock01.png';
import mock02 from '../assets/images/mock02.png';
import mock03 from '../assets/images/mock03.png';
import '../assets/styles/Project.scss';

interface ProjectProps {
  projects?: any[];
}

function Project({ projects }: ProjectProps) {
    const defaultMocks = [mock01, mock02, mock03];

    const projectList = projects && projects.length > 0 ? projects : [
      {
        id: '1',
        title: 'AI Office Portal — Agentic AI Platform',
        description: 'Architected and developed a multi-agent AI office management platform featuring Orchestrator, Email, Task, Manager, and Info agents. Implemented an advanced agentic chat loop with tool execution feedback for multi-step reasoning, integrated Google Gemini via OpenAI SDK compatibility, and automated email parsing/notification workflows with a dynamic React.js UI.',
        image: mock01,
        githubUrl: 'https://github.com/abbas4web'
      },
      {
        id: '2',
        title: 'GymHub — Gym Management Mobile App',
        description: 'Developed a comprehensive Gym Management Mobile Application using React Native with custom Figma UI/UX. Features role-based access control (Admin, Client, Employee), automated member subscriptions, attendance tracking, personalized diet and workout schedules, and streamlined gym operations.',
        image: mock02,
        githubUrl: 'https://github.com/abbas4web'
      },
      {
        id: '3',
        title: 'Salat Ride — Ride Sharing Mobile App',
        description: 'Built a dedicated ride-sharing mobile application in React Native and Tailwind CSS for community mosque-goers. Integrated Google Maps API for precise location tracking, distance calculations, and dynamic routing, backed by Node.js, Express.js, and PostgreSQL for robust relational data handling.',
        image: mock03,
        githubUrl: 'https://github.com/abbas4web'
      }
    ];

    return(
    <div className="projects-container" id="projects">
        <h1>Projects</h1>
        <div className="projects-grid">
            {projectList.map((p: any, index: number) => {
              // Handle image fallback gracefully
              let imgSrc = p.image;
              if (!imgSrc || imgSrc === '/mock01.png') imgSrc = mock01;
              else if (imgSrc === '/mock02.png') imgSrc = mock02;
              else if (imgSrc === '/mock03.png') imgSrc = mock03;
              else if (typeof imgSrc !== 'string' || (!imgSrc.startsWith('http') && !imgSrc.startsWith('/'))) {
                imgSrc = defaultMocks[index % defaultMocks.length];
              }

              const linkUrl = p.liveUrl || p.githubUrl || 'https://github.com/abbas4web';

              return (
                <div className="project" key={p.id || p.title}>
                    <a href={linkUrl} target="_blank" rel="noreferrer">
                        <img src={imgSrc} className="zoom" alt={p.title} width="100%"/>
                        <h2>{p.title}</h2>
                    </a>
                    <p>{p.description}</p>
                </div>
              );
            })}
        </div>
    </div>
    );
}

export default Project;
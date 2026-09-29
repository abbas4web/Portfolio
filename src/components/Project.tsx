import React from "react";
import mock01 from '../assets/images/mock01.png';
import mock02 from '../assets/images/mock02.png';
import mock03 from '../assets/images/mock03.png';
import '../assets/styles/Project.scss';

function Project() {
    return(
    <div className="projects-container" id="projects">
        <h1>Projects</h1>
        <div className="projects-grid">
            <div className="project">
                <a href="https://github.com/abbas4web" target="_blank" rel="noreferrer">
                    <img src={mock01} className="zoom" alt="AI Office Portal - Agentic AI Platform" width="100%"/>
                    <h2>AI Office Portal — Agentic AI Platform</h2>
                </a>
                <p>Architected and developed a multi-agent AI office management platform featuring Orchestrator, Email, Task, Manager, and Info agents. Implemented an advanced agentic chat loop with tool execution feedback for multi-step reasoning, integrated Google Gemini via OpenAI SDK compatibility, and automated email parsing/notification workflows with a dynamic React.js UI.</p>
            </div>
            <div className="project">
                <a href="https://github.com/abbas4web" target="_blank" rel="noreferrer">
                    <img src={mock02} className="zoom" alt="GymHub - Gym Management Mobile App" width="100%"/>
                    <h2>GymHub — Gym Management Mobile App</h2>
                </a>
                <p>Developed a comprehensive Gym Management Mobile Application using React Native with custom Figma UI/UX. Features role-based access control (Admin, Client, Employee), automated member subscriptions, attendance tracking, personalized diet and workout schedules, and streamlined gym operations.</p>
            </div>
            <div className="project">
                <a href="https://github.com/abbas4web" target="_blank" rel="noreferrer">
                    <img src={mock03} className="zoom" alt="Salat Ride - Ride Sharing Mobile App" width="100%"/>
                    <h2>Salat Ride — Ride Sharing Mobile App</h2>
                </a>
                <p>Built a dedicated ride-sharing mobile application in React Native and Tailwind CSS for community mosque-goers. Integrated Google Maps API for precise location tracking, distance calculations, and dynamic routing, backed by Node.js, Express.js, and PostgreSQL for robust relational data handling.</p>
            </div>
        </div>
    </div>
    );
}

export default Project;
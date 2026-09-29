import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact, faPython } from '@fortawesome/free-brands-svg-icons';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';

const labelsFirst = [
    "Agentic AI",
    "Prompt Engineering",
    "LLM Integration",
    "Google Gemini",
    "OpenAI API",
    "AI Workflow Automation",
    "Multi-Agent Systems",
    "Autonomous Agents"
];

const labelsSecond = [
    "React.js",
    "React Native",
    "Next.js",
    "Angular",
    "JavaScript (ES6+)",
    "TypeScript",
    "Redux Toolkit",
    "Redux Saga",
    "Flutter",
    "HTML5 / CSS3 / SASS"
];

const labelsThird = [
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "MongoDB",
    "REST API",
    "Axios",
    "Git / GitHub",
    "Postman"
];

function Expertise() {
    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1>Expertise</h1>
            <div className="skills-grid">
                <div className="skill">
                    <FontAwesomeIcon icon={faBrain} size="3x"/>
                    <h3>Agentic AI & LLMs</h3>
                    <p>Specialized in architecting multi-agent AI systems, prompt engineering, and integrating LLMs (Google Gemini, OpenAI) to build autonomous workflows, task automation, and intelligent assistants.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsFirst.map((label, index) => (
                            <Chip key={label} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faReact} size="3x"/>
                    <h3>Frontend & Mobile Development</h3>
                    <p>Skilled in architecting reusable, modular UI component libraries and cross-platform apps using React.js, Next.js, and React Native. Experienced in predictable state management with Redux Toolkit and Redux Saga.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsSecond.map((label, index) => (
                            <Chip key={label} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faPython} size="3x"/>
                    <h3>Backend & API Architecture</h3>
                    <p>Experienced in building and optimizing backend services, RESTful APIs, and managing relational and NoSQL databases like PostgreSQL and MongoDB, with robust data flows between AI services and frontends.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsThird.map((label, index) => (
                            <Chip key={label} className='chip' label={label} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Expertise;
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

interface ExpertiseProps {
  services?: any[];
}

function Expertise({ services }: ExpertiseProps) {
    // If services passed from API, render them dynamically; otherwise fallback
    const items = services && services.length > 0 ? services : [
      {
        id: '1',
        title: 'Agentic AI & LLMs',
        iconKey: 'faBrain',
        description: 'Specialized in architecting multi-agent AI systems, prompt engineering, and integrating LLMs (Google Gemini, OpenAI) to build autonomous workflows, task automation, and intelligent assistants.',
        skills: labelsFirst.map(name => ({ name }))
      },
      {
        id: '2',
        title: 'Frontend & Mobile Development',
        iconKey: 'faReact',
        description: 'Skilled in architecting reusable, modular UI component libraries and cross-platform apps using React.js, Next.js, and React Native. Experienced in predictable state management with Redux Toolkit and Redux Saga.',
        skills: labelsSecond.map(name => ({ name }))
      },
      {
        id: '3',
        title: 'Backend & API Architecture',
        iconKey: 'faPython',
        description: 'Experienced in building and optimizing backend services, RESTful APIs, and managing relational and NoSQL databases like PostgreSQL and MongoDB, with robust data flows between AI services and frontends.',
        skills: labelsThird.map(name => ({ name }))
      }
    ];

    const getIcon = (key: string) => {
      if (key === 'faBrain') return faBrain;
      if (key === 'faReact') return faReact;
      return faPython;
    };

    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1>Expertise</h1>
            <div className="skills-grid">
                {items.map((item: any) => {
                  const skillList = item.skillCategory?.skills || item.skills || [];
                  return (
                    <div className="skill" key={item.id || item.title}>
                        <FontAwesomeIcon icon={getIcon(item.iconKey)} size="3x"/>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <div className="flex-chips">
                            <span className="chip-title">Tech stack:</span>
                            {skillList.map((skill: any, idx: number) => {
                                const labelText = typeof skill === 'string' ? skill : skill.name;
                                return <Chip key={skill.id || labelText || idx} className='chip' label={labelText} />;
                            })}
                        </div>
                    </div>
                  );
                })}
            </div>
        </div>
    </div>
    );
}

export default Expertise;
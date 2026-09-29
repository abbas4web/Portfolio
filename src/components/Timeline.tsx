import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'

interface TimelineProps {
  experience?: any[];
  education?: any[];
}

function Timeline({ experience, education }: TimelineProps) {
  const hasExperience = experience && experience.length > 0;
  const hasEducation = education && education.length > 0;

  return (
    <div id="history">
      <div className="items-container">
        <h1>Career & Education</h1>
        <VerticalTimeline>
          {hasExperience ? (
            experience.map((exp: any) => {
              const dateString = exp.current
                ? `${new Date(exp.startDate).getFullYear()} - Present`
                : exp.startDate
                ? `${new Date(exp.startDate).getFullYear()}${exp.endDate ? ` - ${new Date(exp.endDate).getFullYear()}` : ''}`
                : 'Apr 2023 - Present';

              return (
                <VerticalTimelineElement
                  key={exp.id || exp.role}
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
                  contentArrowStyle={{ borderRight: '7px solid  white' }}
                  date={dateString}
                  iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
                  icon={<FontAwesomeIcon icon={faBriefcase} />}
                >
                  <h3 className="vertical-timeline-element-title">{exp.role}</h3>
                  <h4 className="vertical-timeline-element-subtitle">
                    {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                  </h4>
                  <p>{exp.description}</p>
                </VerticalTimelineElement>
              );
            })
          ) : (
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
              contentArrowStyle={{ borderRight: '7px solid  white' }}
              date="Apr 2023 - Present"
              iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
              icon={<FontAwesomeIcon icon={faBriefcase} />}
            >
              <h3 className="vertical-timeline-element-title">Senior Software Engineer</h3>
              <h4 className="vertical-timeline-element-subtitle">Maiden Cube Pvt. Ltd. | Hyderabad, India</h4>
              <p>
                Designed and shipped AI-powered solutions using prompt engineering, agentic architecture, and modern LLM tooling. Built end-to-end full-stack web and mobile apps with React.js, React Native, Redux Toolkit, Redux Saga, and REST APIs.
              </p>
            </VerticalTimelineElement>
          )}

          {hasEducation ? (
            education.map((edu: any) => {
              const eduDate = edu.startDate
                ? `${new Date(edu.startDate).getFullYear()}${edu.endDate ? ` - ${new Date(edu.endDate).getFullYear()}` : ''}`
                : '2020 - 2023';

              return (
                <VerticalTimelineElement
                  key={edu.id || edu.degree}
                  className="vertical-timeline-element--education"
                  contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
                  contentArrowStyle={{ borderRight: '7px solid white' }}
                  date={eduDate}
                  iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
                  icon={<FontAwesomeIcon icon={faGraduationCap} />}
                >
                  <h3 className="vertical-timeline-element-title">{edu.degree}</h3>
                  <h4 className="vertical-timeline-element-subtitle">{edu.institution}</h4>
                  <p>{edu.description}</p>
                </VerticalTimelineElement>
              );
            })
          ) : (
            <VerticalTimelineElement
              className="vertical-timeline-element--education"
              contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
              contentArrowStyle={{ borderRight: '7px solid white' }}
              date="2020 - 2023"
              iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
              icon={<FontAwesomeIcon icon={faGraduationCap} />}
            >
              <h3 className="vertical-timeline-element-title">Bachelor of Computer Applications (B.C.A.)</h3>
              <h4 className="vertical-timeline-element-subtitle">Swami Ramanand Teerth Marathwada University (SRTMU)</h4>
              <p>
                Computer Applications (General) — foundational coursework in software development, data structures, algorithms, databases, and application architecture.
              </p>
            </VerticalTimelineElement>
          )}
        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Timeline;
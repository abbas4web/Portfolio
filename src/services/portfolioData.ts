const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function fetchPublic<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[PortfolioAPI] ${endpoint} returned status ${res.status}, using fallback.`);
      return fallback;
    }
    const json = await res.json();
    return json?.success && json?.data !== undefined ? json.data : json || fallback;
  } catch (err) {
    console.warn(`[PortfolioAPI] Failed to fetch ${endpoint}, using fallback.`, err);
    return fallback;
  }
}

// Fallback data preserving existing content if the API is offline
export const FALLBACK_PROFILE = {
  fullName: 'Shaikh Abbas',
  title: 'Senior Software Engineer',
  avatarUrl: 'https://my-aws-assets.s3.us-west-2.amazonaws.com/portfolio-img/avatar_circle.jpeg',
  avatarAlt: 'Shaikh Abbas - Senior Software Engineer',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/abbas4web', iconKey: 'GitHubIcon' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/mrshaikhabbas', iconKey: 'LinkedInIcon' },
  ],
};

export const FALLBACK_NAV = [
  ['Expertise', 'expertise'],
  ['History', 'history'],
  ['Projects', 'projects'],
  ['Contact', 'contact'],
];

export const FALLBACK_SERVICES = [
  {
    id: '1',
    title: 'Agentic AI & LLMs',
    iconKey: 'faBrain',
    description:
      'Specialized in architecting multi-agent AI systems, prompt engineering, and integrating LLMs (Google Gemini, OpenAI) to build autonomous workflows, task automation, and intelligent assistants.',
    skills: [
      { name: 'Agentic AI' },
      { name: 'Prompt Engineering' },
      { name: 'LLM Integration' },
      { name: 'Google Gemini' },
      { name: 'OpenAI API' },
      { name: 'AI Workflow Automation' },
      { name: 'Multi-Agent Systems' },
      { name: 'Autonomous Agents' },
    ],
  },
  {
    id: '2',
    title: 'Frontend & Mobile Development',
    iconKey: 'faReact',
    description:
      'Skilled in architecting reusable, modular UI component libraries and cross-platform apps using React.js, Next.js, and React Native. Experienced in predictable state management with Redux Toolkit and Redux Saga.',
    skills: [
      { name: 'React.js' },
      { name: 'React Native' },
      { name: 'Next.js' },
      { name: 'Angular' },
      { name: 'JavaScript (ES6+)' },
      { name: 'TypeScript' },
      { name: 'Redux Toolkit' },
      { name: 'Redux Saga' },
      { name: 'Flutter' },
      { name: 'HTML5 / CSS3 / SASS' },
    ],
  },
  {
    id: '3',
    title: 'Backend & API Architecture',
    iconKey: 'faPython',
    description:
      'Experienced in building and optimizing backend services, RESTful APIs, and managing relational and NoSQL databases like PostgreSQL and MongoDB, with robust data flows between AI services and frontends.',
    skills: [
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
      { name: 'REST API' },
      { name: 'Axios' },
      { name: 'Git / GitHub' },
      { name: 'Postman' },
    ],
  },
];

export const FALLBACK_PROJECTS = [
  {
    id: '1',
    title: 'AI Office Portal — Agentic AI Platform',
    description:
      'Architected and developed a multi-agent AI office management platform featuring Orchestrator, Email, Task, Manager, and Info agents. Implemented an advanced agentic chat loop with tool execution feedback for multi-step reasoning, integrated Google Gemini via OpenAI SDK compatibility, and automated email parsing/notification workflows with a dynamic React.js UI.',
    image: '/mock01.png',
    githubUrl: 'https://github.com/abbas4web',
    liveUrl: '',
    technologies: ['Agentic AI', 'Google Gemini', 'React.js', 'Node.js', 'PostgreSQL'],
  },
  {
    id: '2',
    title: 'GymHub — Gym Management Mobile App',
    description:
      'Developed a comprehensive Gym Management Mobile Application using React Native with custom Figma UI/UX. Features role-based access control (Admin, Client, Employee), automated member subscriptions, attendance tracking, personalized diet and workout schedules, and streamlined gym operations.',
    image: '/mock02.png',
    githubUrl: 'https://github.com/abbas4web',
    liveUrl: '',
    technologies: ['React Native', 'Figma', 'Node.js', 'Express.js', 'MongoDB'],
  },
  {
    id: '3',
    title: 'Salat Ride — Ride Sharing Mobile App',
    description:
      'Built a dedicated ride-sharing mobile application in React Native and Tailwind CSS for community mosque-goers. Integrated Google Maps API for precise location tracking, distance calculations, and dynamic routing, backed by Node.js, Express.js, and PostgreSQL for robust relational data handling.',
    image: '/mock03.png',
    githubUrl: 'https://github.com/abbas4web',
    liveUrl: '',
    technologies: ['React Native', 'Tailwind CSS', 'Google Maps API', 'Node.js', 'PostgreSQL'],
  },
];

export const FALLBACK_EXPERIENCE = [
  {
    id: '1',
    role: 'Senior Software Engineer',
    company: 'Maiden Cube Pvt. Ltd.',
    location: 'Hyderabad, India',
    startDate: 'Apr 2023 - Present',
    current: true,
    description:
      'Designed and shipped AI-powered solutions using prompt engineering, agentic architecture, and modern LLM tooling. Built end-to-end full-stack web and mobile apps with React.js, React Native, Redux Toolkit, Redux Saga, and REST APIs.',
  },
];

export const FALLBACK_EDUCATION = [
  {
    id: '1',
    degree: 'Bachelor of Computer Applications (B.C.A.)',
    institution: 'Swami Ramanand Teerth Marathwada University (SRTMU)',
    startDate: '2020 - 2023',
    description:
      'Computer Applications (General) — foundational coursework in software development, data structures, algorithms, databases, and application architecture.',
  },
];

// Clean public API methods
export const PortfolioDataService = {
  getProfile: () => fetchPublic('/profile', FALLBACK_PROFILE),
  getNavigation: () => fetchPublic('/navigation', FALLBACK_NAV),
  getServices: () => fetchPublic('/services', FALLBACK_SERVICES),
  getSkills: () => fetchPublic('/skills', []),
  getExperience: () => fetchPublic('/experience', FALLBACK_EXPERIENCE),
  getEducation: () => fetchPublic('/education', FALLBACK_EDUCATION),
  getProjects: () => fetchPublic('/projects', FALLBACK_PROJECTS),
  getAILab: () => fetchPublic('/ai-lab', []),
  getSocialLinks: () => fetchPublic('/social-links', FALLBACK_PROFILE.socialLinks),
  getResume: () => fetchPublic('/resume', null),
  submitContact: async (data: { name: string; contact: string; message: string; subject?: string }) => {
    const url = `${API_BASE}/contact`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

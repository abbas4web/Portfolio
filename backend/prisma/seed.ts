import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding portfolio database with Shaikh Abbas details...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('Admin@12345', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'abbas4developer@gmail.com' },
    update: {},
    create: {
      email: 'abbas4developer@gmail.com',
      passwordHash,
      fullName: 'Shaikh Abbas',
      role: 'SUPER_ADMIN',
    },
  });

  // 2. Site Profile
  await prisma.siteProfile.deleteMany();
  const profile = await prisma.siteProfile.create({
    data: {
      fullName: 'Shaikh Abbas',
      title: 'Senior Software Engineer',
      headline: 'AI Engineer & Full Stack Developer with 3 years experience',
      email: 'abbas4developer@gmail.com',
      phone: '+91-9284987979',
      location: 'Hyderabad, INDIA',
      avatarUrl: 'https://my-aws-assets.s3.us-west-2.amazonaws.com/portfolio-img/avatar_circle.jpeg',
      avatarAlt: 'Shaikh Abbas - Senior Software Engineer',
      metaTitle: 'Shaikh Abbas | Senior Software Engineer',
      metaDescription:
        'AI Engineer and Full Stack Developer with 3 years of experience in designing and deploying AI-powered applications and LLM-driven workflows.',
      isPublished: true,
      socialLinks: {
        create: [
          { platform: 'GitHub', url: 'https://github.com/abbas4web', iconKey: 'GitHubIcon', displayOrder: 1 },
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/mrshaikhabbas', iconKey: 'LinkedInIcon', displayOrder: 2 },
        ],
      },
    },
  });

  // 3. Navigation
  await prisma.navigationItem.deleteMany();
  await prisma.navigationItem.createMany({
    data: [
      { label: 'Expertise', href: 'expertise', displayOrder: 1, visible: true },
      { label: 'History', href: 'history', displayOrder: 2, visible: true },
      { label: 'Projects', href: 'projects', displayOrder: 3, visible: true },
      { label: 'Contact', href: 'contact', displayOrder: 4, visible: true },
    ],
  });

  // 4. Services & Skills
  await prisma.service.deleteMany();
  await prisma.skillCategory.deleteMany();

  const service1 = await prisma.service.create({
    data: {
      title: 'Agentic AI & LLMs',
      slug: 'agentic-ai-llms',
      iconKey: 'faBrain',
      description:
        'Specialized in architecting multi-agent AI systems, prompt engineering, and integrating LLMs (Google Gemini, OpenAI) to build autonomous workflows, task automation, and intelligent assistants.',
      displayOrder: 1,
      published: true,
    },
  });

  const cat1 = await prisma.skillCategory.create({
    data: {
      name: 'Agentic AI & LLMs',
      slug: 'agentic-ai',
      serviceId: service1.id,
      displayOrder: 1,
      skills: {
        create: [
          { name: 'Agentic AI', displayOrder: 1 },
          { name: 'Prompt Engineering', displayOrder: 2 },
          { name: 'LLM Integration', displayOrder: 3 },
          { name: 'Google Gemini', displayOrder: 4 },
          { name: 'OpenAI API', displayOrder: 5 },
          { name: 'AI Workflow Automation', displayOrder: 6 },
          { name: 'Multi-Agent Systems', displayOrder: 7 },
          { name: 'Autonomous Agents', displayOrder: 8 },
        ],
      },
    },
  });

  const service2 = await prisma.service.create({
    data: {
      title: 'Frontend & Mobile Development',
      slug: 'frontend-mobile',
      iconKey: 'faReact',
      description:
        'Skilled in architecting reusable, modular UI component libraries and cross-platform apps using React.js, Next.js, and React Native. Experienced in predictable state management with Redux Toolkit and Redux Saga.',
      displayOrder: 2,
      published: true,
    },
  });

  await prisma.skillCategory.create({
    data: {
      name: 'Frontend & Mobile',
      slug: 'frontend-mobile-skills',
      serviceId: service2.id,
      displayOrder: 2,
      skills: {
        create: [
          { name: 'React.js', displayOrder: 1 },
          { name: 'React Native', displayOrder: 2 },
          { name: 'Next.js', displayOrder: 3 },
          { name: 'Angular', displayOrder: 4 },
          { name: 'JavaScript (ES6+)', displayOrder: 5 },
          { name: 'TypeScript', displayOrder: 6 },
          { name: 'Redux Toolkit', displayOrder: 7 },
          { name: 'Redux Saga', displayOrder: 8 },
          { name: 'Flutter', displayOrder: 9 },
          { name: 'HTML5 / CSS3 / SASS', displayOrder: 10 },
        ],
      },
    },
  });

  const service3 = await prisma.service.create({
    data: {
      title: 'Backend & API Architecture',
      slug: 'backend-api',
      iconKey: 'faPython',
      description:
        'Experienced in building and optimizing backend services, RESTful APIs, and managing relational and NoSQL databases like PostgreSQL and MongoDB, with robust data flows between AI services and frontends.',
      displayOrder: 3,
      published: true,
    },
  });

  await prisma.skillCategory.create({
    data: {
      name: 'Backend & APIs',
      slug: 'backend-skills',
      serviceId: service3.id,
      displayOrder: 3,
      skills: {
        create: [
          { name: 'Node.js', displayOrder: 1 },
          { name: 'Express.js', displayOrder: 2 },
          { name: 'PostgreSQL', displayOrder: 3 },
          { name: 'MongoDB', displayOrder: 4 },
          { name: 'REST API', displayOrder: 5 },
          { name: 'Axios', displayOrder: 6 },
          { name: 'Git / GitHub', displayOrder: 7 },
          { name: 'Postman', displayOrder: 8 },
        ],
      },
    },
  });

  // 5. Experience
  await prisma.experience.deleteMany();
  await prisma.experience.create({
    data: {
      company: 'Maiden Cube Pvt. Ltd.',
      role: 'Senior Software Engineer',
      location: 'Hyderabad, India',
      startDate: new Date('2023-04-01'),
      current: true,
      description:
        'Designed and shipped AI-powered solutions using prompt engineering, agentic architecture, and modern LLM tooling. Built end-to-end full-stack web and mobile apps with React.js, React Native, Redux Toolkit, Redux Saga, and REST APIs.',
      technologies: ['Agentic AI', 'React.js', 'React Native', 'Node.js', 'Redux Toolkit', 'Axios'],
      displayOrder: 1,
      published: true,
    },
  });

  // 6. Education
  await prisma.education.deleteMany();
  await prisma.education.create({
    data: {
      institution: 'Swami Ramanand Teerth Marathwada University (SRTMU)',
      degree: 'Bachelor of Computer Applications (B.C.A.)',
      fieldOfStudy: 'Computer Applications (General)',
      startDate: new Date('2020-06-01'),
      endDate: new Date('2023-05-30'),
      description:
        'Foundational coursework in software development, data structures, algorithms, databases, and application architecture.',
      displayOrder: 1,
      published: true,
    },
  });

  // 7. Projects
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: 'AI Office Portal — Agentic AI Platform',
        slug: 'ai-office-portal',
        shortDescription: 'Multi-agent office management platform with autonomous task reasoning',
        description:
          'Architected and developed a multi-agent AI office management platform featuring Orchestrator, Email, Task, Manager, and Info agents. Implemented an advanced agentic chat loop with tool execution feedback for multi-step reasoning, integrated Google Gemini via OpenAI SDK compatibility, and automated email parsing/notification workflows with a dynamic React.js UI.',
        image: '/mock01.png',
        githubUrl: 'https://github.com/abbas4web',
        technologies: ['Agentic AI', 'Google Gemini', 'React.js', 'Node.js', 'PostgreSQL'],
        featured: true,
        displayOrder: 1,
        published: true,
      },
      {
        title: 'GymHub — Gym Management Mobile App',
        slug: 'gymhub-mobile-app',
        shortDescription: 'Role-based Gym Management Mobile Application with customized Figma UI/UX',
        description:
          'Developed a comprehensive Gym Management Mobile Application using React Native with custom Figma UI/UX. Features role-based access control (Admin, Client, Employee), automated member subscriptions, attendance tracking, personalized diet and workout schedules, and streamlined gym operations.',
        image: '/mock02.png',
        githubUrl: 'https://github.com/abbas4web',
        technologies: ['React Native', 'Figma', 'Node.js', 'Express.js', 'MongoDB'],
        featured: true,
        displayOrder: 2,
        published: true,
      },
      {
        title: 'Salat Ride — Ride Sharing Mobile App',
        slug: 'salat-ride',
        shortDescription: 'Community ride-sharing app with Google Maps route tracking',
        description:
          'Built a dedicated ride-sharing mobile application in React Native and Tailwind CSS for community mosque-goers. Integrated Google Maps API for precise location tracking, distance calculations, and dynamic routing, backed by Node.js, Express.js, and PostgreSQL for robust relational data handling.',
        image: '/mock03.png',
        githubUrl: 'https://github.com/abbas4web',
        technologies: ['React Native', 'Tailwind CSS', 'Google Maps API', 'Node.js', 'PostgreSQL'],
        featured: true,
        displayOrder: 3,
        published: true,
      },
    ],
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth';
import {
  LoginSchema,
  ProjectSchema,
  ExperienceSchema,
  EducationSchema,
  NavigationItemSchema,
  SkillCategorySchema,
  SkillSchema,
} from '../validators';

const router = Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback-secret-access';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-secret-refresh';

// Auth Login
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.refreshToken.create({
      data: {
        tokenHash: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Login failed' });
  }
});

// Protect all following routes with JWT
router.use(authenticateJwt);

// Check Me
router.get('/auth/me', async (req: AuthenticatedRequest, res: Response) => {
  const user = await prisma.adminUser.findUnique({
    where: { id: req.user?.userId },
    select: { id: true, email: true, fullName: true, role: true, lastLoginAt: true },
  });
  res.json(user);
});

// PROJECTS CRUD
router.get('/projects', async (_req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { displayOrder: 'asc' } });
  res.json(projects);
});

router.post('/projects', async (req, res) => {
  try {
    const data = ProjectSchema.parse(req.body);
    const project = await prisma.project.create({ data });
    res.status(201).json(project);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const data = ProjectSchema.parse(req.body);
    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// EXPERIENCES CRUD
router.get('/experiences', async (_req, res) => {
  const experiences = await prisma.experience.findMany({ orderBy: { displayOrder: 'asc' } });
  res.json(experiences);
});

router.post('/experiences', async (req, res) => {
  try {
    const data = ExperienceSchema.parse(req.body);
    const exp = await prisma.experience.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    res.status(201).json(exp);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

router.delete('/experiences/:id', async (req, res) => {
  await prisma.experience.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// EDUCATIONS CRUD
router.get('/educations', async (_req, res) => {
  const educations = await prisma.education.findMany({ orderBy: { displayOrder: 'asc' } });
  res.json(educations);
});

router.post('/educations', async (req, res) => {
  try {
    const data = EducationSchema.parse(req.body);
    const edu = await prisma.education.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    res.status(201).json(edu);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

router.delete('/educations/:id', async (req, res) => {
  await prisma.education.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// CONTACT MESSAGES INBOX
router.get('/messages', async (req, res) => {
  const status = req.query.status as any;
  const whereClause: any = {};
  if (status) whereClause.status = status;

  const messages = await prisma.contactMessage.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
  res.json(messages);
});

router.patch('/messages/:id/status', async (req, res) => {
  const { status } = req.body;
  const updated = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(updated);
});

router.delete('/messages/:id', async (req, res) => {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;

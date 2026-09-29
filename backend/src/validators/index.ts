import { z } from 'zod';

export const ContactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  contact: z.string().min(3, 'Email or phone is required').max(150),
  subject: z.string().max(200).optional(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const ProjectSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z.string().min(2).max(150),
  shortDescription: z.string().optional(),
  description: z.string().min(10),
  image: z.string().min(1),
  imageAlt: z.string().optional(),
  technologies: z.array(z.string()).min(1),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const ExperienceSchema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  location: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().min(5),
  technologies: z.array(z.string()).default([]),
  companyUrl: z.string().url().optional().or(z.literal('')),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const EducationSchema = z.object({
  institution: z.string().min(2),
  degree: z.string().min(2),
  fieldOfStudy: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  grade: z.string().optional(),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const SkillCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const SkillSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  level: z.number().int().min(1).max(100).optional(),
  iconKey: z.string().optional(),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const NavigationItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  target: z.string().default('_self'),
  visible: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

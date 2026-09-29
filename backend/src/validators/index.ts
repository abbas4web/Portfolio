import { z } from 'zod';

// ==========================================
// 1. AUTH
// ==========================================
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ==========================================
// 2. PROFILE & ABOUT
// ==========================================
export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  title: z.string().min(2).max(100),
  headline: z.string().optional().nullable(),
  shortBio: z.string().optional().nullable(),
  fullBio: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable().or(z.literal('')),
  avatarAlt: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});

export const AboutHighlightSchema = z.object({
  profileId: z.string().uuid(),
  title: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  iconKey: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

// ==========================================
// 3. NAVIGATION
// ==========================================
export const NavigationItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  target: z.string().default('_self'),
  visible: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// ==========================================
// 4. SKILLS & CATEGORIES
// ==========================================
export const SkillCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  serviceId: z.string().uuid().optional().nullable(),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const SkillSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  level: z.number().int().min(1).max(100).optional().nullable(),
  iconKey: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

// ==========================================
// 5. SERVICES
// ==========================================
export const ServiceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  iconKey: z.string().min(1),
  description: z.string().min(5),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

// ==========================================
// 6. EXPERIENCE
// ==========================================
export const ExperienceSchema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  location: z.string().optional().nullable(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().min(5),
  technologies: z.array(z.string()).default([]),
  companyUrl: z.string().optional().nullable().or(z.literal('')),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

// ==========================================
// 7. EDUCATION
// ==========================================
export const EducationSchema = z.object({
  institution: z.string().min(2),
  degree: z.string().min(2),
  fieldOfStudy: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

// ==========================================
// 8. PROJECTS
// ==========================================
export const ProjectSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z.string().min(2).max(150),
  shortDescription: z.string().optional().nullable(),
  description: z.string().min(10),
  image: z.string().min(1),
  imageAlt: z.string().optional().nullable(),
  technologies: z.array(z.string()).min(1),
  githubUrl: z.string().optional().nullable().or(z.literal('')),
  liveUrl: z.string().optional().nullable().or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// ==========================================
// 9. AI LAB
// ==========================================
export const AILabSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  summary: z.string().min(5),
  architecture: z.string().optional().nullable(),
  modelUsed: z.string().min(1),
  demoUrl: z.string().url().optional().nullable().or(z.literal('')),
  codeUrl: z.string().url().optional().nullable().or(z.literal('')),
  status: z.enum(['IN_DEVELOPMENT', 'LIVE', 'ARCHIVED']).default('LIVE'),
  published: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// ==========================================
// 10. SOCIAL LINKS
// ==========================================
export const SocialLinkSchema = z.object({
  profileId: z.string().uuid().optional().nullable(),
  platform: z.string().min(2),
  url: z.string().url(),
  iconKey: z.string().min(1),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

// ==========================================
// 11. RESUME
// ==========================================
export const ResumeSchema = z.object({
  profileId: z.string().uuid().optional().nullable(),
  title: z.string().min(2),
  fileUrl: z.string().url().or(z.string().min(1)),
  version: z.string().optional().nullable(),
  isCurrent: z.boolean().default(true),
  published: z.boolean().default(true),
});

// ==========================================
// 12. CONTACT
// ==========================================
export const ContactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  contact: z.string().min(3, 'Email or phone is required').max(150),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000),
});

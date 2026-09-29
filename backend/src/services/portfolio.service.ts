import prisma from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export class PortfolioService {
  // ===================== AUTH =====================
  static async login(email: string, pass: string) {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      config.jwtRefreshSecret,
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

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  // ===================== PROFILE & ABOUT =====================
  static async getPublicProfile() {
    return prisma.siteProfile.findFirst({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
      include: {
        socialLinks: { where: { published: true }, orderBy: { displayOrder: 'asc' } },
        aboutHighlights: { where: { published: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  static async getAdminProfile() {
    return prisma.siteProfile.findFirst({
      orderBy: { updatedAt: 'desc' },
      include: {
        socialLinks: { orderBy: { displayOrder: 'asc' } },
        aboutHighlights: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  static async updateProfile(data: any) {
    const profiles = await prisma.siteProfile.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    if (profiles.length > 0) {
      // 1. Update ALL rows in site_profiles so every row in PostgreSQL is synced
      await prisma.siteProfile.updateMany({
        data,
      });

      // 2. If there are duplicate rows, clean them up safely
      if (profiles.length > 1) {
        try {
          const [primary, ...duplicates] = profiles;
          await prisma.siteProfile.deleteMany({
            where: { id: { in: duplicates.map((d) => d.id) } },
          });
        } catch (e) {
          console.warn('[updateProfile] Duplicate cleanup skipped:', e);
        }
      }

      return prisma.siteProfile.findFirst({
        orderBy: { updatedAt: 'desc' },
      });
    }

    return prisma.siteProfile.create({ data });
  }

  static async getPublicAbout() {
    const profile = await prisma.siteProfile.findFirst({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
      select: {
        fullName: true,
        title: true,
        headline: true,
        shortBio: true,
        fullBio: true,
        location: true,
        avatarUrl: true,
        avatarAlt: true,
        aboutHighlights: { where: { published: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
    return profile;
  }

  // ===================== NAVIGATION =====================
  static async getPublicNavigation() {
    return prisma.navigationItem.findMany({
      where: { visible: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async getAllNavigation() {
    return prisma.navigationItem.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  static async createNavigation(data: any) {
    return prisma.navigationItem.create({ data });
  }

  static async updateNavigation(id: string, data: any) {
    return prisma.navigationItem.update({ where: { id }, data });
  }

  static async deleteNavigation(id: string) {
    return prisma.navigationItem.delete({ where: { id } });
  }

  // ===================== SKILLS & CATEGORIES =====================
  static async getPublicSkills() {
    return prisma.skillCategory.findMany({
      where: { published: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        skills: {
          where: { published: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  static async getAllSkillCategories() {
    return prisma.skillCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        skills: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  static async createSkillCategory(data: any) {
    return prisma.skillCategory.create({ data });
  }

  static async updateSkillCategory(id: string, data: any) {
    return prisma.skillCategory.update({ where: { id }, data });
  }

  static async deleteSkillCategory(id: string) {
    return prisma.skillCategory.delete({ where: { id } });
  }

  static async createSkill(data: any) {
    return prisma.skill.create({ data });
  }

  static async updateSkill(id: string, data: any) {
    return prisma.skill.update({ where: { id }, data });
  }

  static async deleteSkill(id: string) {
    return prisma.skill.delete({ where: { id } });
  }

  // ===================== SERVICES =====================
  static async getPublicServices() {
    return prisma.service.findMany({
      where: { published: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        skillCategory: {
          include: {
            skills: { where: { published: true }, orderBy: { displayOrder: 'asc' } },
          },
        },
      },
    });
  }

  static async getAllServices() {
    return prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        skillCategory: {
          include: { skills: { orderBy: { displayOrder: 'asc' } } },
        },
      },
    });
  }

  static async createService(data: any) {
    return prisma.service.create({ data });
  }

  static async updateService(id: string, data: any) {
    return prisma.service.update({ where: { id }, data });
  }

  static async deleteService(id: string) {
    return prisma.service.delete({ where: { id } });
  }

  // ===================== EXPERIENCE =====================
  static async getPublicExperience() {
    return prisma.experience.findMany({
      where: { published: true },
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }],
    });
  }

  static async getAllExperience() {
    return prisma.experience.findMany({
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }],
    });
  }

  static async createExperience(data: any) {
    return prisma.experience.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  static async updateExperience(id: string, data: any) {
    return prisma.experience.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  static async deleteExperience(id: string) {
    return prisma.experience.delete({ where: { id } });
  }

  // ===================== EDUCATION =====================
  static async getPublicEducation() {
    return prisma.education.findMany({
      where: { published: true },
      orderBy: { startDate: 'desc' },
    });
  }

  static async getAllEducation() {
    return prisma.education.findMany({ orderBy: { startDate: 'desc' } });
  }

  static async createEducation(data: any) {
    return prisma.education.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  static async updateEducation(id: string, data: any) {
    return prisma.education.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  static async deleteEducation(id: string) {
    return prisma.education.delete({ where: { id } });
  }

  // ===================== PROJECTS =====================
  static async getPublicProjects(featured?: boolean) {
    const where: any = { published: true };
    if (featured !== undefined) where.featured = featured;
    return prisma.project.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async getAllProjects() {
    return prisma.project.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  static async createProject(data: any) {
    return prisma.project.create({ data });
  }

  static async updateProject(id: string, data: any) {
    return prisma.project.update({ where: { id }, data });
  }

  static async deleteProject(id: string) {
    return prisma.project.delete({ where: { id } });
  }

  // ===================== AI LAB =====================
  static async getPublicAILab() {
    return prisma.aiLabExperiment.findMany({
      where: { published: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async getAllAILab() {
    return prisma.aiLabExperiment.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  static async createAILab(data: any) {
    return prisma.aiLabExperiment.create({ data });
  }

  static async updateAILab(id: string, data: any) {
    return prisma.aiLabExperiment.update({ where: { id }, data });
  }

  static async deleteAILab(id: string) {
    return prisma.aiLabExperiment.delete({ where: { id } });
  }

  // ===================== SOCIAL LINKS =====================
  static async getPublicSocialLinks() {
    return prisma.socialLink.findMany({
      where: { published: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async getAllSocialLinks() {
    return prisma.socialLink.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  static async createSocialLink(data: any) {
    return prisma.socialLink.create({ data });
  }

  static async updateSocialLink(id: string, data: any) {
    return prisma.socialLink.update({ where: { id }, data });
  }

  static async deleteSocialLink(id: string) {
    return prisma.socialLink.delete({ where: { id } });
  }

  // ===================== RESUME =====================
  static async getPublicResume() {
    return prisma.resume.findFirst({
      where: { published: true, isCurrent: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAllResumes() {
    return prisma.resume.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async createResume(data: any) {
    return prisma.resume.create({ data });
  }

  static async deleteResume(id: string) {
    return prisma.resume.delete({ where: { id } });
  }

  // ===================== CONTACT =====================
  static async submitContact(data: any) {
    return prisma.contactMessage.create({ data });
  }

  static async getAllMessages(status?: string, page = 1, limit = 20) {
    const where: any = {};
    if (status) where.status = status;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async updateMessageStatus(id: string, status: any) {
    return prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
  }

  static async deleteMessage(id: string) {
    return prisma.contactMessage.delete({ where: { id } });
  }

  // ===================== MEDIA =====================
  static async getAllMedia() {
    return prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async recordMediaUpload(data: any) {
    return prisma.media.create({ data });
  }

  static async deleteMedia(id: string) {
    return prisma.media.delete({ where: { id } });
  }
}

import prisma from '../db';

export class PortfolioService {
  static async getBootstrapData() {
    const [
      profile,
      navigation,
      services,
      skillCategories,
      experiences,
      educations,
      projects,
      socialLinks,
    ] = await Promise.all([
      prisma.siteProfile.findFirst({
        where: { isPublished: true },
        include: {
          socialLinks: { where: { published: true }, orderBy: { displayOrder: 'asc' } },
        },
      }),
      prisma.navigationItem.findMany({
        where: { visible: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.service.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          skillCategory: {
            include: {
              skills: {
                where: { published: true },
                orderBy: { displayOrder: 'asc' },
              },
            },
          },
        },
      }),
      prisma.skillCategory.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          skills: {
            where: { published: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      }),
      prisma.experience.findMany({
        where: { published: true },
        orderBy: [{ current: 'desc' }, { startDate: 'desc' }],
      }),
      prisma.education.findMany({
        where: { published: true },
        orderBy: { startDate: 'desc' },
      }),
      prisma.project.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.socialLink.findMany({
        where: { published: true },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);

    return {
      profile,
      navigation,
      services,
      skillCategories,
      experiences,
      educations,
      projects,
      socialLinks,
    };
  }

  static async submitContactMessage(data: {
    name: string;
    contact: string;
    subject?: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.contactMessage.create({
      data: {
        name: data.name,
        contact: data.contact,
        subject: data.subject,
        message: data.message,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  static async getProjects(featuredOnly = false) {
    const where: any = { published: true };
    if (featuredOnly) where.featured = true;
    return prisma.project.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async getExperience() {
    return prisma.experience.findMany({
      where: { published: true },
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }],
    });
  }

  static async getEducation() {
    return prisma.education.findMany({
      where: { published: true },
      orderBy: { startDate: 'desc' },
    });
  }
}

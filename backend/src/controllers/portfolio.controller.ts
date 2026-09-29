import { Request, Response } from 'express';
import { PortfolioService } from '../services/portfolio.service';
import {
  LoginSchema,
  UpdateProfileSchema,
  NavigationItemSchema,
  SkillCategorySchema,
  SkillSchema,
  ServiceSchema,
  ExperienceSchema,
  EducationSchema,
  ProjectSchema,
  AILabSchema,
  SocialLinkSchema,
  ResumeSchema,
  ContactMessageSchema,
} from '../validators';
import { AuthenticatedRequest } from '../middleware/auth';

export class PortfolioController {
  // Helper for consistent error response
  private static handleError(res: Response, error: any, defaultMsg = 'An error occurred') {
    if (error.errors) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    console.error(defaultMsg, error);
    return res.status(500).json({ success: false, error: error.message || defaultMsg });
  }

  // ===================== AUTH =====================
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const result = await PortfolioService.login(email, password);
      res.json({ success: true, data: result });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Login failed');
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    res.json({ success: true, user: req.user });
  }

  // ===================== PROFILE & ABOUT =====================
  static async getProfile(_req: Request, res: Response) {
    try {
      const profile = await PortfolioService.getPublicProfile();
      res.json({ success: true, data: profile });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch profile');
    }
  }

  static async getAbout(_req: Request, res: Response) {
    try {
      const about = await PortfolioService.getPublicAbout();
      res.json({ success: true, data: about });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch about data');
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const validated = UpdateProfileSchema.parse(req.body);
      const updated = await PortfolioService.updateProfile(validated);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to update profile');
    }
  }

  // ===================== NAVIGATION =====================
  static async getNavigation(_req: Request, res: Response) {
    try {
      const items = await PortfolioService.getPublicNavigation();
      res.json({ success: true, data: items });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch navigation');
    }
  }

  static async getAllNavigation(_req: Request, res: Response) {
    try {
      const items = await PortfolioService.getAllNavigation();
      res.json({ success: true, data: items });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch navigation list');
    }
  }

  static async createNavigation(req: Request, res: Response) {
    try {
      const data = NavigationItemSchema.parse(req.body);
      const created = await PortfolioService.createNavigation(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create navigation item');
    }
  }

  static async updateNavigation(req: Request, res: Response) {
    try {
      const data = NavigationItemSchema.parse(req.body);
      const updated = await PortfolioService.updateNavigation(req.params.id, data);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to update navigation item');
    }
  }

  static async deleteNavigation(req: Request, res: Response) {
    try {
      await PortfolioService.deleteNavigation(req.params.id);
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete navigation item');
    }
  }

  // ===================== SKILLS & CATEGORIES =====================
  static async getSkills(_req: Request, res: Response) {
    try {
      const skills = await PortfolioService.getPublicSkills();
      res.json({ success: true, data: skills });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch skills');
    }
  }

  static async getAllSkillCategories(_req: Request, res: Response) {
    try {
      const categories = await PortfolioService.getAllSkillCategories();
      res.json({ success: true, data: categories });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch skill categories');
    }
  }

  static async createSkillCategory(req: Request, res: Response) {
    try {
      const data = SkillCategorySchema.parse(req.body);
      const created = await PortfolioService.createSkillCategory(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create category');
    }
  }

  static async createSkill(req: Request, res: Response) {
    try {
      const data = SkillSchema.parse(req.body);
      const created = await PortfolioService.createSkill(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create skill');
    }
  }

  static async deleteSkill(req: Request, res: Response) {
    try {
      await PortfolioService.deleteSkill(req.params.id);
      res.json({ success: true, message: 'Skill deleted' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete skill');
    }
  }

  // ===================== SERVICES =====================
  static async getServices(_req: Request, res: Response) {
    try {
      const services = await PortfolioService.getPublicServices();
      res.json({ success: true, data: services });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch services');
    }
  }

  static async createService(req: Request, res: Response) {
    try {
      const data = ServiceSchema.parse(req.body);
      const created = await PortfolioService.createService(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create service');
    }
  }

  static async updateService(req: Request, res: Response) {
    try {
      const data = ServiceSchema.parse(req.body);
      const updated = await PortfolioService.updateService(req.params.id, data);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to update service');
    }
  }

  static async deleteService(req: Request, res: Response) {
    try {
      await PortfolioService.deleteService(req.params.id);
      res.json({ success: true, message: 'Service deleted' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete service');
    }
  }

  // ===================== EXPERIENCE =====================
  static async getExperience(_req: Request, res: Response) {
    try {
      const list = await PortfolioService.getPublicExperience();
      res.json({ success: true, data: list });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch experience');
    }
  }

  static async createExperience(req: Request, res: Response) {
    try {
      const data = ExperienceSchema.parse(req.body);
      const created = await PortfolioService.createExperience(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create experience');
    }
  }

  static async updateExperience(req: Request, res: Response) {
    try {
      const data = ExperienceSchema.parse(req.body);
      const updated = await PortfolioService.updateExperience(req.params.id, data);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to update experience');
    }
  }

  static async deleteExperience(req: Request, res: Response) {
    try {
      await PortfolioService.deleteExperience(req.params.id);
      res.json({ success: true, message: 'Experience deleted' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete experience');
    }
  }

  // ===================== EDUCATION =====================
  static async getEducation(_req: Request, res: Response) {
    try {
      const list = await PortfolioService.getPublicEducation();
      res.json({ success: true, data: list });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch education');
    }
  }

  static async createEducation(req: Request, res: Response) {
    try {
      const data = EducationSchema.parse(req.body);
      const created = await PortfolioService.createEducation(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create education');
    }
  }

  static async updateEducation(req: Request, res: Response) {
    try {
      const data = EducationSchema.parse(req.body);
      const updated = await PortfolioService.updateEducation(req.params.id, data);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to update education');
    }
  }

  static async deleteEducation(req: Request, res: Response) {
    try {
      await PortfolioService.deleteEducation(req.params.id);
      res.json({ success: true, message: 'Education deleted' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete education');
    }
  }

  // ===================== PROJECTS =====================
  static async getProjects(req: Request, res: Response) {
    try {
      const featured = req.query.featured === undefined ? undefined : req.query.featured === 'true';
      const projects = await PortfolioService.getPublicProjects(featured);
      res.json({ success: true, data: projects });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch projects');
    }
  }

  static async createProject(req: Request, res: Response) {
    try {
      const data = ProjectSchema.parse(req.body);
      const created = await PortfolioService.createProject(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create project');
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      const data = ProjectSchema.parse(req.body);
      const updated = await PortfolioService.updateProject(req.params.id, data);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to update project');
    }
  }

  static async deleteProject(req: Request, res: Response) {
    try {
      await PortfolioService.deleteProject(req.params.id);
      res.json({ success: true, message: 'Project deleted' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete project');
    }
  }

  // ===================== AI LAB =====================
  static async getAILab(_req: Request, res: Response) {
    try {
      const experiments = await PortfolioService.getPublicAILab();
      res.json({ success: true, data: experiments });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch AI Lab experiments');
    }
  }

  static async createAILab(req: Request, res: Response) {
    try {
      const data = AILabSchema.parse(req.body);
      const created = await PortfolioService.createAILab(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create AI Lab experiment');
    }
  }

  static async deleteAILab(req: Request, res: Response) {
    try {
      await PortfolioService.deleteAILab(req.params.id);
      res.json({ success: true, message: 'Experiment deleted' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete experiment');
    }
  }

  // ===================== SOCIAL LINKS =====================
  static async getSocialLinks(_req: Request, res: Response) {
    try {
      const links = await PortfolioService.getPublicSocialLinks();
      res.json({ success: true, data: links });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch social links');
    }
  }

  static async createSocialLink(req: Request, res: Response) {
    try {
      const data = SocialLinkSchema.parse(req.body);
      const created = await PortfolioService.createSocialLink(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create social link');
    }
  }

  static async deleteSocialLink(req: Request, res: Response) {
    try {
      await PortfolioService.deleteSocialLink(req.params.id);
      res.json({ success: true, message: 'Social link deleted' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete social link');
    }
  }

  // ===================== RESUME =====================
  static async getResume(_req: Request, res: Response) {
    try {
      const resume = await PortfolioService.getPublicResume();
      res.json({ success: true, data: resume });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch resume');
    }
  }

  static async createResume(req: Request, res: Response) {
    try {
      const data = ResumeSchema.parse(req.body);
      const created = await PortfolioService.createResume(data);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to create resume');
    }
  }

  static async deleteResume(req: Request, res: Response) {
    try {
      await PortfolioService.deleteResume(req.params.id);
      res.json({ success: true, message: 'Resume deleted' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete resume');
    }
  }

  // ===================== CONTACT =====================
  static async submitContact(req: Request, res: Response) {
    try {
      const validated = ContactMessageSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress || undefined;
      const userAgent = req.headers['user-agent'] || undefined;

      const message = await PortfolioService.submitContact({
        ...validated,
        ipAddress,
        userAgent,
      });

      res.status(201).json({
        success: true,
        message: 'Message submitted successfully',
        id: message.id,
      });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to submit message');
    }
  }

  static async getMessages(req: Request, res: Response) {
    try {
      const status = req.query.status as string | undefined;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '20', 10);
      const result = await PortfolioService.getAllMessages(status, page, limit);
      res.json({ success: true, data: result });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch messages');
    }
  }

  static async updateMessageStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const updated = await PortfolioService.updateMessageStatus(req.params.id, status);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to update message status');
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      await PortfolioService.deleteMessage(req.params.id);
      res.json({ success: true, message: 'Message deleted' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete message');
    }
  }

  // ===================== MEDIA =====================
  static async getMedia(_req: Request, res: Response) {
    try {
      const mediaList = await PortfolioService.getAllMedia();
      res.json({ success: true, data: mediaList });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to fetch media');
    }
  }

  static async recordMedia(req: AuthenticatedRequest, res: Response) {
    try {
      const { filename, originalName, mimeType, sizeBytes, url, path, altText } = req.body;
      const recorded = await PortfolioService.recordMediaUpload({
        filename,
        originalName,
        mimeType,
        sizeBytes,
        url,
        path,
        altText,
        uploadedById: req.user?.userId,
      });
      res.status(201).json({ success: true, data: recorded });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to save media metadata');
    }
  }

  static async deleteMedia(req: Request, res: Response) {
    try {
      await PortfolioService.deleteMedia(req.params.id);
      res.json({ success: true, message: 'Media record removed' });
    } catch (error: any) {
      PortfolioController.handleError(res, error, 'Failed to delete media record');
    }
  }
}

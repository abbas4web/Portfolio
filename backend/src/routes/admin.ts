import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Protect ALL admin routes with authenticateAdmin
router.use(authenticateAdmin as any);

router.get('/auth/me', PortfolioController.getMe as any);

// ================= PROFILE & NAVIGATION =================
router.put('/profile', PortfolioController.updateProfile);
router.get('/navigation', PortfolioController.getAllNavigation);
router.post('/navigation', PortfolioController.createNavigation);
router.put('/navigation/:id', PortfolioController.updateNavigation);
router.delete('/navigation/:id', PortfolioController.deleteNavigation);

// ================= SKILLS & CATEGORIES =================
router.get('/skills/categories', PortfolioController.getAllSkillCategories);
router.post('/skills/categories', PortfolioController.createSkillCategory);
router.post('/skills', PortfolioController.createSkill);
router.delete('/skills/:id', PortfolioController.deleteSkill);

// ================= SERVICES =================
router.post('/services', PortfolioController.createService);
router.put('/services/:id', PortfolioController.updateService);
router.delete('/services/:id', PortfolioController.deleteService);

// ================= EXPERIENCE =================
router.post('/experience', PortfolioController.createExperience);
router.put('/experience/:id', PortfolioController.updateExperience);
router.delete('/experience/:id', PortfolioController.deleteExperience);

// ================= EDUCATION =================
router.post('/education', PortfolioController.createEducation);
router.put('/education/:id', PortfolioController.updateEducation);
router.delete('/education/:id', PortfolioController.deleteEducation);

// ================= PROJECTS =================
router.post('/projects', PortfolioController.createProject);
router.put('/projects/:id', PortfolioController.updateProject);
router.delete('/projects/:id', PortfolioController.deleteProject);

// ================= AI LAB =================
router.post('/ai-lab', PortfolioController.createAILab);
router.delete('/ai-lab/:id', PortfolioController.deleteAILab);

// ================= SOCIAL LINKS =================
router.post('/social-links', PortfolioController.createSocialLink);
router.delete('/social-links/:id', PortfolioController.deleteSocialLink);

// ================= RESUME =================
router.post('/resume', PortfolioController.createResume);
router.delete('/resume/:id', PortfolioController.deleteResume);

// ================= CONTACT MESSAGES (INBOX) =================
router.get('/contact/messages', PortfolioController.getMessages);
router.patch('/contact/messages/:id', PortfolioController.updateMessageStatus);
router.delete('/contact/messages/:id', PortfolioController.deleteMessage);

// ================= MEDIA =================
import { uploadMiddleware } from '../middleware/upload';

router.get('/media', PortfolioController.getMedia);
router.post('/media/upload', uploadMiddleware.single('file'), PortfolioController.uploadMedia as any);
router.delete('/media/:id', PortfolioController.deleteMedia);

export default router;

import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many contact requests from this IP, please try again later.' },
});

// Aggregate bootstrap endpoint for instant SPA hydration
router.get('/bootstrap', async (_req, res) => {
  try {
    const [profile, navigation, services, skills, experience, education, projects, socialLinks] =
      await Promise.all([
        PortfolioController.getProfile as any,
      ]);
    // Uses individual public controllers
  } catch (e) {}
});

// Public Read-Only Endpoints (Only published / visible content)
router.get('/profile', PortfolioController.getProfile);
router.get('/about', PortfolioController.getAbout);
router.get('/navigation', PortfolioController.getNavigation);
router.get('/skills', PortfolioController.getSkills);
router.get('/experience', PortfolioController.getExperience);
router.get('/education', PortfolioController.getEducation);
router.get('/projects', PortfolioController.getProjects);
router.get('/ai-lab', PortfolioController.getAILab);
router.get('/services', PortfolioController.getServices);
router.get('/social-links', PortfolioController.getSocialLinks);
router.get('/resume', PortfolioController.getResume);

// Inbound contact submission (rate-limited)
router.post('/contact', contactLimiter, PortfolioController.submitContact);

export default router;

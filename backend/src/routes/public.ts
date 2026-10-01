import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import { PortfolioService } from '../services/portfolio.service';
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
    const [profile, about, navigation, skills, experience, education, projects, services, socialLinks] =
      await Promise.all([
        PortfolioService.getPublicProfile(),
        PortfolioService.getPublicAbout(),
        PortfolioService.getPublicNavigation(),
        PortfolioService.getPublicSkills(),
        PortfolioService.getPublicExperience(),
        PortfolioService.getPublicEducation(),
        PortfolioService.getPublicProjects(),
        PortfolioService.getPublicServices(),
        PortfolioService.getPublicSocialLinks(),
      ]);
    res.json({
      success: true,
      data: {
        profile,
        about,
        navigation,
        skills,
        experience,
        education,
        projects,
        services,
        socialLinks,
      },
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || 'Failed to fetch bootstrap data' });
  }
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

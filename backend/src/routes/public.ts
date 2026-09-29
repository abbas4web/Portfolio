import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many contact requests from this IP, please try again later.' },
});

router.get('/bootstrap', PortfolioController.getBootstrap);
router.post('/contact', contactLimiter, PortfolioController.submitContact);
router.get('/projects', PortfolioController.getProjects);
router.get('/experience', PortfolioController.getExperience);
router.get('/education', PortfolioController.getEducation);

export default router;

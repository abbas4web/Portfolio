import { Request, Response } from 'express';
import { PortfolioService } from '../services/portfolio.service';
import { ContactMessageSchema } from '../validators';

export class PortfolioController {
  static async getBootstrap(req: Request, res: Response) {
    try {
      const data = await PortfolioService.getBootstrapData();
      res.json(data);
    } catch (error) {
      console.error('Error fetching bootstrap data:', error);
      res.status(500).json({ error: 'Failed to load portfolio content' });
    }
  }

  static async submitContact(req: Request, res: Response) {
    try {
      const validatedData = ContactMessageSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress || undefined;
      const userAgent = req.headers['user-agent'] || undefined;

      const message = await PortfolioService.submitContactMessage({
        ...validatedData,
        ipAddress,
        userAgent,
      });

      res.status(201).json({
        success: true,
        message: 'Message received successfully',
        id: message.id,
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('Contact submission error:', error);
      res.status(500).json({ error: 'Failed to process contact submission' });
    }
  }

  static async getProjects(req: Request, res: Response) {
    try {
      const featured = req.query.featured === 'true';
      const projects = await PortfolioService.getProjects(featured);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  static async getExperience(_req: Request, res: Response) {
    try {
      const list = await PortfolioService.getExperience();
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch experience' });
    }
  }

  static async getEducation(_req: Request, res: Response) {
    try {
      const list = await PortfolioService.getEducation();
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch education' });
    }
  }
}

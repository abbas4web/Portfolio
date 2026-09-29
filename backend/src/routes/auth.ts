import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { PortfolioService } from '../services/portfolio.service';
import { LoginSchema } from '../validators';
import { authenticateAdmin, AuthenticatedRequest } from '../middleware/auth';
import { config } from '../config';

const router = Router();

// Strict rate limiting on login: max 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/auth/login
 * Validates credentials, sets HTTP-only secure cookie, never returns password hash.
 */
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const result = await PortfolioService.login(email, password);

    // Set secure HTTP-only cookie
    res.cookie(config.cookieName, result.accessToken, {
      httpOnly: true,
      secure: config.isProduction, // false in dev so http://localhost works
      sameSite: config.isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: result.user,
    });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    return res.status(401).json({
      success: false,
      error: error.message || 'Invalid email or password',
    });
  }
});

/**
 * POST /api/auth/logout
 * Clears the HTTP-only authentication cookie
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'strict' : 'lax',
    path: '/',
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * GET /api/auth/me
 * Returns current admin session info (Never exposes password hash)
 */
router.get('/me', authenticateAdmin as any, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;

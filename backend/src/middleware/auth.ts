import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../db';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check HTTP-only cookie first, then fallback to Authorization header
    let token = req.cookies?.[config.cookieName];

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required to access admin resources',
      });
    }

    // 2. Verify JWT signature & expiration
    const decoded = jwt.verify(token, config.jwtSecret) as {
      sub: string;
      email: string;
      role: string;
    };

    // 3. Confirm admin exists and is active in DB
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, fullName: true, role: true, isActive: true },
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin user account is inactive or not found',
      });
    }

    req.user = {
      userId: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session expired: Please log in again',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid authentication credentials',
    });
  }
};

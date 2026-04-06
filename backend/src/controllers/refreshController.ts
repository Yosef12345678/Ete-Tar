import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const refreshSecret = process.env.REFRESH_TOKEN_SECRET?.trim();
    if (!refreshSecret) {
      return res.status(500).json({ error: 'REFRESH_TOKEN_SECRET is not set' });
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(refreshToken, refreshSecret) as { userId: string };
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findOne({
      where: {
        id: decoded.userId,
        refresh_token: refreshToken
      }
    });

    if (!user) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

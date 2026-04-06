import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UniqueConstraintError } from 'sequelize';
import { Request, Response } from 'express';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password_hash,
      role: 'user'
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const generateRefreshToken = (userId: string) => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET?.trim();
  if (!refreshSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not set');
  }
  
  return jwt.sign(
    { userId },
    refreshSecret,
    { expiresIn: '7d' }
  );
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordHash = user.getDataValue('password_hash');

    if (!passwordHash) {
      return res.status(500).json({ error: 'Stored password hash is missing' });
    }

    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const jwtSecret = process.env.JWT_SECRET?.trim();

    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET is not set' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );
    const refreshToken = generateRefreshToken(user.id);

    await user.update({ refresh_token: refreshToken });

    return res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import User from '../models/User';

export const promoteToAdmin = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'User is already an admin' });
    }

    user.role = 'admin';
    await user.save();

    return res.json({ message: `User ${email} has been promoted to admin` });
  } catch (error) {
    console.error('Error promoting user:', error);
    return res.status(500).json({ error: 'Failed to promote user' });
  }
};
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'parkflow_super_secret_jwt_key_2026_production';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      badgeNumber: user.badgeNumber,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

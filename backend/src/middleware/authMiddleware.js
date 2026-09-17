import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header (Bearer token) or HTTP-only cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required.',
        code: 'UNAUTHENTICATED',
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      code: 'INVALID_TOKEN',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have authorization to access this resource.',
        code: 'UNAUTHORIZED_ROLE',
      });
    }
    next();
  };
};

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const authService = {
  register: async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      err.code = 'EMAIL_ALREADY_EXISTS';
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Normal registrations are strictly CUSTOMER
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'CUSTOMER',
      badgeNumber: `#${Math.floor(1000 + Math.random() * 9000)}`,
    });

    const token = generateToken(newUser);

    return {
      user: newUser.toJSON(),
      token,
    };
  },

  login: async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const token = generateToken(user);

    return {
      user: user.toJSON(),
      token,
    };
  },

  getUserById: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User account not found.');
      err.statusCode = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }
    return user.toJSON();
  },

  forgotPassword: async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Prevent user enumeration by returning standard success message
    if (!user) {
      return {
        message: 'If that email address is in our system, password reset instructions have been sent.',
      };
    }

    // Generate random 32-byte hex reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // Expire in 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    console.log(`[AUTH] Password reset requested for ${user.email}. Token: ${resetToken}`);

    return {
      message: 'If that email address is in our system, password reset instructions have been sent.',
      resetToken, // Returned in dev mode for ease of manual verification
    };
  },

  resetPassword: async ({ token, newPassword }) => {
    if (!token || !newPassword) {
      const err = new Error('Reset token and new password are required.');
      err.statusCode = 400;
      err.code = 'MISSING_FIELDS';
      throw err;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      const err = new Error('Invalid or expired password reset token.');
      err.statusCode = 400;
      err.code = 'INVALID_RESET_TOKEN';
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return {
      message: 'Password has been successfully updated. You can now log in with your new password.',
    };
  },
};

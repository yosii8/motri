import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { loginDirector, changePassword } from '../controllers/authController.js';
import { protectDirector } from '../middleware/authMiddleware.js';
import Director from '../models/Director.js';

const router = express.Router();

// LOGIN
router.post('/login', loginDirector);

// CHANGE PASSWORD (Protected)
router.put('/change-password', protectDirector, changePassword);

// Helper: create email transporter safely
function createTransporter() {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  throw new Error('Email credentials are not configured in environment variables');
}

// ===== VERIFY RESET TOKEN =====
router.get('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: 'Missing reset token.' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const director = await Director.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!director) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying token.',
    });
  }
});

// ===== FORGOT PASSWORD =====
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide your email.' });

    const director = await Director.findOne({ email: email.trim().toLowerCase() });
    if (!director) return res.status(404).json({ message: 'Director not found.' });

    // Generate token and hash for DB
    const token = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    director.resetPasswordToken = hashedToken;
    director.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await director.save();

    // Build reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password/${token}`;
    console.log('Password reset URL (for testing):', resetUrl);

    // Create transporter safely
    let transporter;
    try {
      transporter = createTransporter();
    } catch (err) {
      console.error('Email transporter error:', err.message);
      return res.status(500).json({ message: 'Email configuration error.' });
    }

    // Send email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || process.env.SMTP_USER,
        to: director.email,
        subject: 'Password Reset Request',
        text:
          `Hi ${director.username || 'there'},\n\n` +
          `You requested a password reset. Click the link below to reset your password. This link expires in 1 hour.\n\n` +
          `${resetUrl}\n\n` +
          `If you did not request this, please ignore this email.\n\n` +
          `— Your Team`,
      });
    } catch (emailErr) {
      console.error('Forgot password email error:', emailErr.message);
      return res.status(500).json({ message: 'Failed to send password reset email.' });
    }

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error while sending email.' });
  }
});

// ===== RESET PASSWORD =====
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) return res.status(400).json({ message: 'Missing reset token.' });
    if (!newPassword || newPassword.trim().length < 6)
      return res.status(400).json({ message: 'Please provide a new password (min 6 characters).' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const director = await Director.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!director) return res.status(400).json({ message: 'Invalid or expired reset token.' });

    director.password = newPassword;
    director.resetPasswordToken = null;
    director.resetPasswordExpires = null;
    await director.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error while resetting password.' });
  }
});

export default router;

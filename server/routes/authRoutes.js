import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { loginDirector, changePassword } from '../controllers/authController.js';
import { protectDirector } from '../middleware/authMiddleware.js';
import Director from '../models/Director.js';

dotenv.config();
const router = express.Router();

/* ======================
   LOGIN (Username or Email)
   ====================== */
router.post('/login', loginDirector);

/* ======================
   CHANGE PASSWORD (Protected)
   ====================== */
router.put('/change-password', protectDirector, changePassword);

/* ======================
   FORGOT PASSWORD
   Send Reset Link to Email
   ====================== */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: 'Please provide your email' });

    // find user (case-insensitive)
    const director = await Director.findOne({ email: email.toLowerCase() });
    if (!director)
      return res.status(404).json({ message: 'Director not found' });

    // generate reset token
    const token = crypto.randomBytes(20).toString('hex');

    // save token and expiry (1 hour)
    director.resetPasswordToken = token;
    director.resetPasswordExpires = Date.now() + 3600000;
    await director.save();

    // email transport setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: director.email,
      subject: 'Password Reset Request',
      text: `Hi ${director.username},\n\nYou requested a password reset. 
Click the link below to reset your password:\n\n${resetUrl}\n\n
If you didn’t request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error while sending email' });
  }
});

/* ======================
   RESET PASSWORD
   (Verify Token + Update Password)
   ====================== */
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword)
      return res.status(400).json({ message: 'Please provide a new password' });

    // find user with valid token
    const director = await Director.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!director)
      return res.status(400).json({ message: 'Invalid or expired reset token' });

    // ✅ Assign new password (pre-save hook will hash it)
    director.password = newPassword;

    // clear token
    director.resetPasswordToken = null;
    director.resetPasswordExpires = null;

    await director.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error while resetting password' });
  }
});

export default router;

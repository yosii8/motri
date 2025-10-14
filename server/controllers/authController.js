import Director from '../models/Director.js';
import jwt from 'jsonwebtoken';

// ====================
// Director Login (Username or Email)
// ====================
export const loginDirector = async (req, res) => {
  try {
    const { identifier, password } = req.body; // username or email

    // 1️⃣ Check required fields
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide username/email and password' });
    }

    // 2️⃣ Find director by username or email (case-insensitive for email)
    const director = await Director.findOne({
      $or: [
        { username: identifier },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!director) {
      return res.status(401).json({ message: 'Invalid username or email' });
    }

    // 3️⃣ Compare password using schema method
    const isMatch = await director.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign({ id: director._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // 5️⃣ Send response
    return res.status(200).json({
      message: 'Login successful',
      token,
      director: {
        id: director._id,
        username: director.username,
        email: director.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// ====================
// Change Director Password (Protected)
// ====================
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Please provide both old and new passwords' });
    }

    // Find director from token
    const director = await Director.findById(req.director.id);
    if (!director) {
      return res.status(404).json({ message: 'Director not found' });
    }

    // Check old password
    const isMatch = await director.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Update password (auto-hashed by schema pre-save)
    director.password = newPassword;
    await director.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Server error while changing password' });
  }
};

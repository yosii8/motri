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

    // 2️⃣ Find director by username or email (safe lowercase check)
    const director = await Director.findOne({
      $or: [
        { username: identifier },
        { email: typeof identifier === 'string' ? identifier.toLowerCase() : '' },
      ],
    });

    // 3️⃣ Validate director
    if (!director) {
      return res.status(401).json({ message: 'Invalid username or email' });
    }

    // 4️⃣ Compare password
    const isMatch = await director.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // 5️⃣ Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is missing in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign({ id: director._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // 6️⃣ Send response
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

    // 1️⃣ Find director from token
    const director = await Director.findById(req.director.id);
    if (!director) {
      return res.status(404).json({ message: 'Director not found' });
    }

    // 2️⃣ Check old password
    const isMatch = await director.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // 3️⃣ Update password (auto-hashed by pre-save hook)
    director.password = newPassword;
    await director.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res
      .status(500)
      .json({ message: 'Server error while changing password' });
  }
};

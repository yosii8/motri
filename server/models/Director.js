import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const directorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // always save in lowercase
      trim: true
    },
    password: {
      type: String,
      required: true
    },

    // ===== Forgot Password fields =====
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// ✅ Hash password before saving (only when modified or new)
directorSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Compare entered password with hashed password
directorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Director = mongoose.model('Director', directorSchema);
export default Director;

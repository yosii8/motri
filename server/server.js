import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

// ===== CORS =====
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://motri-et.vercel.app',
  'https://motri-topaz.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, mobile apps)
      if (!origin) return callback(null, true);

      // Allow only listed origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn(`🚫 CORS blocked request from origin: ${origin}`);
      return callback(new Error('CORS policy violation'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// ===== Body Parser =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Serve Uploads =====
app.use('/uploads', express.static(path.resolve('uploads')));

// ===== Handle Preflight Requests =====
app.options('*', cors());

// ===== API Routes =====
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

// ===== Test Route =====
app.get('/', (req, res) => res.send('API Running...'));

// ===== Start Server =====
const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('Server start failed:', err);
    process.exit(1);
  }
};

startServer();

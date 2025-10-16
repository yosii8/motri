import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

// ===== CORS Setup =====
const allowedOrigins = [
  'https://motri-et.vercel.app',    // main production
  'https://motri-topaz.vercel.app', // backup production
  'http://localhost:5173',          // Vite local frontend
  'http://localhost:3000',          // React default port
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      console.log('❌ CORS blocked for origin:', origin);
      return callback(new Error('CORS not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Static Files (uploads) =====
app.use('/uploads', express.static(path.resolve('uploads')));

// ===== API Routes =====
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

// ===== Root Test Route =====
app.get('/', (req, res) => {
  res.send('✅ API is running successfully...');
});

// ===== Local server (only if running locally) =====
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  const HOST = process.env.HOST || 'localhost';

  (async () => {
    try {
      await connectDB(); // Connect to MongoDB
      app.listen(PORT, HOST, () => {
        console.log(`🚀 Server running locally at http://${HOST}:${PORT}`);
      });
    } catch (err) {
      console.error('❌ Server start failed:', err.message);
      process.exit(1);
    }
  })();
}

// ===== Export app for Vercel =====
export default app;

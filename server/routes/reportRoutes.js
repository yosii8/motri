import express from 'express';
import { submitReport, getReports, deleteReport } from '../controllers/reportController.js';
import { protectDirector } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public report submission
router.post('/', upload.single('image'), submitReport);

// Director-only routes
router.get('/', protectDirector, getReports);
router.delete('/:id', protectDirector, deleteReport);

export default router;

import express from 'express';
import { submitReport, getReports, deleteReport } from '../controllers/reportController.js';
import { protectDirector } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Simple async wrapper to forward errors to Express error middleware
const wrap = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// PUBLIC: Submit a report (with optional image upload)
// - `upload.single('image')` will parse multipart/form-data and attach file to req.file
// - Controller should handle validation of required fields
router.post('/', upload.single('image'), wrap(submitReport));

// DIRECTOR (protected) routes
// - List all reports (protected)
router.get('/', protectDirector, wrap(getReports));

// - Delete a report by id (protected)
//   Basic id presence check; controller is expected to validate existence.
router.delete('/:id', protectDirector, wrap(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'Missing report id' });
  // delegate to controller
  return deleteReport(req, res, next);
}));

export default router;

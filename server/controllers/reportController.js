import Report from '../models/Report.js';

/**
 * Submit a new report (unauthenticated)
 * Saves all fields from the frontend form
 * Optional: image upload
 */
export const submitReport = async (req, res) => {
  try {
    // Keep all original form fields
    const reportData = { ...req.body };

    // Optional: if an image is uploaded, save its path
    if (req.file) {
      // FIXED: store accessible URL path instead of system path
      reportData.image = `/uploads/${req.file.filename}`;
    }

    // Create report in DB
    const report = await Report.create(reportData);

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all reports (director-only)
 */
export const getReports = async (req, res) => {
  try {
    // Fetch all reports sorted by newest first
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a report by ID (director-only)
 */
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

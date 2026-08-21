const express = require("express");
const requireAdmin = require("../middleware/adminAuth");
const {
  getApplications,
  updateApplication
} = require("../services/applicationStore");

const router = express.Router();
router.use(requireAdmin);
// View all applications
router.get("/applications", (req, res) => {
  res.json({
    success: true,
    applications: getApplications()
  });
});

// Approve application
router.patch("/applications/:id/approve", (req, res) => {
  const application = updateApplication(
    req.params.id,
    {
      status: "approved",
      reviewedAt: new Date().toISOString()
    }
  );

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found"
    });
  }

  res.json({
    success: true,
    message: "Application approved",
    application
  });
});

// Reject application
router.patch("/applications/:id/reject", (req, res) => {
  const application = updateApplication(
    req.params.id,
    {
      status: "rejected",
      reviewedAt: new Date().toISOString()
    }
  );

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found"
    });
  }

  res.json({
    success: true,
    message: "Application rejected",
    application
  });
});

module.exports = router;

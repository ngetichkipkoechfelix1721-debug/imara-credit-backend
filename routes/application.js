const express = require("express");
const {
  addApplication
} = require("../services/applicationStore");
const router = express.Router();

const MIN_LOAN = 1000;
const MAX_LOAN = 500000;
const PROCESSING_FEE_RATE = 0.10;

router.post("/", (req, res) => {
  const {
    fullName,
    nationalId,
    phone,
    email,
    loanAmount,
    purpose
  } = req.body;

  // Required fields
  if (
    !fullName ||
    !nationalId ||
    !phone ||
    !email ||
    !loanAmount ||
    !purpose
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Full name, national ID, phone, email, loan amount and purpose are required"
    });
  }

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  // Validate loan amount
  const amount = Number(loanAmount);

  if (
    !Number.isFinite(amount) ||
    amount < MIN_LOAN ||
    amount > MAX_LOAN
  ) {
    return res.status(400).json({
      success: false,
      message: "Loan amount must be between KSh 1,000 and KSh 500,000"
    });
  }

  // Calculate 10% processing fee
  const processingFee = Math.round(
    amount * PROCESSING_FEE_RATE
  );

  const application = {
    id: "IMARA-" + Date.now(),
    fullName,
    nationalId,
    phone,
    email,
    loanAmount: amount,
    processingFee,
    processingFeeRate: "10%",
    purpose,
    status: "pending",
    paymentStatus: "unpaid",
    paymentReference: null,
    paymentDate: null,
    createdAt: new Date().toISOString()
  };

  console.log(
    "New Imara Credit application:",
    application.id
  );
addApplication(application);
  res.status(201).json({
    success: true,
    message: "Imara Credit application received",
    application
  });
});

module.exports = router;

const express = require("express");
const axios = require("axios");

const router = express.Router();

function normalizePhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");

  if (digits.startsWith("0")) {
    digits = "254" + digits.substring(1);
  }

  if (digits.startsWith("7") && digits.length === 9) {
    digits = "254" + digits;
  }

  if (!/^2547\d{8}$/.test(digits)) {
    return null;
  }

  return "+" + digits;
}

router.post("/mpesa", async (req, res) => {
  try {
    const { email, phone, amount, applicationId } = req.body;

    if (!email || !phone || !amount || !applicationId) {
      return res.status(400).json({
        success: false,
        message: "Email, phone, amount and application ID are required"
      });
    }

    const paymentAmount = Math.round(Number(amount));

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount"
      });
    }

    const customerPhone = normalizePhone(phone);

    if (!customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Invalid Kenyan M-PESA phone number"
      });
    }

    const reference =
      "IMARA-" +
      String(applicationId).replace(/[^a-zA-Z0-9]/g, "") +
      "-" +
      Date.now();

    console.log("Starting Paystack M-PESA payment:", reference);

    const response = await axios.post(
      "https://api.paystack.co/charge",
      {
        email,
        amount: paymentAmount * 100,
        currency: "KES",
        reference,
        mobile_money: {
          phone: customerPhone,
          provider: "mpesa"
        },
        metadata: {
          application_id: applicationId
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const paymentData = response.data.data;

    return res.json({
      success: true,
      message: response.data.message,
      reference: paymentData.reference,
      status: paymentData.status,
      displayText: paymentData.display_text || null
    });

  } catch (error) {
    console.error(
      "Paystack payment error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        "Unable to start M-PESA payment"
    });
  }
});


router.get("/verify/:reference", async (req, res) => {
  try {
    const reference = req.params.reference;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required"
      });
    }

    console.log("Verifying Paystack payment:", reference);

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const payment = response.data.data;

    return res.json({
      success: true,
      reference: payment.reference,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      paidAt: payment.paid_at || null,
      channel: payment.channel || null
    });

  } catch (error) {
    console.error(
      "Paystack verification error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        "Unable to verify payment"
    });
  }
});

module.exports = router;

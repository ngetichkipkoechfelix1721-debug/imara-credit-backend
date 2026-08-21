require("dotenv").config();

const express = require("express");
const cors = require("cors");

const applicationRoute = require("./routes/application");
const paystackRoutes = require("./routes/paystack");
const adminRoutes = require("./routes/admin");
const adminAuthRoutes = require("./routes/adminAuth");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Imara Credit backend is running 🚀"
  });
});

app.use("/api/applications", applicationRoute);
app.use("/api/paystack", paystackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Imara Credit backend running on port ${PORT}`);
});

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function requireAdmin(req, res, next) {
  const username = req.headers["x-admin-username"];
  const password = req.headers["x-admin-password"];

  if (
    username === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Admin authentication required"
  });
}

module.exports = requireAdmin;

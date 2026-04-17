// src/middleware/auth.js
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Check against the environment variable instead of a hardcoded string
  if (!authHeader || authHeader !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
  }
  
  next();
};

module.exports = requireAuth;
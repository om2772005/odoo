// middleware/verifyAgent.js
const jwt = require("jsonwebtoken");

const verifyAgentToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token, unauthorized" });

  try {
    const decoded = jwt.verify(token, "sss");
    req.agent = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = verifyAgentToken;

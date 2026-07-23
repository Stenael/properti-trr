const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("Authorization:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log("Error:", err);
    console.log("Decoded:", decoded);

    if (err) {
      return res.status(403).json({
        message: err.message,
      });
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = authenticateToken;
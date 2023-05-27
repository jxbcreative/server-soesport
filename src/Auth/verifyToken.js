const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized." });
  }
  try {
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized." });
  }
};

module.exports = verifyToken;

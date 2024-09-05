import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies.access_token;

if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized - Access token missing' });
  }
jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(403).json({ error: "Unauthorized - Invalid token" });
    }
    req.user=user;
    req.email=user.email;
    req.fname = user.fname;
    next();
  });
};

export default authenticateToken;

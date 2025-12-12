const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ msg:'No token' });
  const token = authHeader.split(' ')[1];
  if(!token) return res.status(401).json({ msg:'No token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch(e) {
    return res.status(401).json({ msg:'Invalid token' });
  }
};

const { TokenExpiredError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.token;
  if (!token) {
    res.json({ message: "A token is required for authentication" });
    throw new Error("No token found");
  }  else {
    try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
    } catch (error) {
      console.log(error, "error");
      return res.status(401).json({message:'invalid token'});
    }
    return next();
  }
};

module.exports = verifyToken;

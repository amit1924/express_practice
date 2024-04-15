import jwt from "jsonwebtoken";

const secretKey = "amit12345";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; // Split by space and get the second part
  console.log("Token", token);

  if (!token) {
    console.log("Unauthorized");
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log(`error verifying token ${err.message}`);
      return res.sendStatus(403);
    }
    req.user = user;
    console.log(req.user);
    next();
  });
};

export default authenticateToken;

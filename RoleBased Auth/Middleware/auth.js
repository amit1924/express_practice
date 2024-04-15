const authorizeRole = (role) => {
  return (req, res, next) => {
    const user = req.user;
    if (user && user.role === role) {
      next();
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  };
};

export default authorizeRole;

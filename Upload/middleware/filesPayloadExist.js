const filesExists = (req, res, next) => {
  if (!req.files)
    return res.status(404).json({
      status: "error",
      message: "Missing required files",
    });
  next();
};

export default filesExists;

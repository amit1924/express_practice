import path from "path";

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const files = req.files;

    const fileExtensions = [];
    for (const key in files) {
      const file = files[key];

      fileExtensions.push(path.extname(file.name));
    }

    // Are the file extension allowed?
    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );

    if (!allowed) {
      const message =
        `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
          ",",
          ", "
        );

      return res.status(422).json({ status: "error", message });
    }

    next();
  };
};

export default fileExtLimiter;

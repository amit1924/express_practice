import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import filesExists from "./middleware/filesPayloadExist.js";
import fileSizeLimiter from "./middleware/fileSizeLimiter.js";
import fileExtLimiter from "./middleware/fileExtLimiter.js";

const BASE_DIR = path.resolve();

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(BASE_DIR, "index.html"));
});

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,

  (req, res) => {
    const files = req.files;
    console.log(files);
    return res.json({
      status: "logged",
      message: "uploaded files successfully",
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

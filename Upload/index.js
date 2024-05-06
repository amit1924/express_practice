import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import filesExists from "./middleware/filesPayloadExist.js";
import fileSizeLimiter from "./middleware/fileSizeLimiter.js";
import fileExtLimiter from "./middleware/fileExtLimiter.js";
import fs from "fs";

const BASE_DIR = path.resolve();
console.log(`BASE_DIR`, BASE_DIR); //C:\Users\cours\Desktop\AllBackend\Express\Upload

const app = express();
const PORT = 3000;

// Serve uploaded images statically

app.use("/uploads", express.static(path.join(BASE_DIR, "uploads")));

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

    const imagefile = files && files.image;

    if (!imagefile) {
      return res.status(400).json({ message: "Image file not found" });
    }
    const uploadPath = path.join(BASE_DIR, "uploads", imagefile.name);
    console.log(`uploading ${uploadPath}`); // C:\Users\cours\Desktop\AllBackend\Express\Upload\uploads\adaptive.jpeg
    imagefile.mv(uploadPath, (err) => {
      if (err) {
        console.error("Error saving file: " + err.message);
      }
    });
    // Image Path
    const uploadedImage = `/uploads/${imagefile.name}`;

    return res.json({
      status: "logged",
      message: "uploaded files successfully",
      imagePath: uploadedImage, // Send the image path back to the client
    });
  }
);

app.get("/images", (req, res) => {
  const uploadDir = path.join(BASE_DIR, "uploads");
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading directory: " + err.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const imagePaths = files
      .filter((file) => {
        return /\.(png|jpg|jpeg)$/i.test(file);
      })
      .map((file) => {
        return `/uploads/${file}`;
      });

    return res.json(imagePaths);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("public"));

// Mongodb configuration
const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/imageUploads");
    console.log("Connecting to database is successful");
  } catch (e) {
    console.log(`Connecting to database is not successful: ${e.message}`);
  }
};

connect();

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize Multer
const upload = multer({ storage: storage });

// Schema for Image metadata
const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  originalname: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", imageSchema);

// GET route
app.get("/", (req, res) => {
  res.send("this is the HTML page");
});

app.get("/fetchimage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "fetchimage.html"));
});

// Endpoint to handle image upload
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const newImage = new Image({
      filename: req.file.filename,
      path: req.file.path,
      originalname: req.file.originalname,
    });

    await newImage.save();
    res.status(200).json({ message: "Image upload Success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Image upload failed" });
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json({
      images,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  console.log(filePath);
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

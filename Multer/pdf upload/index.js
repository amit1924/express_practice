import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.static("public"));

// Mongodb configuration
const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/pdfuploads");
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

// Schema for Pdf metadata
const pdfSchema = new mongoose.Schema({
  filename: String,
  path: String,
  originalname: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Pdf = mongoose.model("Pdf", pdfSchema);

//get route
app.get("/", (req, res) => {
  res.send("this is html page");
});

// Endpoint to handle Pdf upload
app.post("/upload", upload.single("pdf"), (req, res) => {
  try {
    const newPdf = new Pdf({
      filename: req.file.filename,
      path: req.file.path,
      originalname: req.file.originalname,
    });

    const savePdf = newPdf.save();
    if (savePdf) {
      res.status(200).json({ message: "Pdf Upload Success" });
    } else {
      res.status(404).json({ message: "Upload failed" });
    }
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

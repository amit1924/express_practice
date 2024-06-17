import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.get("/profile", (req, res) => {
  const token = req.cookies.sessionToken;
  console.log(`Token: ${token}`);
  if (token === "token123") {
    res.status(200).json({
      message: "Token is correct and now you are authorized to visit this site",
    });
  } else {
    res.status(403).json({ message: "Invalid Token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

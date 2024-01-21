import express from "express";

import student from "./routes/student.js";

const app = express();

app.use("/student", student);

app.listen(8000, () => {
  console.log(`listening on ${8000}`);
});

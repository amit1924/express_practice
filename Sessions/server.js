import express from "express";
import { sessionMiddleware } from "./middleware/session.js";

import { router } from "./routes/index.js";

const app = express();
app.use(express.json());

//2.configure session middleware
app.use(sessionMiddleware);

//3. create an unprotected login end point
// create an unprotected login end point
app.use(router);

app.listen(5000, () => {
  console.log(`server listening on
  ${5000}`);
});

import express from "express";
import session from "express-session";

const app = express();

app.use(
  session({
    secret: "amit1234",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 6000,
    },
  })
);

app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Views: ${req.session.views}`);
  } else {
    req.session.views = 1;
    res.send("First visit");
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

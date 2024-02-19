import session from "express-session";

export const sessionMiddleware = session({
  store: new session.MemoryStore(),
  secret: "mySecret",
  saveUninitialized: false,
  resave: false,
  name: "sessionId",
  cookie: {
    secure: false, // true for production environments
    httpOnly: true, //prevent client-side JS from reading cookies
    maxAge: 1000 * 60 * 30,
  },
});

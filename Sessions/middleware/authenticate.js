//4.plug in another middleware that will check if the user is authenticated or not
const authenticate = (req, res, next) => {
  if (!req.session || !req.session.clientId) {
    const err = new Error("You must login");
    err.statusCode = 401;
    next(err);
  }
  // if login is successfull
  next();
};

export default authenticate;

import loginAuth from "../service/serviceAuth.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  // perform payload authentication
  if (!email || !password) {
    return res.status(400).json("email and password are required");
  }

  try {
    const user = await loginAuth(email, password);
    req.session.user = user;
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }

  //assume credentials are correct
  req.session.clientId = "abc123";
  req.session.myNum = 5;
  res.json("you are logged in successfully");
};

export default login;

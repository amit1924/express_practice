const login = (req, res) => {
  const { email, password } = req;

  //check if credentials are correct

  //assume credentials are correct
  req.session.clientId = "abc123";
  req.session.myNum = 5;
  res.json("you are logged in successfully");
};

export default login;

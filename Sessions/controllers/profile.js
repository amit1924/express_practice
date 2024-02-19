const profile = (req, res) => {
  res.json(req.session); //this line authorize to use profile routes
};

export default profile;

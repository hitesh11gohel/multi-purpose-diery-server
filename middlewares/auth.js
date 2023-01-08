const Auth = (req, res, next) => {
  console.log("req.isAuthenticated() :", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.json({ message: "Authantication failed" });
};

module.exports = Auth;

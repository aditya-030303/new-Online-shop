function checkAuthStatus(req, res, next) {
  const Uid = req.session.uid;

  if (!Uid) {
    return next();
  }
  res.locals.uid = Uid;
  res.locals.isAuth = true;
  res.locals.isAdmin = req.session.isAdmin;
  next();
}
module.exports = checkAuthStatus;

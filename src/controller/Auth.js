export default function isAuthenticated(req, res, next) {
  if (req.cookies.userSession) {
    next();
  } else {
    res.redirect('/login');
  }
}
module.exports = () => {
  return (req, res, next) => {
    if (req.user) next()
    else return res.redirect(`/login?redirect_to=${encodeURIComponent(req.path)}`)
  }
}

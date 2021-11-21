module.exports = () => {
  return (req, res, next) => {
    console.log('path', req.path)

    if (req.user) next()
    else return res.redirect(`/login?redirect_to=${encodeURIComponent(req.path)}`)
  }
}

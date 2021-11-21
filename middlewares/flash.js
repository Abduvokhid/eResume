module.exports = () => (req, res, next) => {
  if (req.session === undefined) throw Error('req.flash() requires sessions')
  const messages = req.session.flash = req.session.flash || {}

  req.flash = (type, msg) => {
    return new Promise((resolve) => {
      (messages[type] = messages[type] || []).push(msg)
      req.session.save(() => resolve())
    })
  }

  req.getFlash = async (type) => {
    return new Promise((resolve) => {
      if (!type) {
        req.session.flash = {}
        req.session.save(() => resolve(messages))
      }

      const arr = messages[type]
      delete messages[type]
      req.session.save(() => resolve(arr || []))
    })

  }
  next()
}

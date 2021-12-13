module.exports = () => (req, res, next) => {
  if (req.session === undefined) throw Error('req.flash() requires sessions')
  const messages = req.session.flash = req.session.flash || {}

  req.flash = async (type, msg) => {
    messages[type] = msg
    await req.session.save()
  }

  req.getFlash = async (type) => {
    if (!type) {
      req.session.flash = {}
      await req.session.save()
      return messages
    }

    const msg = messages[type]
    delete messages[type]
    await req.session.save()
    return msg
  }
  next()
}

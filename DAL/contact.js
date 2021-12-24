const Contact = require('../models/Contact')

module.exports.createContact = async (data) => {
  const contact = new Contact(data)
  await contact.save()
  return contact
}

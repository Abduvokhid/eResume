const axios = require('axios')

module.exports.sendVerification = async (email, link) => {
  const url = 'https://api.sendinblue.com/v3/smtp/email'
  const api_key = process.env.SENDINBLUE_KEY

  const data = {
    sender: {
      name: 'eResume',
      email: 'noreply@eresume.uz'
    },
    to: [
      {
        email: email
      }
    ],
    params: {
      link: link
    },
    templateId: 1
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'api-key': api_key
  }

  await axios.post(url, data, { headers: headers })
}

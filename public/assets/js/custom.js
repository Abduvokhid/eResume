$('select[aria-label="contact_type"]').change(() => {
  const selected = $('select[aria-label="contact_type"] option:selected')[0].value
  const value = $('input[aria-label="contact_value"]')
  switch (selected) {
    case 'email':
      value.attr('placeholder', 'your@mail.uz')
      break
    case 'phone':
      value.attr('placeholder', '+9989012345678')
      break
    case 'telegram':
      value.attr('placeholder', '@telegram')
      break
  }
})

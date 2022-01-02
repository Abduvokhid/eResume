// a - alert
// t - text
// at - attribute


module.exports.isSelected = (current_value, required_value) => {
  if (current_value === required_value) return 'selected'
}

module.exports.tGender = (value) => {
  switch (value) {
    case 'male': return 'Мужчина'
    case 'female': return 'Женщина'
    default: return 'Не указан'
  }
}

module.exports.tContactType = (value) => {
  switch (value) {
    case 'email': return 'Э-почта'
    case 'phone': return 'Телефон'
    case 'telegram': return 'Telegram'
  }
}

module.exports.aContactType = (value) => {
  switch (value) {
    case 'email': return 'badge-soft-warning text-warning'
    case 'phone': return 'badge-soft-success text-success'
    case 'telegram': return 'badge-soft-info text-info'
  }
}

module.exports.atEmailPref = (value) => {
  if (!!value) return 'checked'
}
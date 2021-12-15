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

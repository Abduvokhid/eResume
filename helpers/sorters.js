module.exports.sortByDates = (a, b) => {
  if (a.from_date < b.from_date) return 1
  if (a.from_date > b.from_date) return -1
  if (!b.to_date) return 1
  if (!a.to_date) return -1
  if (a.to_date < b.to_date) return 1
  if (a.to_date > b.to_date) return -1
  return 0
}

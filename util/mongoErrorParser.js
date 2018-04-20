module.exports = function (err) {
  let res = {errors: {}}

  // Dirty hack: without 'mongoose-unique-validator' duplicate of unique key resolving as 11000 error code
  if (err.code === 11000) {
    res.errors.name = []
    res.errors.name.push('must be unique')
    return res
  }

  for (let key of Object.keys(err.errors)) {
    res.errors[key] = []

    let kind = err.errors[key].kind

    switch (kind) {
      case 'required' :
        res.errors[key].push('can\'t be blank')
        break
      case 'unique':
        res.errors[key].push('must be unique')
        break
      case 'min':
        res.errors[key].push('can\'t be negative')
        break
      default:
        res.errors[key].push('unknown error')
    }
  }

  return res
}

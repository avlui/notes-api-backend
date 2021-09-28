const logger = (request, response, next) => {
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('_ _ _ _ _ _ _')
  next()
}

module.exports = logger // Exportando el modulo en CommonJs

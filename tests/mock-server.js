
const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.get('/users/get-bscpm-last-version', (req, res) => {
  res.json({ 'version': '0.8.0' })
})

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  next()
})

server.listen(9010, () => {
  console.log('JSON Server is running')
})

module.exports = server

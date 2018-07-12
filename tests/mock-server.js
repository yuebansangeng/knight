
var http = require('http')
var express = require('express')
var path = require('path')
var app = express()


app.get('/users/get-bscpm-last-version', (req, res) => {
  res.json({ 'version': '0.8.0' })
})


app.use((req, res, next) => {
  next()
})

app.set('port', 9010)
var server = http.createServer(app)
server.listen(9010)

module.exports = app

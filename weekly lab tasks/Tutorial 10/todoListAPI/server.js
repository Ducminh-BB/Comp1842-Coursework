const express = require('express')
const mongoose = require('mongoose')
const todoRoute = require('./api/routes/todoListRoutes')
const bodyParser = require('body-parser')

const app = express()
const uri = 'mongodb://localhost:27017/todoList'

mongoose.connect(uri)
.then(console.log('connected to db succeed'))
.catch((err) => console.log('connect to db failed' + err))

const port = 8000

// config body-parser lib

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

todoRoute(app)


app.get('/', (req, res) => {
    res.send("<h1>Hello World<h1>")
})

app.get('/greenwich', (req, res) => {
    res.send("<h1>Hello Greenwich<h1>")
})

app.listen(port)

console.log('Server is running at http://localhost:'+port)
const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const vocabRouter = require('./routes/vocabsRoute')
const accountRouter = require('./routes/accountsRoute')
const leaderboardRouter = require('./routes/leaderboardRoute')
const testVocabRouter = require('./routes/testVocabRoute')

const app = express()
const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI

// set up middlewares

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

// logs each incoming request

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

vocabRouter(app)
accountRouter(app)
leaderboardRouter(app)
testVocabRouter(app)

mongoose.connect(MONGO_URI)
.then(() => {
    // listen for request
    app.listen(PORT, () => {
    console.log('connected to db & server is running at http://localhost:' + PORT)
})
})
.catch((err) => {
    console.error("Failed to start server:", err)
})
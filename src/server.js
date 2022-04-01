require('dotenv').config()

const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars')
const app = express()


const PORT = process.env.PORT || 5000
const router = require('./router/index.router')
const db = require('./config/db.config')

// Views
app.engine('.hbs', engine({
    extname: '.hbs'
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'resource/views'))

// Middware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

db.connect()
router(app)
app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
})
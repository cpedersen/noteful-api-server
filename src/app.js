require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const winston = require('winston')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const foldersRouter = require('./folders/folders-router')
const notesRouter = require('./notes/notes-router')
/*const logger = require('./logger')*/
const { v4: uuid } = require('uuid');

/* -------------------------------------------------------- */
/*                 Express setup                            */
/* -------------------------------------------------------- */
const app = express()

/* -------------------------------------------------------- */
/*                 Winston setup                            */
/* -------------------------------------------------------- */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

/* -------------------------------------------------------- */
/*              Morgan & other setup                        */
/* -------------------------------------------------------- */
//NODE_ENV is a Node env variable. It determines if the app
//is running in production or some other env. When we deploy
//Heroku sets this env variable to a value of "production".
//We can check to see if the NODE_ENV is set to "production"
//or not, and set the value for morgan as appropriate.
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'; 
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())


/* -------------------------------------------------------- */
/*                     Endpoints                            */
/* -------------------------------------------------------- */
app.use('/api/folders', foldersRouter)

app.use('/api/notes', notesRouter)

/* -------------------------------------------------------- */
/*                         GET /                            */
/* -------------------------------------------------------- */
app.get('/', (req, res) => {
    res.send('Hello, world!');
    res.status(200);
})

/* -------------------------------------------------------- */
/*                 Error Handler                            */
/* -------------------------------------------------------- */
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    console.log(response, error)
    res.status(500).json(response)
})
  
/* -------------------------------------------------------- */
/*                    Public                                */
/* -------------------------------------------------------- */
app.use(express.static('public'))

module.exports = app
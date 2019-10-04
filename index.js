// code away!
const express = require('express');
const helmet = require('helmet');


const server = express();

// const express = require('express');
// server.use(express.json());

const port = 9999;

server.listen(port, () => {
  console.log(`\n* Server Running on http://localhost:${port} *\n`);
});


const logger = (req, res, next) => {
    console.log(`${req.method} to ${req.path}`)
    next();
  }

const projectRouter = require('./data/projects/projects-router.js');




server.use(logger)
server.use(helmet());
server.use(express.json());

server.use('/api/projects', projectRouter);

// const gate = require('./data/auth/gate-middleware.js');


server.get('/', (req, res) => {
  res.send(`<h2>Sprint Server Running!</h2>`)
});


//custom middleware







module.exports = server;

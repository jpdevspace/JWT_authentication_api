// Main starting point of the app
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/router');
const config = require('./config/config');


const app = express()

// DB Setup
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// App Setup
// Middleware: Morgan
app.use(morgan('combined'));

// Allow CORS
app.use(cors());

// Middleware: Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Router
app.use('/', router);

// Server Setup: Getting our Express app to talk to the world
const port = process.env.PORT || 3090;
app.listen(port, () => console.log(`App listening on port ${port}!`))
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const colors = require('colors');
const config = require('./config');
const authenticate = require('./genTokenForServer');
const fs = require('fs-extra');

const tokenFile = './token.json';

const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const classRoomRouter = require('./routes/classroom');

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3000/login'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

function createTokenFile() {
  authenticate()
    .then((client) => {
      fs.outputJsonSync(tokenFile, client);
      console.log(fs.readJsonSync(tokenFile));
    })
    .catch(console.error);
}

fs.readJson(tokenFile, (err, data) => {
  if (err) {
    console.error(err);
    createTokenFile();
  } else {
    if (
      data &&
      data._clientId === config.oauth2Credentials.client_id &&
      data._clientSecret === config.oauth2Credentials.client_secret
    ) {
      console.log('success load token file!'.blue);
    } else {
      createTokenFile();
    }
  }
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/classroom', classRoomRouter);

module.exports = app;

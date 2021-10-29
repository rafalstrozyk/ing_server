const express = require('express');
const router = express.Router();
const config = require('../config');
const jwt = require('jsonwebtoken');
const oAuth2Client = require('../oAuth2');
const getUserProfile = require('../functions/getUserProfile');

// Create login link for login to app by google
router.get('/google_login_link', (req, res) => {
  try {
    const loginLink = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.oauth2Credentials.scopes,
    });
    res.status(200).json({ loginLink });
    console.log('succes create link to login'.green);
  } catch {
    res.status(400).json({ error: 'link error' });
    console.log('login link error'.red);
  }
});

router.get('/auth_callback', (req, res) => {
  try {
    if (req.query.error) {
      // The user did not give us permission.
      res.json({ error: 'The user did not give permision' });
      console.log('The user did not give us permission.'.red);
    } else {
      oAuth2Client.getToken(req.query.query, (err, token) => {
        if (err) {
          console.log(`error: ${err}`.red);
          res.json({ error: 'oAuth: something went wrong' });
        }
        // create encrypted token cooki for client
        res.status(200).cookie('jwt', jwt.sign(token, config.JWTsecret)).json({
          isLogin: true,
          create_cookie: true,
          info: 'succes login user!',
        });
        console.log('succes login user!'.green);
      });
    }
  } catch {
    res.status(400).json({ error: 'Something went wrong' });
  }
});

router.get('/user_profile', async (req, res) => {
  try {
    const decode = jwt.verify(req.cookies.jwt, config.JWTsecret);

    oAuth2Client.setCredentials(decode);
    try {
      const googleProfile = await getUserProfile(oAuth2Client, 'me');
      console.log(googleProfile);
      res.json({ isLogin: true, ...googleProfile });
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
});
module.exports = router;

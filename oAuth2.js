const config = require('./config');
const google = require('googleapis').google;
const OAuth2 = google.auth.OAuth2;

const oAuth2Client = new OAuth2(
  config.oauth2Credentials.client_id,
  config.oauth2Credentials.client_secret,
  config.oauth2Credentials.redirect_uris[0]
);

module.exports = oAuth2Client;

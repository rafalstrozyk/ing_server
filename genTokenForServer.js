const config = require('./config');
const fs = require('fs');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const google = require('googleapis').google;
const OAuth2 = google.auth.OAuth2;

const oAuth2Client = new OAuth2(
  config.oauth2Credentials.client_id,
  config.oauth2Credentials.client_secret,
  config.oauth2Credentials.redirect_uris[1]
);


async function authenticate() {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.oauth2Credentials.scopes,
    });
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:3000')
              .searchParams;
            res.end('Authentication successful! Please return to the console.');
            server.destroy();
            const { tokens } = await oAuth2Client.getToken(qs.get('code'));
            oAuth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
            resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, { wait: false }).then((cp) => cp.unref());
      });
    destroyer(server);
  });
}

module.exports = authenticate;

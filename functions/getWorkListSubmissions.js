const google = require('googleapis').google;
const fs = require('fs-extra');
const oAuth2Client = require('../oAuth2');

async function getWorkListSubmissions(courseId, courseWorkId) {
  return new Promise((resolve, reject) => {
    fs.readJSON('./token.json', (err, token) => {
      if (err) reject({ error: 'Token file Error: ' + err });
      oAuth2Client.setCredentials(token.credentials);
      const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });

      classroom.courses.courseWork.studentSubmissions.list(
        {
          courseId,
          courseWorkId,
          states: ['RETURNED'],
        },
        (err, res) => {
          if (err) {
            console.log('The API returned an error: ' + err);
            reject({ error: 'The API returned an error: ' + err });
            return;
          }
          console.log(res.data);
          resolve(res.data);
        }
      );
    });
  });
}

module.exports = getWorkListSubmissions;

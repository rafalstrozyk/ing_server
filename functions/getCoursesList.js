const google = require('googleapis').google;

async function getCoursesList(auth) {
  const classroom = google.classroom({ version: 'v1', auth });
  return new Promise((resolve, reject) => {
    classroom.courses.list((err, res) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        reject({ error: 'The API returned an error: ' + err });
        return;
      }

      resolve(res.data.courses);
    });
  });
}

module.exports = getCoursesList;

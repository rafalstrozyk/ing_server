var express = require('express');
var router = express.Router();
const config = require('../config');
const google = require('googleapis').google;
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');

function listCourses(auth) {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.list(
    {
      pageSize: 10,
    },
    (err, res) => {
      if (err) return console.error('The API returned an error: ' + err);
      const courses = res.data.courses;
      if (courses && courses.length) {
        console.log('Courses:');
        courses.forEach((course) => {
          console.log(`${course.name} (${course.id})`);
        });
      } else {
        console.log('No courses found.');
      }
    }
  );
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const oauth2Client = new OAuth2(
  config.oauth2Credentials.client_id,
  config.oauth2Credentials.client_secret,
  config.oauth2Credentials.redirect_uris[0]
);

router.get('/api/login', function (req, res, next) {
  // const oauth2Client = new OAuth2(
  //   config.oauth2Credentials.client_id,
  //   config.oauth2Credentials.client_secret,
  //   config.oauth2Credentials.redirect_uris[0]
  // );
  const loginLink = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.oauth2Credentials.scopes,
  });
  return res.json({ loginLink: loginLink });
});

router.get('/api/auth_callback', function (req, res) {
  // Create an OAuth2 client object from the credentials in our config file

  console.log(req.query.query);
  if (req.query.error) {
    // The user did not give us permission.
    console.log('error1');
    return res.redirect('/');
  } else {
    oauth2Client.getToken(req.query.query, function (err, token) {
      if (err) {
        console.log('error2');
        return res.redirect('/');
      }

      // Store the credentials given by google into a jsonwebtoken in a cookie called 'jwt'
      console.log('succes');
      res.cookie('jwt', jwt.sign(token, config.JWTsecret));
      console.log(token);
      listCourses(token);
      res.json({ test: 'test' });
      //return res.redirect('/get_some_data');
    });
  }
});

router.get('/api/test_classrom', (req, res) => {
  const decode = jwt.verify(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdG9rZW4iOiJ5YTI5LmEwQVJyZGFNOFdBZGxuRldpM2xvZlU2ZHA2UFp3YVNFLUdTblAyMXUxXzNmMTJYaFNsc2VoMC1XWktCQjdlZkIxTjZTaUhNV1FOaHp5Q21WdmlGZzM4ZjhwMDlUWnVtNzlVN3pJalVzaDNVMGhjc1NmOUZrcHU2NHRXOTNRLXJwdWxmUk9KYmM1NTg3QTlYNVZTeGRoYWM1TWpWWHFhIiwicmVmcmVzaF90b2tlbiI6IjEvLzBjRFFTcDBxbnJodUNDZ1lJQVJBQUdBd1NOd0YtTDlJcnYyNEo1SVFOenpyMl9RTW5SYXNSRWdKQ3JER0lZNkV0TG9QVmVjUjRlaGhfVUhHLTJHdmFuRDljRF9tZ0ZVelV4WXMiLCJzY29wZSI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2xhc3Nyb29tLnByb2ZpbGUucGhvdG9zIGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2xhc3Nyb29tLnN0dWRlbnQtc3VibWlzc2lvbnMubWUucmVhZG9ubHkgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9jbGFzc3Jvb20ucm9zdGVycy5yZWFkb25seSBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2NsYXNzcm9vbS5yb3N0ZXJzIGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2xhc3Nyb29tLmNvdXJzZXdvcmsuc3R1ZGVudHMgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9jbGFzc3Jvb20uY291cnNlcy5yZWFkb25seSBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2NsYXNzcm9vbS5jb3Vyc2V3b3JrLm1lIGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2xhc3Nyb29tLnByb2ZpbGUuZW1haWxzIGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2xhc3Nyb29tLnN0dWRlbnQtc3VibWlzc2lvbnMuc3R1ZGVudHMucmVhZG9ubHkiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiZXhwaXJ5X2RhdGUiOjE2MzMwNzkyMzEyNDksImlhdCI6MTYzMzA3NTYzMn0.ab6zVGskStme55ZsVmPAugoDoreG6t0JAgP2kkKtuU4',
    config.JWTsecret
  );
  
  oauth2Client.setCredentials(decode);
  listCourses(oauth2Client);
  res.render('index', { title: 'Express test' });
});

module.exports = router;

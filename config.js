const config = {
  JWTsecret: process.env.JWT_SECRET,
  oauth2Credentials: {
    client_id: process.env.OAUTH_CLIENT_ID,
    project_id: process.env.OAUTH_PROJECT_ID,
    auth_uri: process.env.OAUTH_AUTH_URI,
    token_uri: process.env.OAUTH_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.OAUTH_PROVIDER,
    client_secret: process.env.OAUTH_SECRET,

    redirect_uris: ['http://localhost:3000/login_waiter'],
    scopes: [
      'https://www.googleapis.com/auth/classroom.courses.readonly',
      'https://www.googleapis.com/auth/classroom.rosters',
      'https://www.googleapis.com/auth/classroom.rosters.readonly',
      'https://www.googleapis.com/auth/classroom.profile.emails',
      'https://www.googleapis.com/auth/classroom.profile.photos',
      'https://www.googleapis.com/auth/classroom.coursework.me',
      'https://www.googleapis.com/auth/classroom.coursework.students',
      'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
      'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
    ],
  },
};

module.exports = config;

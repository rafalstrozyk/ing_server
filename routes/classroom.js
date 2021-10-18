const express = require('express');
const router = express.Router();
const config = require('../config');
const jwt = require('jsonwebtoken');
const google = require('googleapis').google;
const oAuth2Client = require('../oAuth2');

const getCoursesList = (auth, resRouter) => {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.list(
    {
      pageSize: 10,
    },
    (err, res) => {
      if (err) {
        resRouter.json({ error: err });
        console.log(`${err}`.red);
      } else {
        if (res.data.courses && res.data.courses.length) {
          console.log('Success get courses!'.green);
          resRouter.json({
            info: 'Success get courses list!',
            courses: res.data.courses,
          });
        } else {
          console.log('No courses found.'.yellow);
          resRouter.json({ info: 'No courses found' });
        }
      }
    }
  );
};

const getCourse = (auth, resRouter, id) => {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.get({ id }, (err, res) => {
    if (err) {
      resRouter.json({ error: `Bad id or server error: ${err}` });
    } else {
      resRouter.json(res.data);
    }
  });
};

const getCourseStudents = (auth, resRouter, id) => {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.students.list({ courseId: id }, (err, res) => {
    if (err) {
      resRouter.json({ error: `Bad id or server error: ${err}` });
    } else {
      resRouter.json(res.data);
    }
  });
};

const getCourseTeachers = (auth, resRouter, id) => {
  const classroom = google.classroom({ version: 'v1', auth });

  classroom.courses.teachers.list({ courseId: id }, (err, res) => {
    if (err) {
      resRouter.json({ error: `Bad id or server error: ${err}` });
    } else {
      resRouter.json(res.data);
    }
  });
};

const getStudent = (auth, resRouter, ids) => {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.students.get(
    { courseId: ids.courseId, userId: ids.userId },
    (err, res) => {
      if (err) {
        resRouter.json({ error: `Bad id or server error: ${err}` });
      } else {
        resRouter.json(res.data);
      }
    }
  );
};
const getTeacher = (auth, resRouter, ids) => {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.teachers.get(
    { courseId: ids.courseId, userId: ids.userId },
    (err, res) => {
      if (err) {
        resRouter.json({ error: `Bad id or server error: ${err}` });
      } else {
        resRouter.json({ teacher: res.data });
      }
    }
  );
};

const getCourseWorkList = (auth, resRouter, id) => {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.courseWork.list({ courseId: id }, (err, res) => {
    if (err) {
      resRouter.json({ error: `Bad id or server error: ${err}` });
    } else {
      resRouter.json(res.data);
    }
  });
};
const getCourseWorkSubmisionList = (auth, resRouter, ids) => {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.courseWork.studentSubmissions.list(
    { courseId: ids.courseId, courseWorkId: ids.courseWorkId },
    (err, res) => {
      if (err) {
        res.router.json({ error: `Bad id or server error: ${err}` });
      } else {
        resRouter.json(res.data);
      }
    }
  );
};
const getCourseWorkSubmision = (auth, resRouter, ids) => {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.courseWork.studentSubmissions.get(
    { courseId: ids.courseId, courseWorkId: ids.courseWorkId },
    (err, res) => {
      if (err) {
        res.router.json({ error: `Bad id or server error: ${err}` });
      } else {
        resRouter.json({ workSubmision: res.data });
      }
    }
  );
};

const getCourseWork = (auth, resRouter, ids) => {
  const classroom = google.classroom({ version: 'v1', auth });
  classroom.courses.courseWork.get(
    {
      courseId: ids.courseId,
      courseWorkId: ids.workId,
      id: ids.studentSubmission,
    },
    (err, res) => {
      if (err) {
        res.router.json({ error: `Bad id or server error: ${err}` });
      } else {
        resRouter.json({ work: res.data });
      }
    }
  );
};

router.get('/api/courses_list', async (req, res) => {
  if (req.cookies.jwt) {
    const decode = jwt.verify(req.cookies.jwt, config.JWTsecret);
    oAuth2Client.setCredentials(decode);
    await getCoursesList(oAuth2Client, res);
  }
});

router.get('/api/course', (req, res) => {
  if (req.cookies.jwt) {
    if (req.query.course_id) {
      //   try {
      const decode = jwt.verify(req.cookies.jwt, config.JWTsecret);
      oAuth2Client.setCredentials(decode);
      getCourse(oAuth2Client, res, req.query.course_id);
      //   console.log(course);
      // res.json({ course });
      //   } catch {
      //     res.json({ error: 'Bad id or server error' });
      //   }
    } else {
      res.json({ info: 'You need give me course id' });
    }
  } else {
    res.json({ info: 'Log in plis' });
  }
});

router.get('/api/course/students_list', (req, res) => {
  if (req.cookies.jwt) {
    if (req.query.course_id) {
      const decode = jwt.verify(req.cookies.jwt, config.JWTsecret);
      oAuth2Client.setCredentials(decode);
      getCourseStudents(oAuth2Client, res, req.query.course_id);
    } else {
      res.json({ info: 'You need give me course id' });
    }
  } else {
    res.json({ info: 'Log in plis' });
  }
});

router.get('/api/course/student', (req, res) => {
  if (req.coockies.jwt) {
    if (req.query.course_id && req.query.user_id) {
      const decode = jwt.verify(req.coockies.jwt, config.JWTsecret);
      oAuth2Client.setCredentials(decode);
      getStudent(oAuth2Client, res, {
        courseId: req.query.course_id,
        userId: req.query.user_id,
      });
    }
  }
});
router.get('/api/course/teachers_list', (req, res) => {
  if (req.cookies.jwt) {
    if (req.query.course_id) {
      const decode = jwt.verify(req.cookies.jwt, config.JWTsecret);
      oAuth2Client.setCredentials(decode);
      getCourseTeachers(oAuth2Client, res, req.query.course_id);
    } else {
      res.json({ info: 'You need give me course id' });
    }
  } else {
    res.json({ info: 'Log in plis' });
  }
});

router.get('/api/course/student', (req, res) => {
  if (req.coockies.jwt) {
    if (req.query.course_id && req.query.user_id) {
      const decode = jwt.verify(req.coockies.jwt, config.JWTsecret);
      oAuth2Client.setCredentials(decode);
      getTeacher(oAuth2Client, res, {
        courseId: req.query.course_id,
        userId: req.query.user_id,
      });
    }
  }
});

router.get('/api/course/work_list', (req, res) => {
  if (req.cookies.jwt) {
    if (req.query.course_id) {
      const decode = jwt.verify(req.cookies.jwt, config.JWTsecret);
      oAuth2Client.setCredentials(decode);
      getCourseWorkList(oAuth2Client, res, req.query.course_id);
    }
  }
});

router.get('/api/course/work_list_submissions', (req, res) => {
  if (req.cookies.jwt) {
    console.log('something');
    if (req.query.course_id && req.query.course_work_id) {
      const decode = jwt.verify(req.cookies.jwt, config.JWTsecret);
      oAuth2Client.setCredentials(decode);
      getCourseWorkSubmisionList(oAuth2Client, res, {
        courseId: req.query.course_id,
        courseWorkId: req.query.course_work_id,
      });
    }
  }
});

module.exports = router;

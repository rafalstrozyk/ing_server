const express = require('express');
const router = express.Router();
const config = require('../config');
const jwt = require('jsonwebtoken');
const google = require('googleapis').google;
const oAuth2Client = require('../oAuth2');
const getCoursesList = require('../functions/getCoursesList');
const getCourse = require('../functions/getCourse');
const getCourseStudents = require('../functions/getCourseStudents');
const getCourseTeachers = require('../functions/getCourseTeachers');
const getWorkListSubmissions = require('../functions/getWorkListSubmissions');
const getCourseWorkList = require('../functions/getCourseWorkList');
const getUserProfileByServer = require('../functions/getUserProfileByServer');
const getRankOfCourse = require('../functions/getRankOfCourse');
const genRankByScore = require('../functions/genRankByScore');
const sortArrayByObjVal = require('../functions/sortArrayByObjVal');
const createArrayFromObjInArr = require('../functions/createArrayFromObjInArr');

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
  try {
    const decode = jwt.verify(req.cookies.jwt, config.JWTsecret);
    try {
      oAuth2Client.setCredentials(decode);
      const googleCourses = await getCoursesList(oAuth2Client);
      const courses = googleCourses.map((course) => {
        return {
          id: course.id ? course.id : '',
          name: course.name ? course.name : '',
          section: course.section ? course.section : '',
          room: course.room ? course.room : '',
        };
      });

      console.log(courses);
      res.json({ isLogin: true, courses });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log('jwt secret error');
    console.error(err);
    res.json({ isLogin: false });
  }
});

router.get('/api/course', async (req, res) => {
  try {
    const decode = jwt.verify(req.cookies.jwt, config.JWTsecret);
    oAuth2Client.setCredentials(decode);
    try {
      const googleCourse = await getCourse(oAuth2Client, req.query.course_id);
      const course = {
        id: googleCourse.id,
        name: googleCourse.name,
        section: googleCourse.section,
        descriptionHeading: googleCourse.descriptionHeading,
        room: googleCourse.room,
      };
      res.json({ isLogin: true, course });
    } catch (err) {
      console.error(err);
      res.json({ isLogin: true });
    }
  } catch (err) {
    console.error(err);
    res.json({ isLogin: false });
  }
});

router.get('/api/course/students_list', async (req, res) => {
  try {
    jwt.verify(req.cookies.jwt, config.JWTsecret);

    try {
      const googleStudents = await getCourseStudents(req.query.course_id);
      console.log(googleStudents);
      res.json({ isLogin: true, ...googleStudents });
    } catch (err) {
      console.error(err);
      res.json({ isLogin: true });
    }
  } catch (err) {
    res.json({ isLogin: false });
  }
});

// TODO it is not use
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
router.get('/api/course/teachers_list', async (req, res) => {
  try {
    jwt.verify(req.cookies.jwt, config.JWTsecret);

    try {
      const googleTeachers = await getCourseTeachers(req.query.course_id);
      console.log(googleTeachers);
      res.json({ isLogin: true, ...googleTeachers });
    } catch (err) {
      console.error(err);
      res.json({ isLogin: true });
    }
  } catch (err) {
    res.json({ isLogin: false });
  }
});

// TODO it is not use
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

router.get('/api/course/work_list', async (req, res) => {
  try {
    const decode = await jwt.verify(req.cookies.jwt, config.JWTsecret);
    oAuth2Client.setCredentials(decode);
    try {
      const coursesWorkList = await getCourseWorkList(
        oAuth2Client,
        req.query.course_id
      );
      res.json({ ...coursesWorkList });
    } catch (err) {
      console.error(err);
      res.json({ err });
    }
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.get('/api/course/work_list_submissions', async (req, res) => {
  try {
    await jwt.verify(req.cookies.jwt, config.JWTsecret);
    try {
      const googleCourseWorkListSubmissions = await getWorkListSubmissions(
        req.query.course_id,
        req.query.course_work_id
      );
      console.log(`some new ${googleCourseWorkListSubmissions}`);

      // create new array of objects with sorting by assigned grade
      if (googleCourseWorkListSubmissions.studentSubmissions) {
        const courseWorkListSubmissions =
          googleCourseWorkListSubmissions.studentSubmissions
            .map((work) => {
              return {
                id: work.id,
                assignedGrade: work.assignedGrade,
                userId: work.userId,
              };
            })
            .sort((a, b) =>
              a.assignedGrade < b.assignedGrade
                ? 1
                : b.assignedGrade < a.assignedGrade
                ? -1
                : 0
            );
        res.json({ isLogin: true, rank: courseWorkListSubmissions });
      } else {
        res.json({ isLogin: true, rank: [] });
      }
    } catch (err) {
      console.error(err);
      res.json({ isLogin: true });
    }
  } catch (err) {
    res.json({ isLogin: false });
  }
});

router.get('/api/course/full_rank', async (req, res) => {
  try {
    const decode = await jwt.verify(req.cookies.jwt, config.JWTsecret);
    oAuth2Client.setCredentials(decode);
    try {
      const rankOfCourse = await getRankOfCourse(
        oAuth2Client,
        req.query.course_id
      );
      const sortedRank = sortArrayByObjVal(
        genRankByScore(
          sortArrayByObjVal(createArrayFromObjInArr(rankOfCourse), 'userId')
        ),
        'mean'
      ).reverse();

      res.json(sortedRank);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
    res.json({ isLogin: false });
  }
});

module.exports = router;

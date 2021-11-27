const getCourseWorkList = require('./getCourseWorkList');
const getWorkListSubmissions = require('./getWorkListSubmissions');

function getRankOfCourse(auth, courseId) {
  return new Promise(async (resolve, rejest) => {
    try {
      const courseWorkList = await getCourseWorkList(auth, courseId);
      const courseWork = courseWorkList.courseWork;

      resolve(
        await Promise.all(courseWork.map(async (work) => {
          const workListSubmissions = await getWorkListSubmissions(
            courseId,
            work.id
          );
          return {
            ...workListSubmissions.studentSubmissions,
          };
        }))
      );
    } catch (err) {
      reject({ error: 'The API returned an error: ' + err });
    }
  });
}

module.exports = getRankOfCourse;

const UserScores = require('../Classes/UserScores');

function genRankByScore(array) {
  const newArray = [];
  let userDataScore = [];
  userDataScore.push(array.shift());
  while (array.length > 0) {
    if (array.length > 1) {
      if (array[0].userId !== userDataScore[0].userId) {
        newArray.push(new UserScores(userDataScore).getObj());
        userDataScore = [];
        userDataScore.push(array.shift());
      } else {
        userDataScore.push(array.shift());
      }
    } else {
      if (userDataScore[0].userId !== array[0].userId) {
        newArray.push(new UserScores(userDataScore).getObj());
        userDataScore = [];
        userDataScore.push(array.shift());
      } else {
        userDataScore.push(array.shift());
        newArray.push(new UserScores(userDataScore).getObj());
      }
    }
  }

  return newArray;
}

module.exports = genRankByScore;

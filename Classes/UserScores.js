class UserScores {
  constructor(array) {
    this.userId = array[0].userId;
    this.courseId = array[0].courseId;
    this.id = array[0].id;
    this.courseWorkId = array[0].courseWorkId;
    this.scoreArray = array.map((item) => item.assignedGrade);
  }

  getMean() {
    return this.scoreArray.reduce((a, b) => a + b, 0) / this.scoreArray.length;
  }

  getObj() {
    return {
      userId: this.userId,
      courseId: this.courseId,
      id: this.id,
      courseId: this.courseId,
      scoreArray: this.scoreArray,
      mean: this.getMean(),
    };
  }
}

module.exports = UserScores;

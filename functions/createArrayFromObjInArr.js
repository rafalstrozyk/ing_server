function createArrayFromObjInArr(array) {
  const newArray = [];
  const arrayOfObj = array.map((item) => {
    return Object.values(item);
  });
  arrayOfObj.forEach((item) => newArray.push(...item));
  return newArray;
}

module.exports = createArrayFromObjInArr;

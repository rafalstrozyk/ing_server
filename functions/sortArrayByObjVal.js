function sortArrayByObjVal(array, val) {
  console.log(val);
  return array.sort((a, b) => {
    return a[val] - b[val];
  });
}

module.exports = sortArrayByObjVal;

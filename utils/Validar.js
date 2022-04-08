module.exports.ifelse = (param1, param2) => {
  console.log(param1, param2)
  return (param1 ? param1 : (param2 ? param2 : ""))
}

module.exports.getValueArray = (array, pos) => {
  return (array ? array[pos] : "")
}
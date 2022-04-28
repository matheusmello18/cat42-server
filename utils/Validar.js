module.exports.isArray = (param) => {
  return Array.isArray(param);
}

module.exports.ifelse = (param1, param2, valueDefault = "") => {
  return (param1 ? param1 : (param2 ? param2 : valueDefault))
}

module.exports.getValueArray = (array, pos, valueDefault = "") => {
  return (this.isArray(array) ? (array[pos] == undefined ? valueDefault : array[pos]) : valueDefault)
}
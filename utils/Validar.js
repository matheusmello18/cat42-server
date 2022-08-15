/**
 * Verifica se o parametro é um array
 * @param {any} param 
 * @returns {boolean}
 */
module.exports.isArray = (param) => {
  return Array.isArray(param);
}

/**
 * Valida o primeiro parametro de tem alguma coisa, senão o segundo parametro senão o valor default
 * @param {any} param1 Se não undefined então param1
 * @param {any} param2 Senão undefined então param2
 * @param {String} valueDefault Senão o valueDefault
 * @returns {any|string} Pode retornar o param1 ou param2 ou valueDefault
 */
module.exports.ifelse = (param1, param2, valueDefault = "") => {
  return (param1 ? param1 : (param2 ? param2 : valueDefault))
}

/**
 * Verifica se a variavél é um array se for retorna a posição que foi passada, senão retorna o valueDefault
 * @param {Array} array 
 * @param {number} pos 
 * @param {String} valueDefault 
 * @returns {any|String}
 */
module.exports.getValueArray = (array, pos, valueDefault = "") => {
  try {
    return (this.isArray(array) ? (array[pos] == undefined ? valueDefault : array[pos]) : valueDefault)
  } catch (error) {
    return valueDefault;
  }
}
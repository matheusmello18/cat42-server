/**
 * Modulo Ac331
 * 
 * @module model/Ac331
 * @example
 * const model = require('./model');
 */

const Oracle = require('../Oracle');

/**
 * Classe de Municipio
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const municipio = new model.Ac331.Municipio();
 */
var Municipio = function(){
  if(!(this instanceof Municipio))
    return new Municipio();
};

/**
 * Função busca os dados do Município através do código do municipio
 * 
 * @param {string} cd_municipio Código do Municipio
 * @returns {Promise} Promise
 * @example
 * const rows = (await municipio.select('3534302')).rows;
 * 
 * ou
 *
 * const rows = await municipio.select('3534302').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
Municipio.prototype.select = async (cd_municipio) => {
  try {
    return await Oracle.select(
      `SELECT ID_REF_331_MUNICIPIO,
              DS_MUNICIPIO,
              UF_MUNICIPIO,
              CD_MUNICIPIO
        FROM AC_331_MUNICIPIO
        WHERE CD_MUNICIPIO = :param1`,
        {param1: parseInt(cd_municipio)}
      );
  
  } catch (err) {
    throw new Error(err);
  }
}
module.exports.Municipio = Municipio;

/**
 * Classe de Pais
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const pais = new model.Ac331.Pais();
 */
 var Pais = function(){
  if (!(this instanceof Pais))
    return new Pais();
};

/**
 * Função busca os dados do País através do código do país
 * 
 * @param {string} cd_pais Código do País
 * @return {Promise} Promise
 * 
 * @example
 * const rows = (await pais.select('01058')).rows;
 * 
 * ou
 *
 * const rows = await pais.select('01058').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */

Pais.prototype.select = async (cd_pais) => {
  try {
    return await Oracle.select(
      `SELECT ID_REF_331_PAIS,
              CD_PAIS,
              DS_PAIS
        FROM AC_331_PAIS
       WHERE TO_NUMBER(CD_PAIS) = TO_NUMBER(:param1)`,
      {param1: cd_pais});
  } catch (err) {
    throw new Error(err);
  }
}
module.exports.Pais = Pais;
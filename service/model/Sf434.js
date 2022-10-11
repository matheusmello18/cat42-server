/**
 * Modulo Sf434
 * 
 * @module model/Sf434
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de Sf434
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const Sf434 = new model.Sf434();
  */
 var Sf434 = function(){
   if(!(this instanceof Sf434))
     return new Sf434();
 };

/**
 * Função buscar os dados do Sf434 por código
 * 
 * @param {string} cd_codigo
 * @returns {Promise} Promise
 * @example
 * const rows = (await Sf434.selectByCodigo('05')).rows;
 * 
 * ou
 *
 * const rows = await Sf434.selectByCodigo('05').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw err
 * })
 */
Sf434.prototype.selectByCodigo = async (cd_codigo) => {
    let sql = `select id_ref_434, cd_434, ds_434
    from sf_434
   where cd_434 = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw err
  }
}

module.exports.Sf434 = Sf434;
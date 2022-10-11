/**
 * Modulo Sf433
 * 
 * @module model/Sf433
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de Sf433
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const Sf433 = new model.Sf433();
  */
 var Sf433 = function(){
   if(!(this instanceof Sf433))
     return new Sf433();
 };
  
  /**
   * Função buscar os dados do Sf433 por código 
   * 
   * @param {string} cd_codigo
   * @returns {Promise} Promise
   * @example
   * const rows = (await Sf433.selectByCodigo('05')).rows;
   * 
   * ou
   *
   * const rows = await Sf433.selectByCodigo('05').then((e) => {
   *    return e.rows;
   * }).catch((err) => {
   *    throw err
   * })
   */
  
  Sf433.prototype.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_433, cd_433, ds_433
               from sf_433
              where cd_433 = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw err
  }
}

module.exports.Sf433 = Sf433;
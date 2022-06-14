/**
 * Modulo Sf453
 * 
 * @module model/Sf453
 * @example
 * const model = require('./model');
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de Sf453
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const Sf453 = new model.Sf453();
  */
 var Sf453 = function(){
   if(!(this instanceof Sf453))
     return new Sf453();
 };
  
/**
 * Função buscar os dados do Sf453 por código
 * 
 * @param {string} cd_codigo
 * @returns {Promise} Promise
 * @example
 * const rows = (await Sf453.selectByCodigo('152')).rows;
 * 
 * ou
 *
 * const rows = await Sf453.selectByCodigo('152').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */  
Sf453.prototype.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_453, cd_453, ds_453, ds_grupo_cst
               from sf_453
              where cd_453 = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Sf453 = Sf453;
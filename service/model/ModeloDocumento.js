/**
 * Modulo ModeloDocumento
 * 
 * @module model/ModeloDocumento
 * @example
 * const model = require('./model');
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de ModeloDocumento
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const ModeloDocumento = new model.ModeloDocumento();
  */
 var ModeloDocumento = function(){
   if(!(this instanceof ModeloDocumento))
     return new ModeloDocumento();
 };
  
  /**
   * Função buscar os dados do ModeloDocumento por código modelo documetno
   * 
   * @param {string} cd_modelo_documento
   * @returns {Promise} Promise
   * @example
   * const rows = (await ModeloDocumento.selectByCdModeloDocumento('55')).rows;
   * 
   * ou
   *
   * const rows = await ModeloDocumento.selectByCdModeloDocumento('55').then((e) => {
   *    return e.rows;
   * }).catch((err) => {
   *    throw new Error(err.message)
   * })
   */
  
  ModeloDocumento.prototype.selectByCdModeloDocumento = async (cd_modelo_documento) => {
  let sql = `select id_modelo_documento, cd_modelo_documento, ds_modelo_documento, ds_sigla, ds_modelo 
               from in_modelo_documento
              where cd_modelo_documento = :cd_modelo_documento`;
  try {
    return await Oracle.select(sql, {cd_modelo_documento: cd_modelo_documento})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.ModeloDocumento = ModeloDocumento;
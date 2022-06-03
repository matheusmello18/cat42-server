/**
 * Modulo ModeloDocumento
 * 
 * @module model/ModeloDocumento
 * @license [MIT] {@link http://https://github.com/PainelFsical/master/LICENSE}
 * @copyright (c) 2008-2022 Painel Fiscal
 * @since 1.0
 * @see http://www.painelfiscal.com.br/
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de ModeloDocumento
  * 
  * @constructor
  */
 var ModeloDocumento = function(){
   if(!(this instanceof ModeloDocumento))
     return new ModeloDocumento();
 };
  
  /**
   * Função buscar os dados do ModeloDocumento por código modelo documetno
   * 
   * @param {string} cd_modelo_documento
   * @returns {Promise} Promrise<Result<T>>
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
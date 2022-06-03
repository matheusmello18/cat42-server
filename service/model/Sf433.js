/**
 * Modulo Sf433
 * 
 * @module model/Sf433
 * @license [MIT] {@link http://https://github.com/PainelFsical/master/LICENSE}
 * @copyright (c) 2008-2022 Painel Fiscal
 * @since 1.0
 * @see http://www.painelfiscal.com.br/
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de Sf433
  * 
  * @constructor
  */
 var Sf433 = function(){
   if(!(this instanceof Sf433))
     return new Sf433();
 };
  
  /**
   * Função buscar os dados do Sf433  por código modelo documetno
   * 
   * @param {string} cd_codigo
   * @returns {Promise} Promrise<Result<T>>
   */
  
  Sf433.prototype.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_433, cd_433, ds_433
               from sf_433
              where cd_433 = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Sf433 = Sf433;
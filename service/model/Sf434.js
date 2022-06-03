/**
 * Modulo Sf434
 * 
 * @module model/Sf434
 * @license [MIT] {@link http://https://github.com/PainelFsical/master/LICENSE}
 * @copyright (c) 2008-2022 Painel Fiscal
 * @since 1.0
 * @see http://www.painelfiscal.com.br/
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de Sf434
  * 
  * @constructor
  */
 var Sf434 = function(){
   if(!(this instanceof Sf434))
     return new Sf434();
 };
  
  /**
   * Função buscar os dados do Sf434 por código
   * 
   * @param {string} cd_codigo
   * @returns {Promise} Promrise<Result<T>>
   */
  
Sf434.prototype.selectByCodigo = async (cd_codigo) => {
    let sql = `select id_ref_434, cd_434, ds_434
    from sf_434
   where cd_434 = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Sf434 = Sf434;
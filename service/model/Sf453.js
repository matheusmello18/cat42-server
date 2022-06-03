/**
 * Modulo Sf453
 * 
 * @module model/Sf453
 * @license [MIT] {@link http://https://github.com/PainelFsical/master/LICENSE}
 * @copyright (c) 2008-2022 Painel Fiscal
 * @since 1.0
 * @see http://www.painelfiscal.com.br/
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de Sf453
  * 
  * @constructor
  */
 var Sf453 = function(){
   if(!(this instanceof Sf453))
     return new Sf453();
 };
  
  /**
   * Função buscar os dados do Sf453 por código modelo documetno
   * 
   * @param {string} cd_codigo
   * @returns {Promise} Promrise<Result<T>>
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
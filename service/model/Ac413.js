/**
 * Modulo Ac413
 * 
 * @module model/Ac413
 * @license [MIT] {@link http://https://github.com/PainelFsical/master/LICENSE}
 * @copyright (c) 2008-2022 Painel Fiscal
 * @since 1.0
 * @see http://www.painelfiscal.com.br/
 */

const Oracle = require('../Oracle');

/**
 * Classe de Ac413
 * 
 * @constructor
 */
 var Ac413 = function(){
  if(!(this instanceof Ac413))
    return new Ac413();
};

/**
 * Função busca os dados do Ac413 por código
 * 
 * @param {string} cd_codigo Código 413
 * @returns {Promise} Promrise<Result<T>>
 */

Ac413.prototype.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_413, cd_codigo, ds_descricao
               from ac_413
              where cd_codigo = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Ac413 = Ac413;
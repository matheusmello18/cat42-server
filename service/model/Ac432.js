/**
 * Modulo Ac432
 * 
 * @module model/Ac432
 */

const Oracle = require('../Oracle');

/**
 * Classe de Ac432
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const ac432 = new model.Ac432();
 */
 var Ac432 = function(){
  if(!(this instanceof Ac432))
    return new Ac432();
};

/**
 * Função busca os dados do Ac432 por código
 * 
 * @param {string} cd_codigo Código 432
 * @returns {Promise} Promise
 * @example
 * const rows = (await Ac432.selectByCodigo('560')).rows;
 * 
 * ou
 *
 * const rows = await Ac432.selectByCodigo('560').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */

 Ac432.prototype.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_432, cd_codigo, ds_descricao
               from ac_432
              where cd_codigo = trim(:cd_codigo)`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Ac432 = Ac432;
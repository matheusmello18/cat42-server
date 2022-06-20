/**
 * Modulo Ac431
 * 
 * @module model/Ac431
 */

const Oracle = require('../Oracle');

/**
 * Classe de Ac431
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const ac431 = new model.Ac431();
 */
 var Ac431 = function(){
  if(!(this instanceof Ac431))
    return new Ac431();
};

/**
 * Função busca os dados do Ac431 por código
 * 
 * @param {string} cd_codigo Código 431
 * @returns {Promise} Promise
 * @example
 * const rows = (await Ac431.selectByCodigo('560')).rows;
 * 
 * ou
 *
 * const rows = await Ac431.selectByCodigo('560').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */

 Ac431.prototype.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_431, cd_strib, ds_strib
               from ac_431
              where cd_strib = trim(:cd_codigo)`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Ac431 = Ac431;
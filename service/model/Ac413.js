/**
 * Modulo Ac413
 * 
 * @module model/Ac413
 */

const Oracle = require('../Oracle');

/**
 * Classe de Ac413
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const ac413 = new model.Ac413();
 */
var Ac413 = function() {
  if(!(this instanceof Ac413))
    return new Ac413();
};

/**
 * Função busca os dados do Ac413 por código
 * 
 * @param {string} cd_codigo Código 413
 * @returns {Promise} Promise
 * @example
 * const rows = (await ac413.selectByCodigo('09')).rows;
 * 
 * ou
 *
 * const rows = await ac413.selectByCodigo('09').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
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
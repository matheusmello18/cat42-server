/**
 * Modulo SfCest
 * 
 * @module model/SfCest
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de SfCest
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const SfCest = new model.SfCest();
  */
 var SfCest = function(){
   if(!(this instanceof SfCest))
     return new SfCest();
 };
  
  /**
   * Função buscar os dados do SfCest por código 
   * 
   * @param {string} cd_cest
   * @param {string} dt_movimento
   * @returns {Promise} Promise
   * @example
   * const rows = (await SfCest.selectByCodigo('05.005', '01/08/2019')).rows;
   * 
   * ou
   *
   * const rows = await SfCest.selectByCodigo('05.005', '01/08/2019').then((e) => {
   *    return e.rows;
   * }).catch((err) => {
   *    throw err
   * })
   */
  
SfCest.prototype.selectByCodigo = async (cd_cest, dt_movimento) => {
  let sql = `select id_cest, cd_cest, ds_cest
               from sf_cest
              where dt_inicial = (select max(dt_inicial)
                       from sf_cest
                      where to_char(dt_inicial,'dd/mm/yyyy') <= :dt_movimento
                        and (to_char(dt_final,'dd/mm/yyyy') >= :dt_movimento or dt_final is null)
                        and replace(cd_cest,'.','') = :cd_cest)
                and replace(cd_cest,'.','') = :cd_cest`;
  try {
    return await Oracle.select(sql, {cd_cest: cd_cest, dt_movimento: dt_movimento})
  } catch (err) {
    throw err
  }
}

module.exports.SfCest = SfCest;
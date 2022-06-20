/**
 * Modulo CFOP
 * 
 * @module model/Cfop
 */
 const Oracle = require('../Oracle');

/**
 * Classe de CFOP
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const CFOP = new model.CFOP();
 */
var CFOP = function(){
  if(!(this instanceof CFOP))
    return new CFOP();
};

/**
 * Função busca configuração do CFOP pelo seu código
 * 
 * @param {string} cd_cfop
 * @returns {Promise} Promise
 * @example
 * const rows = (await CFOP.selectByCdCfop('5991')).rows;
 * 
 * ou
 *
 * const rows = await CFOP.selectByCdCfop('5991').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
  
CFOP.prototype.selectByCdCfop = async (cd_cfop) => {
  let sql = `select nvl(dm_icms_vl_contabil,    'N') dm_icms_vl_contabil, 
                    nvl(dm_vlcontabil_piscofins,'N') dm_vlcontabil_piscofins, 
                    nvl(dm_vlcontabil_ii,       'N') dm_vlcontabil_ii 
               from in_cfop 
              where ((cd_cfop_uf        = :cd_cfop) 
                 or  (cd_cfop_demais_uf = :cd_cfop) 
                 or  (cd_cfop_pais      = :cd_cfop))`;
  try {
    return await Oracle.select(sql, {cd_cfop: cd_cfop})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.CFOP = CFOP;
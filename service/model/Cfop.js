/**
 * Modulo CFOP
 * 
 * @module model/Cfop
 * @license [MIT] {@link http://https://github.com/PainelFsical/master/LICENSE}
 * @copyright (c) 2008-2022 Painel Fiscal
 * @since 1.0
 * @see http://www.painelfiscal.com.br/
 */
 const Oracle = require('../Oracle');

/**
 * Classe de CFOP
 * 
 * @constructor
 */
var CFOP = function(){
  if(!(this instanceof CFOP))
    return new CFOP();
};

/**
 * Função busca configuração do CFOP pelo seu código
 * 
 * @param {string} cd_cfop
 * @returns {Promise} Promrise<Result<T>>
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
    return await Oracle.select(sql, cd_cfop)
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.CFOP = CFOP;
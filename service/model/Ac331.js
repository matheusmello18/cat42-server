const Oracle = require('../Oracle');

/**
 * 
 * @class municipio - desenvolvido para instruções do banco de dados
 * @function [select|insert] 
 * 
 */

module.exports.municipio = {
  /**
   * Função busca os dados do Município através do código do municipio
   * @param {string} cd_municipio Código do Municipio
   * 
   */
  select: async (cd_municipio) => {
    try {
      let params;
  
      params = {
        param1: parseInt(cd_municipio),
      };
  
      return await Oracle.select(
        `SELECT ID_REF_331_MUNICIPIO,
                DS_MUNICIPIO,
                UF_MUNICIPIO,
                CD_MUNICIPIO
          FROM AC_331_MUNICIPIO
          WHERE CD_MUNICIPIO = :param1`,
        params);
    
    } catch (err) {
      throw new Error(err);
    }
  }
}

/**
 * 
 * @class pais - desenvolvido para instruções do banco de dados
 * @function [select|insert] 
 * 
 */
module.exports.pais = {
  /**
   * Função busca os dados do País através do código do país
   * @param {string} cd_pais Código do País
   * 
   */
  select: async (cd_pais) => {
    try {
      let params;
  
      params = {
        param1: cd_pais,
      };
  
      return await Oracle.select(
        `SELECT ID_REF_331_PAIS,
                CD_PAIS,
                DS_PAIS
          FROM AC_331_PAIS
         WHERE TO_NUMBER(CD_PAIS) = TO_NUMBER(:param1)`,
        params);
    
    } catch (err) {
      throw new Error(err);
    }
  }
}





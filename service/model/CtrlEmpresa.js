/**
 * Modulo CtrlEmpresa
 * 
 * @module model/CtrlEmpresa
 */

const Oracle = require('../Oracle');

/**
 * Classe de CtrlEmpresa
 * 
 * @constructor
 */
var CtrlEmpresa = function(){
  if(!(this instanceof CtrlEmpresa))
    return new CtrlEmpresa();
};

/**
 * Função buscar os dados da CtrlEmpresa 
 * 
 * @param {number} id_empresa
 * @returns {Promise} Promrise<Result<T>>
 */
 CtrlEmpresa.prototype.select = async (id_empresa) => {
  const sql = `SELECT ID_EMPRESA, 
                      NM_FANTASIA, 
                      NM_EMPRESA, 
                      INSCR_EMPRESA, 
                      REPLACE(REPLACE(REPLACE(CNPJ_EMPRESA,'.',''),'/',''),'-','') CNPJ_EMPRESA
                 FROM CTRL_EMPRESA 
                WHERE ID_EMPRESA = :ID_EMPRESA`;

  try {
    let params;

    params = {
      ID_EMPRESA: id_empresa,
    };

    return await Oracle.select(sql, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.CtrlEmpresa = CtrlEmpresa
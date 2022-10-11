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
 * @example
 * const model = require('./model');
 * const CtrlEmpresa = new model.CtrlEmpresa();
 */
var CtrlEmpresa = function(){
  if(!(this instanceof CtrlEmpresa))
    return new CtrlEmpresa();
};

/**
 * Função buscar os dados da CtrlEmpresa por identificador
 * 
 * @param {number} id_empresa
 * @returns {Promise} Promise
 * @example
 * const rows = (await CtrlEmpresa.select(1)).rows;
 * 
 * ou
 *
 * const rows = await CtrlEmpresa.select(1).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw err
 * })
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
    throw err
  }
}

module.exports.CtrlEmpresa = CtrlEmpresa
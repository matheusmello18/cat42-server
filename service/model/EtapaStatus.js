/**
 * Modulo EtapaStatus
 * 
 * @module model/EtapaStatus
 * @example
 * const model = require('./model');
 */

const Oracle = require('../Oracle');

/**
 * Classe de EtapaStatus
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const EtapaStatus = new model.EtapaStatus();
 */
var EtapaStatus = function(){
	if(!(this instanceof EtapaStatus))
		return new EtapaStatus();
};


/**
 * Função para selecionar
 * 
 * @param {number} id_empresa Código da Empresa
 * @param {number} id_usuario Código do Usuário
 * @param {number} id_simul_etapa Identificador da Etapa
 * @example
 * const rows = (await EtapaStatus.select(1, 1, 2)).rows;
 * 
 * ou
 *
 * const rows = await EtapaStatus.select(1, 1, 2).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
EtapaStatus.prototype.select = async (id_empresa, id_usuario, id_simul_etapa) => {
  const sql = `
    SELECT S.ID_SIMUL_STATUS,
          to_char(S.DT_PERIODO, 'dd/mm/yyyy') DT_PERIODO,
          T.ID_SIMUL_TP_STATUS,
          T.CD_STATUS,
          T.DS_STATUS,
          S.DS_STATUS DS_STATUS_LOG,
          S.ID_SIMUL_ETAPA,
          S.ID_EMPRESA,
          S.ID_USUARIO,
          TO_CHAR(S.DT_STATUS, 'DD/MM/YYYY HH24:MI:SS') DT_STATUS
      FROM SIMUL_ETAPA_STATUS S 
    INNER JOIN SIMUL_TIPO_STATUS T ON S.ID_SIMUL_TP_STATUS = T.ID_SIMUL_TP_STATUS
    WHERE S.ID_SIMUL_ETAPA = :id_simul_etapa
      AND S.ID_EMPRESA     = :id_empresa
      AND S.ID_USUARIO     = :id_usuario
    ORDER BY S.ID_SIMUL_STATUS DESC
    `;

  try {
    let params;

    params = {
      id_simul_etapa: id_simul_etapa,
      id_empresa: id_empresa,
      id_usuario: id_usuario,
    };

    return await Oracle.select(sql, params);
  
  } catch (err) {
    throw new Error(err);
  }
}


/**
 * Função para inserir status da etapa 
 * 
 * @param {string} dt_periodo Data do Período - mascara dd/mm/yyyy
 * @param {number} id_simul_tp_status Status => 1-SUCESSO / 2-ERRO / 3-PENDENCIA
 * @param {number} id_simul_etapa Identificador da Etapa
 * @param {number} id_empresa Código da Empresa
 * @param {number} id_usuario Código do Usuário
 * @param {string} ds_status Descrição do erro
 * @exemplo
 * await EtapaStatus.insert('01/08/2022', 1, 1, 1, 1 , 'teste');
 * 
 * ou
 *
 * const data = await EtapaStatus.insert('01/08/2022', 1, 1, 1, 1 , 'teste').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
EtapaStatus.prototype.insert = async (dt_periodo,id_simul_tp_status,id_simul_etapa,id_empresa,id_usuario,ds_status) => {
  const sqlInsert = `insert into simul_etapa_status (id_simul_status,dt_periodo,id_simul_tp_status,id_simul_etapa,id_empresa,id_usuario,ds_status,dt_status)
  values (:id_simul_status,:dt_periodo,:id_simul_tp_status,:id_simul_etapa,:id_empresa,:id_usuario,:ds_status,:dt_status)`;
  
  const nProx_Codigo = await Oracle.proxCod("SIMUL_ETAPA_STATUS");
  try {
    let params = {
      id_simul_status: nProx_Codigo,
      dt_periodo:  { type: Oracle.oracledb.DATE, val: new Date(dt_periodo)},
      id_simul_tp_status: id_simul_tp_status,
      id_simul_etapa: id_simul_etapa,
      id_empresa: id_empresa,
      id_usuario: id_usuario,
      ds_status: ds_status,
      dt_status: { type: Oracle.oracledb.DATE, val: new Date() }
    };

    await Oracle.insert(sqlInsert, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.EtapaStatus = EtapaStatus;
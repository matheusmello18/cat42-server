/**
 * Modulo EtapaStatusLog
 * 
 * @module model/EtapaStatusLog
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de EtapaStatusLog
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const EtapaStatusLog = new model.EtapaStatusLog();
  */
 var EtapaStatusLog = function(){
   if(!(this instanceof EtapaStatusLog))
     return new EtapaStatusLog();
 };

 /**
 * Função para inserir status da etapa log
 * 
 * @param {number} id_simul_status Identificador da Etapa Status
 * @param {number} id_empresa Código da Empresa
 * @param {number} id_usuario Código do Usuário
 * @param {string} ds_status Descrição do erro
 * @exemplo
 * await EtapaStatusLog.insert(1, 1, 1 , 'teste');
 * 
 * ou
 *
 * const data = await EtapaStatusLog.insert(1, 1, 1 , 'teste').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
EtapaStatusLog.prototype.insert = async (id_simul_status, id_empresa, id_usuario, ds_status) => {
  const sqlMax = `select max(nr_item) nr_item from SIMUL_STATUS_LOG where id_simul_status = :id_simul_status`;

  const sqlInsert = `insert into SIMUL_STATUS_LOG (id_simul_status, nr_item, dt_log, ds_tarefa, id_empresa, id_usuario)
  values (:id_simul_status, :nr_item, :dt_log, :ds_tarefa, :id_empresa, :id_usuario)`;
  
  let statusLog = await Oracle.select(sqlMax, {
    id_simul_status: id_simul_status
  }).then((data) => {
    return data.rows[0]
  }).catch((erro) => {
    throw new Error(erro.message);
  })
  
  let nr_item = statusLog.NR_ITEM == null ? 1 : 1 + parseInt(statusLog.NR_ITEM);

  try {
    await Oracle.insert(sqlInsert, {
      id_simul_status: id_simul_status,
      nr_item: nr_item,
      dt_log: { type: Oracle.oracledb.DATE, val: new Date() },
      ds_tarefa: ds_status,
      id_empresa: id_empresa,
      id_usuario: id_usuario,
    });
  
  } catch (err) {
    throw new Error(err);
  }

}

/**
 * Função para selecionar etapas da empresa
 * 
 * @param {number} id_simul_status Id da Etapa do Simulador Status
 * @example
 * const rows = (await EtapaStatusLog.select(3)).rows;
 * 
 * ou
 *
 * const rows = await EtapaStatusLog.select(3).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
EtapaStatusLog.prototype.select = async (id_simul_status) => {
  const sql = `
  select id_simul_status, 
         nr_item, 
         to_char(dt_log, 'dd/mm/yyyy') dt_log,
         ds_tarefa,
         id_empresa, 
         id_usuario
    from simul_status_log
    where id_simul_status = :id_simul_status
    order by nr_item desc
    `;

  try {
    let params;

    params = {
      id_simul_status: id_simul_status
    };

    return await Oracle.select(sql, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.EtapaStatusLog = EtapaStatusLog;
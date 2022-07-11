/**
 * Modulo EtapaStatus
 * 
 * @module model/EtapaStatus
 */

const Oracle = require('../Oracle');
const EtapaStatusLog = require('./EtapaStatusLog').EtapaStatusLog;
const EtapaProdutoStatus = require('./EtapaProdutoStatus').EtapaProdutoStatus;

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
 * Função para selecionar etapas da empresa
 * 
 * @param {number} id_empresa Código da Empresa
 * @param {number} id_usuario Código do Usuário
 * @param {string} dt_periodo data do periodo informado
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

EtapaStatus.prototype.select = async (id_empresa, id_usuario, dt_periodo, id_simul_etapa = null) => {
  const sql = `
       select es.id_simul_status,
              to_char(es.dt_periodo, 'dd/mm/yyyy') dt_periodo,
              es.id_simul_tp_status,
              s.cd_status,
              s.ds_status,
              e.id_simul_etapa,
              e.cd_etapa,
              e.ds_etapa,
              e.nm_procedure1,
              e.nm_procedure2,
              to_char(e.dt_inicial, 'dd/mm/yyyy') dt_inicial,
              to_char(e.dt_final, 'dd/mm/yyyy') dt_final,
              e.id_orgao,
              e.dm_sequencia,
              e.dm_acao_arquivo,
              e.ds_acao,
              es.id_empresa,
              e.nm_method,
              to_char(es.dt_status, 'dd/mm/yyyy') dt_status,
              e.dm_lista_prod             
      from simul_etapa e
      left join simul_etapa_status es on es.id_simul_etapa = e.id_simul_etapa
      left join simul_tipo_status s   on es.id_simul_tp_status = s.id_simul_tp_status
      where nvl(es.id_empresa,:id_empresa) = :id_empresa
      and nvl(es.id_usuario,:id_usuario) = :id_usuario
      and nvl(es.dt_periodo, to_date(:dt_periodo,'dd/mm/yyyy')) = to_date(:dt_periodo,'dd/mm/yyyy')
    `;

    try {
      let params;
  
      params = {
        id_empresa: id_empresa,
        id_usuario: id_usuario,
        dt_periodo: dt_periodo,
      };

      let sqlNova = sql;
      if (id_simul_etapa !== null){
        sqlNova = sql + ' and es.id_simul_etapa = :id_simul_etapa'
        params = {
          ...params,
          id_simul_etapa: id_simul_etapa,
        }
      } 
    
      return await Oracle.select(sqlNova, params)
      .then(async (data) => {
        for (let index = 0; index < data.rows.length; index++) {
          const row = data.rows[index];

          // logs
          const logs = await new EtapaStatusLog().select(row.ID_SIMUL_STATUS).then((data) => {
            return data.rows;
          });

          data.rows[index].STATUS = logs;

          // produto
          if (row.DM_LISTA_PROD == 'S'){
            const prods = await new EtapaProdutoStatus().select(row.ID_SIMUL_ETAPA, id_empresa, id_usuario).then((data) => {
              return data.rows;
            });
            data.rows[index].PRODS = prods;
          }
        }
        return data;
      })

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
  const sqlSelect = `select id_simul_status, dt_periodo, id_simul_tp_status, id_simul_etapa, id_empresa, id_usuario, ds_status, dt_status 
                       from simul_etapa_status 
                      where id_simul_etapa = :id_simul_etapa
                        and id_empresa = :id_empresa 
                        and id_usuario = :id_usuario`;

  const sqlUpdate = `update simul_etapa_status 
                        set id_simul_tp_status = :id_simul_tp_status
                          , ds_status = :ds_status
                      where id_simul_status = :id_simul_status`;

  const sqlInsert = `insert into simul_etapa_status (id_simul_status,dt_periodo,id_simul_tp_status,id_simul_etapa,id_empresa,id_usuario,ds_status,dt_status)
  values (:id_simul_status,:dt_periodo,:id_simul_tp_status,:id_simul_etapa,:id_empresa,:id_usuario,:ds_status,:dt_status)`;
  
  var etapastatus = await Oracle.select(sqlSelect, {
    id_simul_etapa: id_simul_etapa,
    id_empresa: id_empresa,
    id_usuario: id_usuario,
  }).then((data) => {
    return data.rows[0];
  }).catch((err) => {
    throw new Error(err);
  });

  var msg = id_simul_tp_status === 1 ? "Importaçao realizada com sucesso." : (id_simul_tp_status === 2 ? "Importação realizada com advertência." : (id_simul_tp_status === 3 ? "Importação realizada com erro." : ""));

  if (etapastatus != undefined){
    await Oracle.update(sqlUpdate, {
      id_simul_status: etapastatus.ID_SIMUL_STATUS,
      ds_status: msg,
      id_simul_tp_status: id_simul_tp_status,
    }).catch((err) => {
      throw new Error(err);
    });

    await new EtapaStatusLog().insert(etapastatus.ID_SIMUL_STATUS, id_empresa, id_usuario, ds_status);

    return etapastatus.ID_SIMUL_STATUS

  } else {
    const nProx_Codigo = await Oracle.proxCod("SIMUL_ETAPA_STATUS");
    try {
      await Oracle.insert(sqlInsert, {
        id_simul_status: nProx_Codigo,
        dt_periodo:  { type: Oracle.oracledb.DATE, val: new Date(dt_periodo)},
        id_simul_tp_status: id_simul_tp_status,
        id_simul_etapa: id_simul_etapa,
        id_empresa: id_empresa,
        id_usuario: id_usuario,
        ds_status: msg,
        dt_status: { type: Oracle.oracledb.DATE, val: new Date() }
      });
    
      await new EtapaStatusLog().insert(nProx_Codigo, id_empresa, id_usuario, ds_status);

      return nProx_Codigo;

    } catch (err) {
      throw new Error(err);
    }
  }
}

EtapaStatus.prototype.selectold = async (id_empresa, id_usuario, id_simul_etapa = null) => {
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

EtapaStatus.prototype.Log = new EtapaStatusLog();

module.exports.EtapaStatus = EtapaStatus;
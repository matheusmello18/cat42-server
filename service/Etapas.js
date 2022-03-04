const oracledb = require('oracledb');
const Oracle = require('./Oracle');

const sql = `
select es.id_simul_status,
       es.dt_periodo,
       es.id_simul_tp_status,
       es.cd_status,
       es.ds_status,
       es.id_simul_etapa,
       es.cd_etapa,
       es.ds_etapa,
       es.nm_procedure1,
       es.nm_procedure2,
       es.dt_inicial,
       es.dt_final,
       es.id_orgao,
       es.dm_sequencia,
       es.dm_acao_arquivo,
       es.ds_acao,
       es.id_empresa
  from (select es.id_simul_status,
               es.dt_periodo,
               es.id_simul_tp_status,
               s.cd_status,
               s.ds_status,
               e.id_simul_etapa,
               e.cd_etapa,
               e.ds_etapa,
               e.nm_procedure1,
               e.nm_procedure2,
               e.dt_inicial,
               e.dt_final,
               e.id_orgao,
               e.dm_sequencia,
               e.dm_acao_arquivo,
               e.ds_acao,
               es.id_empresa
          from simul_etapa e
          left join simul_etapa_status es
            on es.id_simul_etapa = e.id_simul_etapa
          left join simul_tipo_status s
            on es.id_simul_tp_status = s.id_simul_tp_status
         where nvl(es.id_empresa,:id_empresa) = :id_empresa
           and nvl(es.dt_periodo, to_date(:dt_periodo,'dd/mm/yyyy')) = to_date(:dt_periodo,'dd/mm/yyyy')) es
 where nvl(es.id_simul_status, 0) =
       nvl((select max(ee.id_simul_status)
             from simul_etapa_status ee
            where ee.dt_periodo = es.dt_periodo
              and ee.id_simul_etapa = es.id_simul_etapa
              and ee.id_empresa = es.id_empresa),0)

`;

module.exports.select = async (id_empresa, dt_periodo) => {
  try {
    let params;

    params = {
      id_empresa: parseInt(id_empresa),
      dt_periodo: dt_periodo,
    };


    return await Oracle.select(sql, params);
  
  } catch (err) {
    console.log(err.message);
  }
}

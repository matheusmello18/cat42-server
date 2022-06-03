/**
 * Modulo Etapas
 * 
 * @module model/Etapas
 * @license [MIT] {@link http://https://github.com/PainelFsical/master/LICENSE}
 * @copyright (c) 2008-2022 Painel Fiscal
 * @since 1.0
 * @see http://www.painelfiscal.com.br/
 */

const Oracle = require('../Oracle');

/**
 * Classe de Etapas
 * 
 * @constructor
 */
 var Etapas = function(){
	if(!(this instanceof Etapas))
		return new Etapas();
};

/**
 * Função selecionar os dados do Etapas por id_empresa, id_usuario_dt_eriodo e/ou id_simul_etapa
 * 
 * @param {number} id_empresa
 * @param {number} id_usuario
 * @param {string} dt_periodo
 * @param {number} id_simul_etapa
 * @returns {Promise} Promrise<Result<T>>
 */

Etapas.prototype.select = async (id_empresa, id_usuario, dt_periodo, id_simul_etapa = NaN) => {
  const sql = `
  select es.id_simul_status,
         to_char(es.dt_periodo, 'dd/mm/yyyy') dt_periodo,
         es.id_simul_tp_status,
         es.cd_status,
         es.ds_status,
         es.id_simul_etapa,
         es.cd_etapa,
         es.ds_etapa,
         es.nm_procedure1,
         es.nm_procedure2,
         to_char(es.dt_inicial, 'dd/mm/yyyy') dt_inicial,
         to_char(es.dt_final, 'dd/mm/yyyy') dt_final,
         es.id_orgao,
         es.dm_sequencia,
         es.dm_acao_arquivo,
         es.ds_acao,
         es.id_empresa,
         es.nm_method,
         to_char(es.dt_status, 'dd/mm/yyyy hh24:mi:ss') dt_status
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
                 es.id_empresa,
                 e.nm_method,
                 es.dt_status
            from simul_etapa e
            left join simul_etapa_status es
              on es.id_simul_etapa = e.id_simul_etapa
            left join simul_tipo_status s
              on es.id_simul_tp_status = s.id_simul_tp_status
           where nvl(es.id_empresa,:id_empresa) = :id_empresa
             and nvl(es.id_usuario,:id_usuario) = :id_usuario
             and nvl(es.dt_periodo, to_date(:dt_periodo,'dd/mm/yyyy')) = to_date(:dt_periodo,'dd/mm/yyyy')) es
   where nvl(es.id_simul_status, 0) =
         nvl((select max(ee.id_simul_status)
               from simul_etapa_status ee
              where ee.dt_periodo = es.dt_periodo
                and ee.id_simul_etapa = es.id_simul_etapa
                and ee.id_empresa = es.id_empresa),0)
  `;
  try {
    let params;

    if (id_simul_etapa !== NaN){
      let sqlNova = sql + ' and es.id_simul_etapa = :id_simul_etapa'
      params = {
        id_empresa: id_empresa,
        id_usuario: id_usuario,
        dt_periodo: dt_periodo,
        id_simul_etapa: id_simul_etapa,
      };
      return await Oracle.select(sqlNova, params);
  
    } else {
      params = {
        id_empresa: id_empresa,
        id_usuario: id_usuario,
        dt_periodo: dt_periodo,
      };

      return await Oracle.select(sql, params);
    }
  
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Etapas = Etapas;
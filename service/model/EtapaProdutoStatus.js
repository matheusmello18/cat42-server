/**
 * Modulo EtapaProdutoStatus
 * 
 * @module model/EtapaProdutoStatus
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de EtapaProdutoStatus
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const EtapaProdutoStatus = new model.EtapaProdutoStatus();
  */
 var EtapaProdutoStatus = function(){
   if(!(this instanceof EtapaProdutoStatus))
     return new EtapaProdutoStatus();
 };

 /**
 * Função para inserir status da etapa log
 * 
 * @param {number} id_produto Produto do Simulador
 * @param {number} id_simul_etapa Id da Etapa do Simulador
 * @param {number} id_empresa Código da Empresa
 * @param {number} id_usuario Código do Usuário
 * @exemplo
 * await EtapaProdutoStatus.insert(1, 1, 1, 1 , 'teste');
 * 
 * ou
 *
 * const data = await EtapaProdutoStatus.insert(1, 1, 1, 1 , 'teste').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
EtapaProdutoStatus.prototype.insert = async (id_produto, id_simul_etapa, id_empresa, id_usuario, ds_status) => {

  const sqlInsert = `insert into simul_produto_etp_sta (id_produto, id_simul_etapa, dt_status, id_simul_tp_status, id_empresa, id_usuario)
  value (:id_produto, :id_simul_etapa, :dt_status, :id_simul_tp_status, :id_empresa, :id_usuario)`;
  
  try {
    await Oracle.insert(sqlInsert, {
      id_produto: id_produto,
      id_simul_etapa: id_simul_etapa,
      dt_status: { type: Oracle.oracledb.DATE, val: new Date() },
      id_simul_tp_status: 3, // inicia com pendencia
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
 * @param {number} id_simul_etapa Id da Etapa do Simulador
 * @param {number} id_empresa Código da Empresa
 * @param {number} id_usuario Código do Usuário
 * @example
 * const rows = (await EtapaProdutoStatus.selectUmPorUmPendente(3)).rows;
 * 
 * ou
 *
 * const rows = await EtapaProdutoStatus.selectUmPorUmPendente(3).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
EtapaProdutoStatus.prototype.select = async (id_simul_etapa, id_empresa, id_usuario) => {
  const sql = `
  select x.id_produto, 
         x.cd_produto, 
         x.ds_produto, 
         x.id_simul_etapa,
         to_char(x.dt_status, 'dd/mm/yyyy') dt_status,
         x.id_simul_tp_status,
         x.cd_status,
         x.ds_status
    from (select a.id_produto, 
                 b.cd_produto, 
                 b.ds_produto, 
                 a.id_simul_etapa,
                 a.dt_status,
                 a.id_simul_tp_status,
                 c.cd_status,
                 c.ds_status
            from simul_produto_etp_sta a
           inner join simul_produto b on (a.id_produto = b.id_produto)
           inner join simul_tipo_status c on (a.id_simul_tp_status = c.id_simul_tp_status)
           where a.id_simul_etapa = :id_simul_etapa
             and a.id_empresa = :id_empresa
             and a.id_usuario = :id_usuario
             and c.id_simul_tp_status in (2,3)
             and rownum = 1
           union all
          select a.id_produto, 
                 b.cd_produto, 
                 b.ds_produto, 
                 a.id_simul_etapa,
                 a.dt_status,
                 a.id_simul_tp_status,
                 c.cd_status,
                 c.ds_status
            from simul_produto_etp_sta a
           inner join simul_produto b on (a.id_produto = b.id_produto)
           inner join simul_tipo_status c on (a.id_simul_tp_status = c.id_simul_tp_status)
           where a.id_simul_etapa = :id_simul_etapa
             and a.id_empresa = :id_empresa
             and a.id_usuario = :id_usuario
             and c.id_simul_tp_status in (1)
        ) x  order by x.id_produto, x.id_simul_tp_status 
    `;

  try {
    let params;

    params = {
      id_simul_etapa: id_simul_etapa,
      id_empresa: id_empresa,
      id_usuario: id_usuario
    };

    return await Oracle.select(sql, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Função para selecionar etapas da empresa
 * 
 * @param {number} id_simul_etapa Id da Etapa do Simulador
 * @param {number} id_empresa Código da Empresa
 * @param {number} id_usuario Código do Usuário
 * @return boolean
 * @example
 * const rows = (await EtapaProdutoStatus.concluido(3)).rows;
 * 
 * ou
 *
 * const rows = await EtapaProdutoStatus.concluido(3).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
EtapaProdutoStatus.prototype.concluido = async (id_simul_etapa, id_empresa, id_usuario) => {
  const sql = `
    select count(*) num_registro
    from simul_produto_etp_sta a
    where a.id_simul_etapa = :id_simul_etapa
      and a.id_simul_tp_status in (2,3)
      and a.id_empresa = :id_empresa
      and a.id_usuario = :id_usuario
    `;

  try {
    let params;

    params = {
      id_simul_etapa: id_simul_etapa,
      id_empresa: id_empresa,
      id_usuario: id_usuario
    };

    return await Oracle.select(sql, params).then((data) => {
      return parseInt(data.rows[0].NUM_REGISTRO) === 0
    });
  
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.EtapaProdutoStatus = EtapaProdutoStatus;
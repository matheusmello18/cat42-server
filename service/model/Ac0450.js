/**
 * Modulo Ac0450
 * 
 * @module model/Ac0450
 */

const Oracle = require('../Oracle');

/**
 * Classe de Ac0450
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const ac0450 = new model.Ac0450();
 */
var Ac0450 = function(){
  if(!(this instanceof Ac0450))
    return new Ac0450();
};

/**
 * Função busca os dados do Ac0450 por observação
 * 
 * @param {string} ds_observacao Descrição da observação
 * @param {number} id_empresa Id da Empresa
 * @param {string} dt_inicial Data da emissão
 * @returns {Promise} Promise
 * @example
 * const rows = (await ac0450.select('retorno ref a nf no0039142 de 19/05/2014 |', 1, '01/06/2014')).rows;
 * 
 * ou
 *
 * const rows = await ac0450.select('retorno ref a nf no0039142 de 19/05/2014 |', 1, '01/06/2014').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw err
 * })
 */

Ac0450.prototype.select = async (ds_observacao, id_empresa, dt_inicial) => {
  let sql = `select ac.id_ref_0450, ac.cd_observacao, 
                    ac.dt_inicial,  ac.dt_movimento, 
                    ac.ds_observacao
               from ac_0450 ac
              where ac.ds_observacao = :ds_observacao
                and ac.id_empresa    = :id_empresa
                and ac.dt_inicial    = (select max(ac_0450.dt_inicial)
                                          from ac_0450
                                         where ac_0450.ds_observacao = ac.ds_observacao
                                           and ac_0450.id_empresa    = ac.id_empresa
                                           and ac_0450.dt_inicial   <= to_date(:dt_inicial, 'dd/mm/yyyy'))`;
  try {
    return await Oracle.select(sql, {ds_observacao: ds_observacao, id_empresa: id_empresa, dt_inicial: dt_inicial})
  } catch (err) {
    throw err
  }
}

/**
 * Inserir dados do Ac0450
 * 
 * @param {string} ds_observacao Descrição da observação
 * @param {number} id_empresa Id da Empresa
 * @param {string} dt_inicial Data da emissão
 * @returns {Promise}  Contém o Código da Observação
 * @example
 * const id_ref_0450 = (await ac0450.insert('retorno ref a nf no0039142 de 19/05/2014 |', 1, '01/06/2014'));
 * 
 * ou
 *
 * const id_ref_0450 = await ac0450.insert('retorno ref a nf no0039142 de 19/05/2014 |', 1, '01/06/2014').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro AC0450');
 * })
 */
Ac0450.prototype.insert = async (ds_observacao, id_empresa, dt_inicial) => {
  const nProx_Codigo = await Oracle.proxCod("SIMUL_CADASTRO");
  let cd_observacao = parseInt(nProx_Codigo) + 1;
  let sql = `insert into ac_0450(cd_observacao, 
                                 dt_inicial, 
                                 dt_movimento, 
                                 id_empresa, 
                                 id_usuario, 
                                 ds_observacao) 
                          values(:cd_observacao, 
                                 to_date(:dt_inicial, 'dd/mm/yyyy'),
                                 to_date(:dt_movimento, 'dd/mm/yyyy'),
                                 :id_empresa, 
                                 :id_usuario, 
                                 :ds_observacao)`;
  try {
    await Oracle.insert(sql, {cd_observacao: cd_observacao, ds_observacao: ds_observacao, id_empresa: id_empresa, dt_inicial: dt_inicial, dt_movimento: dt_inicial})
    return cd_observacao;
  } catch (err) {
    throw err
  }
}

module.exports.Ac0450 = Ac0450;
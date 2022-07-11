/**
 * Modulo ProdutoSimulador
 * 
 * @module model/ProdutoSimulador
 */
const Oracle = require('../Oracle');

/**
 * Classe de ProdutoSimulador
 * 
 * @constructor
 * @example
 * const ProdutoSimulador = new ProdutoSimulador();
 */

 var ProdutoSimulador = function(){
  if(!(this instanceof ProdutoSimulador))
    return new ProdutoSimulador();
};

/**
 * Função inserir os dados do Produto Simulador 
 * 
 * @param {Number} id_produto
 * @param {Number|String|any} cd_produto
 * @param {Number|String|any} ds_produto
 * @param {Number|String|any} ds_unidade_venda
 * @param {Number|String|any} cd_produto_forn
 * @param {Number|String|any} ds_unidade_forn
 * @param {Number|String|any} vl_fator_conversao
 * @param {Number|String|any} aliq_icms
 * @param {Number|String|any} vl_saldo_estoque_inicial
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @returns {Promise} Promise
 * @example
 * await ProdutoSimulador.insert('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao');
 * 
 * ou
 *
 * const data = await ProdutoSimulador.insert('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
ProdutoSimulador.prototype.Insert = async (id_produto, cd_produto, ds_produto, ds_unidade_venda, cd_produto_forn, ds_unidade_forn, vl_fator_conversao, aliq_icms, vl_saldo_estoque_inicial, id_empresa, id_usuario) => {
  const sqlInsert = `insert into simul_produto ( id_produto, cd_produto, ds_produto, ds_unidade_venda, cd_produto_forn, ds_unidade_forn, vl_fator_conversao, aliq_icms, vl_saldo_estoque_inicial, id_empresa, id_usuario )
  values ( :id_produto, :cd_produto, :ds_produto, :ds_unidade_venda, :cd_produto_forn, :ds_unidade_forn, :vl_fator_conversao, :aliq_icms, :vl_saldo_estoque_inicial, :id_empresa, :id_usuario )`;
  try {
    let params = {
      id_produto: id_produto,
      cd_produto: cd_produto,
      ds_produto: ds_produto,
      ds_unidade_venda: ds_unidade_venda,
      cd_produto_forn: cd_produto_forn,
      ds_unidade_forn: ds_unidade_forn,
      vl_fator_conversao: vl_fator_conversao,
      aliq_icms: aliq_icms,
      vl_saldo_estoque_inicial: vl_saldo_estoque_inicial,
      id_empresa: id_empresa,
      id_usuario: id_usuario
    };
    await Oracle.insert(sqlInsert, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Função deletar os dados do Produto Simulador
 * 
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @returns {Promise} Promise
 * @example
 * await ProdutoSimulador.Delete('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao');
 * 
 * ou
 *
 * const data = await ProdutoSimulador.Delete('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
ProdutoSimulador.prototype.Delete = async (id_empresa, id_usuario) => {
  const sqlDelete = `delete from simul_produto where id_empresa = :id_empresa and id_usuario = :id_usuario`;
  try {
    let params = {
      id_empresa: id_empresa,
      id_usuario: id_usuario
    };

    return await Oracle.delete(sqlDelete, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Função selecionar os dados do Produto Simulador por Cód Produto Fornecedor (vindo do XML)
 * 
 * @param {String} cdProdForn
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @returns {Promise} Promise
 * @example
 * await ProdutoSimulador.selectByCodProdForn('00981', 1, 1);
 * 
 * ou
 *
 * const data = await ProdutoSimulador.selectByCodProdForn('00981', 1, 1).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
ProdutoSimulador.prototype.selectByCodProdForn = async (cdProdForn, id_empresa, id_usuario) => {
  const sql= `select * 
                from simul_produto 
               where cd_produto_forn in (:cd_produto_forn) 
                 and id_empresa = :id_empresa 
                 and id_usuario = :id_usuario 
                 and id_simul_tp_status in (2,3)`;
  try {
    let params = {
      cd_produto_forn: cdProdForn,
      id_empresa: id_empresa,
      id_usuario: id_usuario
    };

    return await Oracle.delete(sql, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.ProdutoSimulador = ProdutoSimulador;
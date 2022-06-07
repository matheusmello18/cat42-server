/**
 * Modulo Pessoa
 * 
 * @module model/ProdutoSimulador
 */
const Oracle = require('../Oracle');

/**
 * Classe de Saida.Produto.Item
 * 
 * @constructor
 */

 var ProdutoSimulador = function(){
  if(!(this instanceof ProdutoSimulador))
    return new ProdutoSimulador();
};

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

module.exports.ProdutoSimulador = ProdutoSimulador;
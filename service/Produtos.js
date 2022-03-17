const ProxCod = require('./ProxCod');

const sqlInser = `insert into simul_produto ( id_produto, cd_produto, ds_produto, ds_unidade_venda, cd_produto_forn, ds_unidade_forn, vl_fator_conversao, aliq_icms, vl_saldo_estoque_inicial, id_empresa, id_usuario )
values ( :id_produto, :cd_produto, :ds_produto, :ds_unidade_venda, :cd_produto_forn, :ds_unidade_forn, :vl_fator_conversao, :aliq_icms, :vl_saldo_estoque_inicial, :id_empresa, :id_usuario )`;

module.exports.Insert = async (cd_produto, ds_produto, ds_unidade_venda, cd_produto_forn, ds_unidade_forn, vl_fator_conversao, aliq_icms, vl_saldo_estoque_inicial, id_empresa, id_usuario) => {
  const nProx_Codigo = await ProxCod("SIMUL_PRODUTO");
  try {
    let params = {
      id_produto: nProx_Codigo,
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

    return await Oracle.insert(sqlInsert, params);
  
  } catch (err) {
    console.log(err.message);
  }
}
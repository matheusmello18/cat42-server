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

ProdutoSimulador.prototype.BuscarPeloProdutosSimul = async (xmlObj, id_empresa, id_usuario) => {
  let cd_prods = '';
  for (let i = 0; i < xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.det.length; i++) {
    const det = xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.det[i];
    cd_prods = cd_prods.concat(`'${det.prod[0]?.cProd[0].trim()}',`)    
  }
  cd_prods = cd_prods.slice(0, -1);

  return await new ProdutoSimulador().selectByCodProdForn(cd_prods, id_empresa, id_usuario);  
}

/**
 * Função selecionar total de produtos com pendencia
 * 
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @returns {Promise} Promise
 * @example
 * await ProdutoSimulador.ComPendencia(1, 1);
 * 
 * ou
 *
 * const data = await ProdutoSimulador.ComPendencia(1, 1).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
 ProdutoSimulador.prototype.ComPendencia = async (id_empresa, id_usuario) => {
  const sql= `select count(*) total
                from simul_produto a
               inner join simul_produto_etp_sta b on a.id_produto = b.id_produto and a.id_empresa = b.id_empresa
               where a.id_empresa = :id_empresa
                 and a.id_usuario = :id_usuario
                 and b.id_simul_tp_status in (2,3)`;
  try {
    let params = {
      id_empresa: id_empresa,
      id_usuario: id_usuario
    };
    return await Oracle.select(sql, params);
  
  } catch (err) {
    throw err
  }
}


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
    throw err
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
    throw err
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
                from simul_produto a
               inner join simul_produto_etp_sta b on a.id_produto = b.id_produto and a.id_empresa = b.id_empresa
               where a.cd_produto_forn in (${cdProdForn}) 
                 and a.id_empresa = :id_empresa
                 and a.id_usuario = :id_usuario
                 and b.id_simul_tp_status in (2,3)`;
  try {
    let params = {
      id_empresa: id_empresa,
      id_usuario: id_usuario
    };
    return await Oracle.select(sql, params);
  
  } catch (err) {
    throw err
  }
}

/**
 * Função selecionar os dados do Produto Simulador por Cód Produto Fornecedor (vindo do XML)
 * 
 * @param {Number} id_simul_tp_status 1 - SUCESSO / 2 - ERRO / 3 PENDENCIA
 * @param {Number} id_produto
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @returns {Promise} Promise
 * @example
 * await ProdutoSimulador.updateStatus(1, 3, 1, 1);
 * 
 * ou
 *
 * const data = await ProdutoSimulador.updateStatus(1, 3, 1, 1).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao alterar o registro.');
 * })
 */
ProdutoSimulador.prototype.updateStatus = async (id_simul_tp_status, id_produto, id_empresa, id_usuario) => {
  const sql= `update simul_produto_etp_sta
                set id_simul_tp_status = :id_simul_tp_status
              where id_produto = :id_produto
                and id_empresa = :id_empresa
                and id_usuario = :id_usuario`;
  try {
    let params = {
      id_simul_tp_status: id_simul_tp_status,
      id_produto: id_produto,
      id_empresa: id_empresa,
      id_usuario: id_usuario
    };
    return await Oracle.update(sql, params);
  
  } catch (err) {
    throw err
  }
}

module.exports.ProdutoSimulador = ProdutoSimulador;
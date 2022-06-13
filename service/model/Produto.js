/**
 * Modulo Produto
 * 
 * @module model/Produto
 * @example
 * const model = require('./model');
 */
const Oracle = require('../Oracle');

/**
 * Classe de Produto
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const Produto = new model.Produto();
 */

var Produto = function(){
  if(!(this instanceof Produto))
    return new Produto();
};

 /**
	* Função inserir os dados do dataProdutoServico 
	* 
	* @param {dataProdutoServico} dataProdutoServico
	* @returns {Promise} Promise
	* @example
	* var dataProdutoServico = {
	*   cd_produto_servico: '', 
	*   cd_barra: '', 
	*   ds_produto_servico: '', 
	*   id_ref_331_ncm: 0, 
	*   id_ref_331_ex_ipi: 0, 
	*   dm_tipo_item: '', 
	*   unidade: '', 
	*   id_0190: 0,
	*   dt_inicial: '', 
	*   dt_movimento: '', 
	*   id_cest: 0, 
	*   id_empresa: 1, 
	*   id_usuario: 1
	* }
	* await Produto.insert(dataProdutoServico);
	* 
	* ou
	*
	* const data = await Produto.insert(dataProdutoServico).then((e) => {
	*    return e;
	* }).catch((err) => {
	*    throw new Error('Erro ao inserir o registro.');
	* })
	*/
Produto.prototype.insert = async (dataProdutoServico) => {
	let sql = `insert into in_produto_servico 
						( cd_produto_servico, cd_barra, ds_produto_servico, id_ref_331_ncm, id_ref_331_ex_ipi, dm_tipo_item, unidade, id_0190, dt_inicial, dt_movimento, id_cest, id_empresa, id_usuario) 
						values 
						( :cd_produto_servico, :cd_barra, :ds_produto_servico, :id_ref_331_ncm, :id_ref_331_ex_ipi, :dm_tipo_item, :unidade, :id_0190, :dt_inicial, :dt_movimento, :id_cest, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, dataProdutoServico)
	} catch (err) {
		throw new Error(err);
	}
}

/**
 * Gerar Produto Mestre Item
 * @returns {Promise} Promise
 */
Produto.prototype.sp_gera_produto_mestre_item = async () => {
  try {
    return await Oracle.execProcedure('SP_GERA_PRODUTO_MESTRE_ITEM');
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Classe de ProdutoMestre
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const ProdutoMestre = new model.Produto().Mestre();
 */

 var ProdutoMestre = function(){
  if(!(this instanceof ProdutoMestre))
    return new ProdutoMestre();
};

/**
 * Função busca os dados do País através do código do país
 * 
 * @param {string} cd_produto_servico
 * @param {Number} id_empresa
 * @return {Promise} Promrise
 * 
 * @example
 * const rows = (await ProdutoMestre.selectByCodigo('562718', 1)).rows;
 * 
 * ou
 *
 * const rows = await ProdutoMestre.selectByCodigo('562718', 1).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
ProdutoMestre.prototype.selectByCodigo = async (cd_produto_servico, id_empresa) => {
	let sql = `select max(id_produto_servico)
								from in_produto_servico_mestre
							where upper(cd_produto_servico) = upper(:cd_produto_servico)
								and id_empresa                = :id_empresa`;
	try {
		return await Oracle.select(sql, {cd_produto_servico: cd_produto_servico, id_empresa: id_empresa})
	} catch (err) {
		throw new Error(err);
	}
}

Produto.prototype.Mestre = new ProdutoMestre()

/**
 * Classe de ProdutoMestre
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const ProdutoMestreItem = new model.Produto().Mestre().Item();
 */

 var ProdutoMestreItem = function(){
  if(!(this instanceof ProdutoMestreItem))
    return new ProdutoMestreItem();
};

/**
 * Função busca os dados do País através do código do país
 * 
 * @param {string} cd_produto_servico
 * @param {Number} id_empresa
 * @param {string} dt_inicial
 * @return {Promise} Promrise
 * 
 * @example
 * const rows = (await ProdutoMestreItem.selectByCodigo('562718', 1, '01/08/2019')).rows;
 * 
 * ou
 *
 * const rows = await ProdutoMestreItem.selectByCodigo('562718', 1, '01/08/2019').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
ProdutoMestreItem.prototype.selectByCodigo = async (cd_produto_servico, id_empresa, dt_inicial) => {
	let sql = `select psm.cd_produto_servico, psi.ds_produto_servico, psi.dm_tipo_item
								from in_produto_servico_mestre psm 
								left join in_produto_servico_item psi on (psm.id_produto_servico = psi.id_produto_servico) 
							where psm.id_empresa = :id_empresa
								and upper(psm.cd_produto_servico) = upper(:cd_produto_servico) 
								and (psi.dt_inicial = (select max(item.dt_inicial) 
																					from in_produto_servico_item item 
																				where item.id_produto_servico = psi.id_produto_servico 
																					and item.dt_inicial <= to_date(:dt_inicial, 'DD/MM/YYYY')) 
										or psi.dt_inicial is null) `;
	try {
		return await Oracle.select(sql, {id_empresa: id_empresa, cd_produto_servico: cd_produto_servico, dt_inicial: dt_inicial})
	} catch (err) {
		throw new Error(err);
	}
}

ProdutoMestre.prototype.Item = new ProdutoMestreItem();

module.exports.Produto = Produto;

/**
 * Campos da Tabela dataProdutoServico
 * 
 * @typedef {Object} dataProdutoServico
 * @property {String} cd_produto_servico
 * @property {String} cd_barra
 * @property {String} ds_produto_servid_ref_331_ncmico
 * @property {Number} id_ref_331_ex_ipi
 * @property {String} dm_tipo_item
 * @property {String} unidade
 * @property {Number} id_0190
 * @property {String} dt_inicial
 * @property {String} dt_movimento
 * @property {Number} id_cest
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */
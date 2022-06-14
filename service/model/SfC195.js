/**
 * Modulo SfC195
 * 
 * @module model/SfC195
 * @example
 * const model = require('./model');
 */

 const Oracle = require('../Oracle');

 /**
	* Classe de SfC195Saida
	* 
	* @constructor
	* @example
  * const model = require('./model');
	* const SfC195Saida = new model.NotaFiscal.Saida().SfC195();
	*/
 var SfC195Saida = function(){
	 if(!(this instanceof SfC195Saida))
		 return new SfC195Saida();
 };
	
/**
 * Função inserir os dados do SfC195 Saida 
 * 
 * @param {dataSfC195Saida} dataSfC195Saida
 * @returns {Promise} Promise
 * @example
 * var dataSfC195Saida = {
 *   dm_entrada_saida: '',
 *   id_0460, ds_complementar: 0, 
 *   id_nota_fiscal_saida: 0,
 *   nr_item: 1,
 *   id_modelo_documento: 1,
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   nr_sequencia: 1,
 *   id_empresa: 1,
 *   id_usuario: 1
 * }
 * 
 * await SfC195Saida.insert(dataSfC195Saida);
 * 
 * ou
 *
 * const data = await SfC195Saida.insert(dataSfC195Saida).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */

SfC195Saida.prototype.insert = async (dataSfC195Saida) => {
	let sql = `insert into sf_c195_saida 
						( dm_entrada_saida, id_0460, ds_complementar, id_nota_fiscal_saida, nr_item, id_modelo_documento, serie_subserie_documento, nr_documento, dt_emissao_documento, nr_sequencia, id_empresa, id_usuario) 
						values 
						( :dm_entrada_saida, :id_0460, :ds_complementar, :id_nota_fiscal_saida, :nr_item, :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :nr_sequencia, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, dataSfC195Saida)
	} catch (err) {
		throw new Error(err);
	}
}
	
module.exports.SfC195Saida = SfC195Saida;


 /**
	* Classe de SfC195 Entrada
	* 
	* @constructor
	* @example
  * const model = require('./model');
	* const SfC195Entrada = new model.NotaFiscal.Entrada().SfC195();
	*/
var SfC195Entrada = function(){
	if(!(this instanceof SfC195Entrada))
		return new SfC195Entrada();
};

/**
 * Função inserir os dados do SfC195 Entrada
 * 
 * @param {dataSfC195Entrada} dataSfC195Entrada
 * @returns {Promise} Promise
 * @example
 * var dataSfC195Entrada = {
 *   id_0460: 1,
 *   ds_complementar: '',
 *   id_nota_fiscal_entrada: 1,
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   id_pessoa_remetente: 1,
 *   nr_sequencia: 1,
 *   nr_item: 1,
 *   id_empresa: 1,
 *   id_usuario: 1,
 *   id_modelo_documento: 1
 * }
 * 
 * await SfC195Entrada.insert(dataSfC195Entrada);
 * 
 * ou
 *
 * const data = await SfC195Entrada.insert(dataSfC195Entrada).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */

SfC195Entrada.prototype.insert = async (dataSfC195Entrada) => {
	let sql = `insert into sf_c195_entrada 
						( id_0460, ds_complementar, id_nota_fiscal_entrada, serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, nr_sequencia, nr_item, id_empresa, id_usuario, id_modelo_documento) 
						values 
						( :id_0460, :ds_complementar, :id_nota_fiscal_entrada, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_pessoa_remetente, :nr_sequencia, :nr_item, :id_empresa, :id_usuario, :id_modelo_documento)
						`;
	try {
		await Oracle.insert(sql, dataSfC195Entrada)
	} catch (err) {
		throw new Error(err);
	}
}

module.exports.SfC195Entrada = SfC195Entrada;

/**
 * Campos da Tabela dataSfC195Saida
 * 
 * @typedef {Object} dataSfC195Saida
 * @property {String} dm_entrada_saida
 * @property {String} nr_item
 * @property {String} ds_complementar
 * @property {Number} id_0460
 * @property {Number} id_nota_fiscal_saida
 * @property {String} dt_emissao_documento
 * @property {Number} nr_documento
 * @property {String} serie_subserie_documento
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @property {Number} id_modelo_documento
 * @global
 */

/**
 * Campos da Tabela SfC195Entrada
 * 
 * @typedef {Object} dataSfC195Entrada
 * @property {String} nr_item
 * @property {String} nr_sequencia
 * @property {Number} ds_complementar
 * @property {String} id_0460
 * @property {Number} id_nota_fiscal_entrada
 * @property {Number} id_pessoa_remetente
 * @property {String} dt_emissao_documento
 * @property {Number} nr_documento
 * @property {String} serie_subserie_documento
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @property {Number} id_modelo_documento
 * @global
 */
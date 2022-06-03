/**
 * Modulo SfC195
 * 
 * @module model/SfC195
 * @license [MIT] {@link http://https://github.com/PainelFsical/master/LICENSE}
 * @copyright (c) 2008-2022 Painel Fiscal
 * @since 1.0
 * @see http://www.painelfiscal.com.br/
 */

 const Oracle = require('../Oracle');

 /**
	* Classe de SfC195Saida
	* 
	* @constructor
	*/
 var SfC195Saida = function(){
	 if(!(this instanceof SfC195Saida))
		 return new SfC195Saida();
 };
	
/**
 * Função inserir os dados do SfC195Saida 
 * 
 * @param {dataSfC195Saida} dataSfC195Saida
 * @returns {Promise} Promrise<Result<T>>
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
	* Classe de SfC195Entrada
	* 
	* @constructor
	*/
var SfC195entrada = function(){
	if(!(this instanceof SfC195entrada))
		return new SfC195entrada();
};

/**
 * Função inserir os dados do SfC195Saida 
 * 
 * @param {dataSfC195Entrada} dataSfC195Entrada
 * @returns {Promise} Promrise<Result<T>>
 */

SfC195entrada.prototype.insert = async (dataSfC195Entrada) => {
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
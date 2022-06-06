/**
 * Modulo AcC060
 * 
 * @module model/AcC060
 */

 const Oracle = require('../Oracle');

 /**
	* Classe de AcC060Entrada
	* 
	* @constructor
	*/
	var AcC060Entrada = function(){
	 if(!(this instanceof AcC060Entrada))
		 return new AcC060Entrada();
 };
 
 /**
	* Função inserir os dados do AcC060Entrada 
	* 
	* @param {dataAcC060Entrada} dataAcC060Entrada 
	* @returns {Promise} Promrise<Result<T>>
	*/
 
 AcC060Entrada.prototype.insert = async (dataAcC060Entrada) => {
	let sql = `insert into ac_c060_entrada 
						( dm_importacao, nr_di, dt_registro, dt_desembaraco, vl_pis, vl_cofins, id_nota_fiscal_entrada, id_pessoa_remetente, dt_emissao_documento, nr_documento, nr_item, nr_sequencia, serie_subserie_documento, id_empresa, id_usuario, id_modelo_documento) 
						values 
						( :dm_importacao, :nr_di, :dt_registro, :dt_desembaraco, :vl_pis, :vl_cofins, :id_nota_fiscal_entrada, :id_pessoa_remetente, :dt_emissao_documento, :nr_documento, :nr_item, :nr_sequencia, :serie_subserie_documento, :id_empresa, :id_usuario, :id_modelo_documento)
						`;
	try {
		return await Oracle.insert(sql, dataAcC060Entrada)
	} catch (err) {
		throw new Error(err);
	}
}
 
module.exports.AcC060Entrada = AcC060Entrada;

/**
 * Campos da Tabela AcC060Entrada
 * 
 * @typedef {Object} dataAcC060Entrada
 * @property {String} dm_importacao
 * @property {String} nr_di
 * @property {Number} dt_registro
 * @property {Number} dt_desembaraco
 * @property {Number} vl_pis
 * @property {Number} vl_cofins
 * @property {Number} id_nota_fiscal_entrada
 * @property {Number} id_pessoa_remetente
 * @property {String} dt_emissao_documento
 * @property {Number} nr_documento
 * @property {Number} nr_item
 * @property {Number} nr_sequencia
 * @property {String} serie_subserie_documento
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @property {Number} id_modelo_documento
 * @global
 */
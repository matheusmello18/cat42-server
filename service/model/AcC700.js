/**
 * Modulo AcC700
 * 
 * @module model/AcC700
 * @example
 * const model = require('./model');
 */

const Oracle = require('../Oracle');

/**
 * Classe de AcC700Saida
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const acC700Saida = new model.AcC700.AcC700Saida();
 */
var AcC700Saida = function(){
	if(!(this instanceof AcC700Saida))
		return new AcC700Saida();
};
 
 /**
	* Função inserir os dados do AcC700Saida 
	* 
	* @param {dataAcC700Saida} dataAcC700Saida
	* @returns {Promise} Promise
	* @example
	* var dataAcC700Saida = {
	*   dm_entrada_saida: '',
	*   dm_tipo_ligacao: '',
	*   dm_grupo_tensao: '',
	*   id_ref_331_municipio: 1,
	*   nr_chave_nf_eletronica_ref: '',
	*   vl_fornecido: 0,
	*   id_nota_fiscal_saida: 1,
	*   dt_emissao_documento: '',
	*   nr_documento: 0,
	*   serie_subserie_documento: '0',
	*   id_empresa: 1,
	*   id_usuario: 0,
  *   id_modelo_documento: 1
	* }
	* const rows = (await acC700Saida.insert(dataAcC700Saida)).rows;
	* 
	* ou
	*
	* const rows = await acC700Saida.insert(dataAcC700Saida).then((e) => {
	*    return e.rows;
	* }).catch((err) => {
	*    throw new Error(err.message)
	* })
	*/
 
 AcC700Saida.prototype.insert = async (dataAcC700Saida) => {
	let sql = `insert into ac_c700_saida 
						( dm_entrada_saida, dm_tipo_ligacao, dm_grupo_tensao, id_ref_331_municipio, nr_chave_nf_eletronica_ref, vl_fornecido, id_nota_fiscal_saida, serie_subserie_documento, nr_documento, dt_emissao_documento, id_modelo_documento, id_empresa, id_usuario) 
						values 
						( :dm_entrada_saida, :dm_tipo_ligacao, :dm_grupo_tensao, :id_ref_331_municipio, :nr_chave_nf_eletronica_ref, :vl_fornecido, :id_nota_fiscal_saida, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_modelo_documento, :id_empresa, :id_usuario)
						`;
	try {
		return await Oracle.insert(sql, dataAcC700Saida)
	} catch (err) {
		throw new Error(err);
	}
}
 
module.exports.AcC700Saida = AcC700Saida;

/**
 * Classe de AcC700Entrada
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const acC700Entrada = new model.AcC700.AcC700Entrada();
*/
	var AcC700Entrada = function(){
		if(!(this instanceof AcC700Entrada))
			return new AcC700Entrada();
	};
	
	/**
	 * Função inserir os dados do AcC700Entrada 
	 * 
	 * @param {dataAcC700Entrada} dataAcC700Entrada 
	 * @returns {Promise} Promise
	 * @example
	 * var dataAcC700Entrada = {
	 *   dm_tipo_ligacao: '',
	 *   dm_grupo_tensao: '',
	 *   id_ref_331_municipio: 1,
	 *   nr_chave_nf_eletronica_ref: '',
	 *   vl_fornecido: 0,
	 *   id_nota_fiscal_entrada: 1,
	 *   dt_emissao_documento: '',
	 *   nr_documento: 0,
	 *   serie_subserie_documento: '0',
	 *   id_pessoa_remetente: 1,
	 *   id_empresa: 1,
	 *   id_usuario: 0,
   *   id_modelo_documento: 1
	 * }
	 * const rows = (await acC700Entrada.insert(dataAcC700Entrada)).rows;
	 * 
	 * ou
	 *
	 * const rows = await acC700Entrada.insert(dataAcC700Entrada).then((e) => {
	 *    return e.rows;
	 * }).catch((err) => {
	 *    throw new Error(err.message)
	 * })
	 */
	
	AcC700Entrada.prototype.insert = async (dataAcC700Entrada) => {
    let sql = `insert into ac_c700_entrada 
              ( dm_tipo_ligacao, dm_grupo_tensao, id_ref_331_municipio, nr_chave_nf_eletronica_ref, vl_fornecido, id_nota_fiscal_entrada, serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, id_empresa, id_usuario, id_modelo_documento) 
              values 
              ( :dm_tipo_ligacao, :dm_grupo_tensao, :id_ref_331_municipio, :nr_chave_nf_eletronica_ref, :vl_fornecido, :id_nota_fiscal_entrada, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_pessoa_remetente, :id_empresa, :id_usuario, :id_modelo_documento)
              `;
    try {
      return await Oracle.insert(sql, dataAcC700Entrada)
    } catch (err) {
      throw new Error(err);
    }
  }
	
 module.exports.AcC700Entrada = AcC700Entrada;
 

/**
 * Campos da Tabela AcC700Saida
 * 
 * @typedef {Object} dataAcC700Saida
 * @property {String} dm_entrada_saida
 * @property {String} dm_tipo_ligacao
 * @property {String} dm_grupo_tensao
 * @property {Number} id_ref_331_municipio
 * @property {String} nr_chave_nf_eletronica_ref
 * @property {Number} vl_fornecido
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
 * Campos da Tabela AcC060Entrada
 * 
 * @typedef {Object} dataAcC700Entrada
 * @property {String} dm_tipo_ligacao
 * @property {String} dm_grupo_tensao
 * @property {Number} id_ref_331_municipio
 * @property {String} nr_chave_nf_eletronica_ref
 * @property {Number} vl_fornecido
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
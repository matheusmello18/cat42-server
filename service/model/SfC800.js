/**
 * Modulo SfC800
 * 
 * @module model/SfC800
 * @example
 * const model = require('./model');
 */

 const Oracle = require('../Oracle');
 const SfC850 = require('./SfC850').SfC850;

 /**
  * Classe de SfC800
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const SfC800 = new model.SfC800();
  */
 var SfC800 = function(){
   if(!(this instanceof SfC800))
     return new SfC800();
 };
  
/**
 * Função inserir os dados do SfC800
 * 
 * @param {dataSfC800} dataSfC800
 * @returns {Promise} Promise
 * @example
 * var dataSfC800 = {
 *   nr_chave_cfe: '',
 *   id_modelo_documento: 1,
 *   id_ref_413: 1,
 *   dt_documento: '',
 *   nr_cnpj_cpf: '',
 *   nr_serie_sat: '',
 *   nr_cfe: '',
 *   nr_caixa: '',
 *   nm_destinatario: '',
 *   vl_desconto: 0,
 *   vl_mercadoria: 0,
 *   vl_outras_desp: 0,
 *   vl_icms: 0,
 *   vl_pis: 0,
 *   vl_pis_st: 0,
 *   vl_cofins: 0,
 *   vl_cofins_st: 0,
 *   vl_cfe: 0,
 *   id_empresa: 1,
 *   id_usuario: 1
 * }
 * await SfC800.insert(dataSfC800);
 * 
 * ou
 *
 * const data = await SfC800.insert(dataSfC800).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
  
SfC800.prototype.insert = async (dataSfC800) => {
	let sql = `insert into sf_c800 
						( nr_chave_cfe, id_modelo_documento, id_ref_413, dt_documento, nr_cnpj_cpf, nr_serie_sat, nr_cfe, nr_caixa, nm_destinatario, vl_desconto, vl_mercadoria, vl_outras_desp, vl_icms, vl_pis, vl_pis_st, vl_cofins, vl_cofins_st, vl_cfe, id_empresa, id_usuario) 
						values 
						( :nr_chave_cfe, :id_modelo_documento, :id_ref_413, :dt_documento, :nr_cnpj_cpf, :nr_serie_sat, :nr_cfe, :nr_caixa, :nm_destinatario, :vl_desconto, :vl_mercadoria, :vl_outras_desp, :vl_icms, :vl_pis, :vl_pis_st, :vl_cofins, :vl_cofins_st, :vl_cfe, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, dataSfC800)
	} catch (err) {
		throw new Error(err);
	}
}

/**
 * Classe SfC850
 * @param	{SfC850} SfC850 
 * @constructor
 */
SfC800.prototype.SfC850 = new SfC850();

module.exports.SfC800 = SfC800;

/**
 * Campos da Tabela SfC800
 * 
 * @typedef {Object} dataSfC800
 * @property {String} nr_chave_cfe
 * @property {Number} id_modelo_documento
 * @property {String} id_ref_413
 * @property {String} dt_documento
 * @property {String} nr_cnpj_cpf
 * @property {Number} nr_serie_sat
 * @property {Number} nr_cfe
 * @property {Number} nr_caixa
 * @property {String} nm_destinatario
 * @property {Number} vl_desconto
 * @property {Number} vl_mercadoria
 * @property {Number} vl_outras_desp
 * @property {Number} vl_icms
 * @property {Number} vl_pis
 * @property {Number} vl_pis_st
 * @property {Number} vl_cofins
 * @property {Number} vl_cofins_st
 * @property {Number} vl_cfe
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */
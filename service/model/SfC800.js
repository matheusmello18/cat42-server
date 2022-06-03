/**
 * Modulo SfC800
 * 
 * @module model/SfC800
 * @license [MIT] {@link http://https://github.com/PainelFsical/master/LICENSE}
 * @copyright (c) 2008-2022 Painel Fiscal
 * @since 1.0
 * @see http://www.painelfiscal.com.br/
 */

 const Oracle = require('../Oracle');
 const SfC850 = require('./SfC850').SfC850;

 /**
  * Classe de SfC800
  * 
  * @constructor
  */
 var SfC800 = function(){
   if(!(this instanceof SfC800))
     return new SfC800();
 };
  
  /**
   * Função buscar os dados do SfC800 por código modelo documetno
   * 
   * @param {dataSfC800} dataSfC800
   * @returns {Promise} Promrise<Result<T>>
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
 * @param	{SfC850} SfC850 teste
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
 * @property {Number} dt_documento
 * @property {String} nr_cnpj_cpf
 * @property {Number} nr_serie_sat
 * @property {Number} nr_cfe
 * @property {Number} nr_caixa
 * @property {String} nm_destinatario
 * @property {Number} vl_desconto
 * @property {String} vl_mercadoria
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
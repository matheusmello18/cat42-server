/**
 * Modulo AcC700
 * 
 * @module model/AcC700
 */

const Oracle = require('../Oracle');

/**
 * Classe de AcC700Saida
 * 
 * @constructor
 */
var AcC700Saida = function(){
	if(!(this instanceof AcC700Saida))
		return new AcC700Saida();
};
 
 /**
	* Função inserir os dados do AcC700Saida 
	* 
	* @param {dataAcC700Saida} dataAcC700Saida
	* @returns {Promise} Promrise<Result<T>>
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
	*/
	var AcC700Entrada = function(){
		if(!(this instanceof AcC700Entrada))
			return new AcC700Entrada();
	};
	
	/**
	 * Função inserir os dados do AcC700Entrada 
	 * 
	 * @param {dataAcC700Entrada} dataAcC700Entrada 
	 * @returns {Promise} Promrise<Result<T>>
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
/**
 * Modulo AcC050
 * 
 * @module model/AcC050
 */

const Oracle = require('../Oracle');


/**
 * Classe de AcC050Saida
 * 
 * @constructor
 */
 var AcC050Saida = function(){
  if(!(this instanceof AcC050Saida))
    return new AcC050Saida();
};

/**
 * Função inserir os dados do AcC050
 * 
 * @param {dataAcC050Saida} dataAcC050Saida 
 * @returns {Promise} Promrise<Result<T>>
 */

AcC050Saida.prototype.insert = async (dataAcC050Saida) => {
	let sql = `insert into ac_c050_saida 
						( dm_entrada_saida, id_modelo_documento, id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_pis_st, qtde_bc_pis, id_ref_434, aliq_cofins, vl_bc_cofins, vl_cofins, vl_aliq_cofins, vl_cofins_st, qtde_bc_cofins, id_nota_fiscal_saida, dt_emissao_documento, nr_documento, nr_item, nr_sequencia, serie_subserie_documento, id_empresa, id_usuario) 
						values 
						( :dm_entrada_saida, :id_modelo_documento, :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_pis_st, :qtde_bc_pis, :id_ref_434, :aliq_cofins, :vl_bc_cofins, :vl_cofins, :vl_aliq_cofins, :vl_cofins_st, :qtde_bc_cofins, :id_nota_fiscal_saida, :dt_emissao_documento, :nr_documento, :nr_item, :nr_sequencia, :serie_subserie_documento, :id_empresa, :id_usuario)
						`;
	try {
		return await Oracle.insert(sql, dataAcC050Saida)
	} catch (err) {
		throw new Error(err);
	}
};

/**
 * Função alterar os dados do AcC050
 * 
 * @param {dataAcC050Saida} dataAcC050Saida 
 * @returns {Promise} Promrise<Result<T>>
 */
 AcC050Saida.prototype.update = async (dataAcC050Saida) => {
	let sql = ``;
	try {
		return await Oracle.insert(sql, dataAcC050Saida)
	} catch (err) {
		throw new Error(err);
	}
}

module.exports.AcC050Saida = AcC050Saida;


/**
 * Classe de AcC050Entrada
 * 
 * @constructor
 */
 var AcC050Entrada = function(){
  if(!(this instanceof AcC050Entrada))
    return new AcC050Entrada();
};

/**
 * Função inserir os dados do AcC050
 * 
 * @param {dataAcC050Entrada} dataAcC050Entrada 
 * @returns {Promise} Promrise<Result<T>>
 */

AcC050Entrada.prototype.insert = async (dataAcC050Entrada) => {
	let sql = `insert into ac_c050_entrada 
		( id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_pis_st, qtde_bc_pis, id_ref_434, aliq_cofins, vl_bc_cofins, vl_cofins, vl_aliq_cofins, vl_cofins_st, qtde_bc_cofins, id_nota_fiscal_entrada, dt_emissao_documento, id_pessoa_remetente, nr_documento, nr_item, nr_sequencia, serie_suserie_documento, id_empresa, id_usuario, id_modelo_documento) 
		values 
		( :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_pis_st, :qtde_bc_pis, :id_ref_434, :aliq_cofins, :vl_bc_cofins, :vl_cofins, :vl_aliq_cofins, :vl_cofins_st, :qtde_bc_cofins, :id_nota_fiscal_entrada, :dt_emissao_documento, :id_pessoa_remetente, :nr_documento, :nr_item, :nr_sequencia, :serie_suserie_documento, :id_empresa, :id_usuario, :id_modelo_documento)
	`;
	try {
		return await Oracle.insert(sql, dataAcC050Entrada)
	} catch (err) {
		throw new Error(err);
	}
}

module.exports.AcC050Entrada = AcC050Entrada;


/**
 * teste
 * @typedef {Object} dataAcC050Saida
 * @property {String} dm_entrada_saida 1 - Entrada | 2 - Saída
 * @property {Number} id_modelo_documento Identificador do modelo Documento
 * @property {Number} id_ref_433 Identificador do 433
 * @property {Number} aliq_pis
 * @property {Number} vl_bc_pis
 * @property {Number} vl_pis
 * @property {Number} vl_aliq_pis
 * @property {Number} vl_pis_st
 * @property {Number} qtde_bc_pis
 * @property {Number} id_ref_434
 * @property {Number} aliq_cofins
 * @property {Number} vl_bc_cofins
 * @property {Number} vl_cofins
 * @property {Number} vl_aliq_cofins
 * @property {Number} vl_cofins_st
 * @property {Number} qtde_bc_cofins
 * @property {Number} id_nota_fiscal_saida
 * @property {String} dt_emissao_documento
 * @property {Number|String} nr_documento
 * @property {Number} nr_item
 * @property {Number} nr_sequencia
 * @property {String} serie_subserie_documento
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */

/**
 * @typedef {Object} dataAcC050Entrada
 * @property {String} dm_entrada_saida
 * @property {Number} id_modelo_documento
 * @property {Number} id_ref_433
 * @property {Number} aliq_pis
 * @property {Number} vl_bc_pis
 * @property {Number} vl_pis
 * @property {Number} vl_aliq_pis
 * @property {Number} vl_pis_st
 * @property {Number} qtde_bc_pis
 * @property {Number} id_ref_434
 * @property {Number} aliq_cofins
 * @property {Number} vl_bc_cofins
 * @property {Number} vl_cofins
 * @property {Number} vl_aliq_cofins
 * @property {Number} qtde_bc_cofins
 * @property {Number|String} id_nota_fiscal_saida
 * @property {String} dt_emissao_documento
 * @property {Number} nr_documento
 * @property {Number} nr_item
 * @property {Number} nr_sequencia
 * @property {String} serie_subserie_documento
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */
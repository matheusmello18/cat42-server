/**
 * @module AcC050
 */
const Oracle = require('../Oracle');

/**
 * teste
 * @typedef {Object} AcC050Saida
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
 */

module.exports.Saida = {

	/**
	 * Returns the sum of a and b
	 * @function Saida/insert
	 * @param {AcC050Saida} AcC050Saida
	 * @returns {Promise} xxxxxxxx
	 */
  insert: async (AcC050Saida) => {
    let sql = `insert into ac_c050_saida 
              ( dm_entrada_saida, id_modelo_documento, id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_pis_st, qtde_bc_pis, id_ref_434, aliq_cofins, vl_bc_cofins, vl_cofins, vl_aliq_cofins, vl_cofins_st, qtde_bc_cofins, id_nota_fiscal_saida, dt_emissao_documento, nr_documento, nr_item, nr_sequencia, serie_subserie_documento, id_empresa, id_usuario) 
              values 
              ( :dm_entrada_saida, :id_modelo_documento, :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_pis_st, :qtde_bc_pis, :id_ref_434, :aliq_cofins, :vl_bc_cofins, :vl_cofins, :vl_aliq_cofins, :vl_cofins_st, :qtde_bc_cofins, :id_nota_fiscal_saida, :dt_emissao_documento, :nr_documento, :nr_item, :nr_sequencia, :serie_subserie_documento, :id_empresa, :id_usuario)
              `;
    try {
      return await Oracle.insert(sql, AcC050Saida)
    } catch (err) {
      throw new Error(err);
    }
  },

	/**
	 * Returns the sum of a and b
	 * @function Saida/update
	 * @param {AcC050Saida} AcC050Saida
	 * @returns {Promise}
	 */
	 update: async (AcC050Saida) => {
    let sql = ``;
    try {
      return await Oracle.insert(sql, AcC050Saida)
    } catch (err) {
      throw new Error(err);
    }
  }
}

/**
 * @typedef {Object} AcC050Entrada
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
 */

module.exports.Entrada = {
	/**
	 * Returns xxxxxxx
	 * @function Entrada/insert
	 * @param {AcC050Entrada} AcC050Entrada
	 * @returns {Promise}
	 */
  insert: async (AcC050Entrada) => {
    let sql = `insert into ac_c050_entrada 
              ( id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_pis_st, qtde_bc_pis, id_ref_434, aliq_cofins, vl_bc_cofins, vl_cofins, vl_aliq_cofins, vl_cofins_st, qtde_bc_cofins, id_nota_fiscal_entrada, dt_emissao_documento, id_pessoa_remetente, nr_documento, nr_item, nr_sequencia, serie_suserie_documento, id_empresa, id_usuario, id_modelo_documento) 
              values 
              ( :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_pis_st, :qtde_bc_pis, :id_ref_434, :aliq_cofins, :vl_bc_cofins, :vl_cofins, :vl_aliq_cofins, :vl_cofins_st, :qtde_bc_cofins, :id_nota_fiscal_entrada, :dt_emissao_documento, :id_pessoa_remetente, :nr_documento, :nr_item, :nr_sequencia, :serie_suserie_documento, :id_empresa, :id_usuario, :id_modelo_documento)
              `;
    try {
      await Oracle.insert(sql, AcC050Entrada)
    } catch (err) {
      throw new Error(err);
    }
  }
}

/** require('./model').AcC050.Entrada.insert
	AcC050.Entrada.insert({
		id_ref_433:'',
		aliq_pis:'',
		vl_bc_pis:'',
		vl_pis:'',
		vl_aliq_pis:'',
		vl_pis_st:'',
		qtde_bc_pis:'',
		id_ref_434:'',
		aliq_cofins:'',
		vl_bc_cofins:'',
		vl_cofins:'',
		vl_aliq_cofins:'',
		vl_cofins_st:'',
		qtde_bc_cofins:'',
		id_nota_fiscal_entrada:'',
		dt_emissao_documento:'',
		id_pessoa_remetente:'',
		nr_documento:'',
		nr_item:'',
		nr_sequencia:'',
		serie_suserie_documento:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario,
		id_modelo_documento:''
	})
*/

/** require('./model').AcC050.Saida.insert
	AcC050.Saida.insert({
		dm_entrada_saida:'',
		id_modelo_documento:'',
		id_ref_433:'',
		aliq_pis:'',
		vl_bc_pis:'',
		vl_pis:'',
		vl_aliq_pis:'',
		vl_pis_st:'',
		qtde_bc_pis:'',
		id_ref_434:'',
		aliq_cofins:'',
		vl_bc_cofins:'',
		vl_cofins:'',
		vl_aliq_cofins:'',
		vl_cofins_st:'',
		qtde_bc_cofins:'',
		id_nota_fiscal_saida:'',
		dt_emissao_documento:'',
		nr_documento:'',
		nr_item:'',
		nr_sequencia:'',
		serie_subserie_documento:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/
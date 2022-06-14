/**
 * Modulo SfC850
 * 
 * @module model/SfC850
 * @example
 * const model = require('./model');
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de SfC850
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const SfC850 = new model.SfC800.SfC850();
  */
 var SfC850 = function(){
   if(!(this instanceof SfC850))
     return new SfC850();
 };
  
  /**
   * Função buscar os dados do SfC850 por código modelo documetno
   * 
   * @param {dataSfC850} dataSfC850
   * @returns {Promise} Promise
   * @example
   * var dataSfC850 = {
   *   nr_item: 1,
   *   dt_documento: '',
   *   nr_cfe: '',
   *   id_ref_413: 0,
   *   nr_serie_sat: '',
   *   cd_fiscal_operacao: '',
   *   id_produto_servico: 0,
   *   vl_total_item: 0,
   *   id_0460: 0,
   *   id_ref_431: 0,
   *   aliq_icms: 0,
   *   vl_bc_icms: 0,
   *   vl_icms: 0,
   *   id_ref_433: 0,
   *   aliq_pis: 0,
   *   vl_bc_pis: 0,
   *   vl_pis: 0,
   *   vl_aliq_pis: 0,
   *   vl_qtde_bc_pis: 0,
   *   id_ref_434: 0,
   *   vl_bc_cofins: 0,
   *   aliq_cofins: 0,
   *   vl_cofins: 0,
   *   vl_aliq_cofins: 0,
   *   vl_qtde_bc_cofins: 0,
   *   vl_desconto: 0,
   *   vl_outras_desp: 0,
   *   qtde: 0,
   *   vl_unitario: 0,
   *   id_empresa: 1,
   *   id_usuario: 1
   * }
   * 
   * await SfC850.insert(dataSfC850);
   * 
   * ou
   *
   * const data = await SfC850.insert(dataSfC850).then((e) => {
   *    return e;
   * }).catch((err) => {
   *    throw new Error('Erro ao inserir o registro.');
   * })
   */
  
  SfC850.prototype.insert = async (dataSfC850) => {
		let sql = `insert into sf_c850 
							( nr_item, dt_documento, nr_cfe, id_ref_413, nr_serie_sat, cd_fiscal_operacao, id_produto_servico, vl_total_item, id_0460, id_ref_431, aliq_icms, vl_bc_icms, vl_icms, id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_qtde_bc_pis, id_ref_434, vl_bc_cofins, aliq_cofins, vl_cofins, vl_aliq_cofins, vl_qtde_bc_cofins, vl_desconto, vl_outras_desp, qtde, vl_unitario, id_empresa, id_usuario) 
							values 
							( :nr_item, :dt_documento, :nr_cfe, :id_ref_413, :nr_serie_sat, :cd_fiscal_operacao, :id_produto_servico, :vl_total_item, :id_0460, :id_ref_431, :aliq_icms, :vl_bc_icms, :vl_icms, :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_qtde_bc_pis, :id_ref_434, :vl_bc_cofins, :aliq_cofins, :vl_cofins, :vl_aliq_cofins, :vl_qtde_bc_cofins, :vl_desconto, :vl_outras_desp, :qtde, :vl_unitario, :id_empresa, :id_usuario)
							`;
		try {
			await Oracle.insert(sql, dataSfC850)
		} catch (err) {
			throw new Error(err);
		}
	}

module.exports.SfC850 = SfC850;

/**
 * Campos da Tabela SfC850
 * 
 * @typedef {Object} dataSfC850
 * @property {Number} nr_item
 * @property {String} dt_documento
 * @property {Number} nr_cfe
 * @property {String} id_ref_413
 * @property {Number} nr_serie_sat
 * @property {Number} cd_fiscal_operacao
 * @property {String} id_produto_servico
 * @property {Number} vl_total_item
 * @property {String} id_0460
 * @property {String} id_ref_431
 * @property {Number} aliq_icms
 * @property {Number} vl_bc_icms
 * @property {Number} vl_icms
 * @property {Number} id_ref_433
 * @property {Number} aliq_pis
 * @property {Number} vl_bc_pis
 * @property {Number} vl_pis
 * @property {Number} vl_aliq_pis
 * @property {Number} vl_qtde_bc_pis
 * @property {Number} id_ref_434
 * @property {Number} vl_bc_cofins
 * @property {Number} aliq_cofins
 * @property {Number} vl_cofins
 * @property {Number} vl_aliq_cofins
 * @property {Number} vl_qtde_bc_cofins
 * @property {Number} qtde
 * @property {Number} vl_unitario
 * @property {Number} vl_outras_desp
 * @property {Number} vl_desconto
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */
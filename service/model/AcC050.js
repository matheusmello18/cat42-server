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
 * @example
 * const model = require('./model');
 * const acC050Saida = new model.NotaFiscal.Saida().Item().AcC050();
 */
var AcC050Saida = function(){
  if(!(this instanceof AcC050Saida))
    return new AcC050Saida();
};

/**
 * Função inserir os dados do AcC050 Saida
 * 
 * @param {dataAcC050Saida} dataAcC050Saida 
 * @returns {Promise} Promise
 * @example
 * var dataAcC050Saida = {
 * 	 dm_entrada_saida: '1',
 *   id_modelo_documento: 1,
 *   id_ref_433: 30,
 *   aliq_pis: 0,
 *   vl_bc_pis: 0,
 *   vl_pis: 0,
 *   vl_aliq_pis: 0,
 *   vl_pis_st: 0,
 *   qtde_bc_pis: 0,
 *   id_ref_434: 1,
 *   aliq_cofins: 0,
 *   vl_bc_cofins: 0,
 *   vl_cofins: 0,
 *   vl_aliq_cofins: 0,
 *   vl_cofins_st: 0,
 *   qtde_bc_cofins: 0,
 *   id_nota_fiscal_saida: null,
 *   dt_emissao_documento: '',
 *   nr_documento: '0',
 *   nr_item: 1,
 *   nr_sequencia: 1,
 *   serie_subserie_documento: '0',
 *   id_empresa: 1,
 *   id_usuario: 0,
 * }
 * const rows = (await acC050Saida.insert(dataAcC050Saida)).rows;
 * 
 * ou
 *
 * const rows = await acC050Saida.insert(dataAcC050Saida).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro ACC050 Saida')
 * })
 */

AcC050Saida.prototype.insert = async (dataAcC050Saida) => {
	let sql = `insert into ac_c050_saida 
						( dm_entrada_saida, id_modelo_documento, id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_pis_st, qtde_bc_pis, id_ref_434, aliq_cofins, vl_bc_cofins, vl_cofins, vl_aliq_cofins, vl_cofins_st, qtde_bc_cofins, id_nota_fiscal_saida, dt_emissao_documento, nr_documento, nr_item, nr_sequencia, serie_subserie_documento, id_empresa, id_usuario) 
						values 
						( :dm_entrada_saida, :id_modelo_documento, :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_pis_st, :qtde_bc_pis, :id_ref_434, :aliq_cofins, :vl_bc_cofins, :vl_cofins, :vl_aliq_cofins, :vl_cofins_st, :qtde_bc_cofins, :id_nota_fiscal_saida, to_date(:dt_emissao_documento, 'dd/mm/yyyy'), :nr_documento, :nr_item, :nr_sequencia, :serie_subserie_documento, :id_empresa, :id_usuario)
						`;
	try {
		return await Oracle.insert(sql, dataAcC050Saida)
	} catch (err) {
		throw new Error(err);
	}
};

/**
 * Função alterar os dados do AcC050 Saida
 * 
 * @param {dataAcC050Saida} dataAcC050Saida 
 * @returns {Promise} Promise
 * @example
 * var dataAcC050Saida = {
 * 	 dm_entrada_saida: '1',
 *   id_modelo_documento: 1,
 *   id_ref_433: 30,
 *   aliq_pis: 0,
 *   vl_bc_pis: 0,
 *   vl_pis: 0,
 *   vl_aliq_pis: 0,
 *   vl_pis_st: 0,
 *   qtde_bc_pis: 0,
 *   id_ref_434: 1,
 *   aliq_cofins: 0,
 *   vl_bc_cofins: 0,
 *   vl_cofins: 0,
 *   vl_aliq_cofins: 0,
 *   vl_cofins_st: 0,
 *   qtde_bc_cofins: 0,
 *   id_nota_fiscal_saida: 1,
 *   dt_emissao_documento: '',
 *   nr_documento: '0',
 *   nr_item: 1,
 *   nr_sequencia: 1,
 *   serie_subserie_documento: '0',
 *   id_empresa: 1,
 *   id_usuario: 0,
 * }
 * const rows = (await acC050Saida.update(dataAcC050Saida)).rows;
 * 
 * ou
 *
 * const rows = await acC050Saida.update(dataAcC050Saida).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error('Erro ao alterar o registro ACC050 Saida')
 * })
 */
 AcC050Saida.prototype.update = async (dataAcC050Saida) => {
	let sql = ``;
	try {
		return await Oracle.insert(sql, dataAcC050Saida)
	} catch (err) {
		throw new Error(err);
	}
}

/**
 * Deletar C050 Saida atraves da chave do C100 Saida
 *
 * @param {chaveC100Saida} chaveC100Saida 
 * @return {Promise} Promise
 * @example
 * var chaveC100Entrada = {
 *   dm_entrada_saida: 0,
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   id_empresa: 1
 * }
 * await acC050Saida.delete(chaveC100Saida);
 * 
 * ou
 *
 * const data = await acC050Saida.delete(chaveC100Saida).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar registro no AcC050 Saida');
 * })
 */

 AcC050Saida.prototype.delete = async (chaveC100Saida) => {
  let sql = `
  delete ac_c050_saida
  where nvl(trim(serie_subserie_documento),0) = nvl(trim(:serie_subserie_documento),0)
    and id_pessoa_remetente  = :id_pessoa_remetente
    and to_char(dt_emissao_documento,'dd/mm/yyyy') = :dt_emissao_documento
    and nr_documento         = :nr_documento
    and id_modelo_documento  = :id_modelo_documento
    and id_empresa           = :id_empresa
  `;

  try {
    return await Oracle.delete(sql, chaveC100Saida);
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.AcC050Saida = AcC050Saida;

/**
 * Classe de AcC050Entrada
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const acC050Entrada = new model.NotaFiscal.Entrada().Item().AcC050();
 */
 var AcC050Entrada = function(){
  if(!(this instanceof AcC050Entrada))
    return new AcC050Entrada();
};

/**
 * Função inserir os dados do AcC050 Entrada
 * 
 * @param {dataAcC050Entrada} dataAcC050Entrada 
 * @returns {Promise} Promise
 * @example
 * var dataAcC050Entrada = {
 *   id_modelo_documento: 1,
 *   id_ref_433: 30,
 *   aliq_pis: 0,
 *   vl_bc_pis: 0,
 *   vl_pis: 0,
 *   vl_aliq_pis: 0,
 *   vl_pis_st: 0,
 *   qtde_bc_pis: 0,
 *   id_ref_434: 1,
 *   aliq_cofins: 0,
 *   vl_bc_cofins: 0,
 *   vl_cofins: 0,
 *   vl_aliq_cofins: 0,
 *   vl_cofins_st: 0,
 *   qtde_bc_cofins: 0,
 *   id_nota_fiscal_entrada: 1,
 *   id_pessoa_remetente: 2,
 *   dt_emissao_documento: '',
 *   nr_documento: '0',
 *   nr_item: 1,
 *   nr_sequencia: 1,
 *   serie_subserie_documento: '0',
 *   id_empresa: 1,
 *   id_usuario: 0,
 * }
 * const rows = (await acC050Entrada.insert(dataAcC050Entrada)).rows;
 * 
 * ou
 *
 * const rows = await acC050Entrada.insert(dataAcC050Entrada).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro ACC050 Entrada')
 * })
 */

AcC050Entrada.prototype.insert = async (dataAcC050Entrada) => {
	let sql = `insert into ac_c050_entrada 
		( id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_pis_st, qtde_bc_pis, id_ref_434, aliq_cofins, vl_bc_cofins, 
			vl_cofins, vl_aliq_cofins, vl_cofins_st, qtde_bc_cofins, id_nota_fiscal_entrada, dt_emissao_documento, id_pessoa_remetente, 
			nr_documento, nr_item, nr_sequencia, serie_suserie_documento, id_empresa, id_usuario, id_modelo_documento) 
		values 
		( :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_pis_st, :qtde_bc_pis, :id_ref_434, :aliq_cofins, :vl_bc_cofins, :vl_cofins, :vl_aliq_cofins, :vl_cofins_st, :qtde_bc_cofins, :id_nota_fiscal_entrada, to_date(:dt_emissao_documento, 'dd/mm/yyyy'), :id_pessoa_remetente, :nr_documento, :nr_item, :nr_sequencia, :serie_suserie_documento, :id_empresa, :id_usuario, :id_modelo_documento)
	`;
	try {
		return await Oracle.insert(sql, dataAcC050Entrada)
	} catch (err) {
		throw new Error(err);
	}
}

/**
 * Deletar C050 Entrada atraves da chave do C100 Entada
 * 
 * @param {chaveC100Entrada} chaveC100Entrada 
 * @returns {Promise} Promise
 * @example
 * var chaveC100Entrada = {
 *   id_modelo_documento: 0,
 *   serie_suserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   id_pessoa_remetente: 0
 * }
 * await acC050Entrada.delete(chaveC100Entrada);
 * 
 * ou
 *
 * const data = await acC050Entrada.delete(chaveC100Entrada).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar registro no AcC050 Entrada');
 * })
 */
 AcC050Entrada.prototype.delete = async (chaveC100Entrada) => {
  let sql = `delete ac_c050_entrada
              where nvl(trim(serie_suserie_documento),0) = nvl(trim(:serie_suserie_documento),0)
                and id_pessoa_remetente  = :id_pessoa_remetente
                and to_char(dt_emissao_documento,'dd/mm/yyyy') = :dt_emissao_documento
                and nr_documento         = :nr_documento
                and id_modelo_documento  = :id_modelo_documento
                and id_empresa           = :id_empresa
            `;
  try {
    await Oracle.insert(sql, chaveC100Entrada)
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.AcC050Entrada = AcC050Entrada;

/**
 * Campos da Chave da Tabela Nota Fiscal de Saída
 * 
 * @typedef {Object} chaveC100Saida
 * @property {String} dm_entrada_saida 1 - Entrada | 2 - Saída
 * @property {String} nr_documento Número do Documento
 * @property {String} serie_subserie_documento Numero de Série
 * @property {String} dt_emissao_documento Data da emissão do documento
 * @property {Number} id_empresa Identificação da Empresa
 * @global
 */

/**
 * Campos da Tabela AcC050Saida
 * 
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
 * Campos da Chave da Tabela Nota Fiscal de Entrada
 * 
 * @typedef {Object} chaveC100Entrada
 * @property {String} nr_documento Número do Documento
 * @property {String} serie_suserie_documento Numero de Série
 * @property {String} dt_emissao_documento Data da emissão do documento
 * @property {Number} id_modelo_documento Identificação do Modelo Documento
 * @property {Number} id_pessoa_remetente Identificação da Pessoa Remetente
 * @property {Number} id_empresa Identificação da Empresa
 * @global
 */

/**
 * Campos da Tabela AcC050Entrada
 * 
 * @typedef {Object} dataAcC050Entrada
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
 * @property {Number|String} id_nota_fiscal_entrada
 * @property {Number} id_pessoa_remetente
 * @property {String} dt_emissao_documento
 * @property {Number} nr_documento
 * @property {Number} nr_item
 * @property {Number} nr_sequencia
 * @property {String} serie_subserie_documento
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */
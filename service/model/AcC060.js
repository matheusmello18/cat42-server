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
	* @example
	* const model = require('./model');
	* const acC060Entrada = new model.NotaFiscal.Entrada().AcC060();
	*/
var AcC060Entrada = function(){
  if(!(this instanceof AcC060Entrada))
    return new AcC060Entrada();
};
 
 /**
	* Função inserir os dados do AcC060 Entrada 
	* 
	* @param {dataAcC060Entrada} dataAcC060Entrada 
	* @returns {Promise} Promise
	* @example
	* var dataAcC060Entrada = {
	*   dm_importacao: '',
	*   nr_di: '3',
	*   dt_registro: 0,
	*   dt_desembaraco: 0,
	*   vl_pis: 0,
	*   vl_cofins: 0,
	*   id_nota_fiscal_entrada: 1,
	*   id_pessoa_remetente: 2,
	*   dt_emissao_documento: '',
	*   nr_documento: '0',
	*   nr_item: 1,
	*   nr_sequencia: 1,
	*   serie_subserie_documento: '0',
	*   id_empresa: 1,
	*   id_usuario: 0,
  *   id_modelo_documento: 1
	* }
	* const rows = (await acC060Entrada.insert(dataAcC060Entrada)).rows;
	* 
	* ou
	*
	* const rows = await acC060Entrada.insert(dataAcC060Entrada).then((e) => {
	*    return e.rows;
	* }).catch((err) => {
	*    throw new Error('Erro ao inserir o registro ACC060 Entrada')
	* })
	*/
 
AcC060Entrada.prototype.insert = async (dataAcC060Entrada) => {
	let sql = `insert into ac_c060_entrada 
						( dm_importacao, nr_di, dt_registro, dt_desembaraco, vl_pis, vl_cofins, id_nota_fiscal_entrada, id_pessoa_remetente, dt_emissao_documento, nr_documento, nr_item, nr_sequencia, serie_subserie_documento, id_empresa, id_usuario, id_modelo_documento) 
						values 
						( :dm_importacao, :nr_di, to_date(:dt_registro, 'dd/mm/yyyy'), to_date(:dt_desembaraco, 'dd/mm/yyyy'), :vl_pis, :vl_cofins, :id_nota_fiscal_entrada, :id_pessoa_remetente, to_date(:dt_emissao_documento, 'dd/mm/yyyy'), :nr_documento, :nr_item, :nr_sequencia, :serie_subserie_documento, :id_empresa, :id_usuario, :id_modelo_documento)
						`;
	try {
		return await Oracle.insert(sql, dataAcC060Entrada)
	} catch (err) {
		throw new Error(err);
	}
}

/**
 * Deletar C060 Entrada atraves da chave do C100 Entada
 *
 * @param {chaveC100Entrada} chaveC100Entrada 
 * @return {Promise} Promise
 * @example
 * var chaveC100Entrada = {
 *   id_modelo_documento: 0,
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   id_pessoa_remetente: 0,
 *   id_empresa: 1
 * }
 * await acC060Entrada.delete(chaveC100Entrada);
 * 
 * ou
 *
 * const data = await acC060Entrada.delete(chaveC100Entrada).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar registro no AcC060');
 * })
 */

 AcC060Entrada.prototype.delete = async (chaveC100Entrada) => {
  let sql = `
  delete ac_c060_entrada
  where nvl(trim(serie_subserie_documento),0) = nvl(trim(:serie_subserie_documento),0)
    and id_pessoa_remetente  = :id_pessoa_remetente
    and to_char(dt_emissao_documento,'dd/mm/yyyy') = :dt_emissao_documento
    and nr_documento         = :nr_documento
    and id_modelo_documento  = :id_modelo_documento
    and id_empresa           = :id_empresa
  `;

  try {
    return await Oracle.delete(sql, chaveC100Entrada);
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
 * @property {String} dt_registro
 * @property {String} dt_desembaraco
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

/**
 * Campos da Chave da Tabela Nota Fiscal de Entrada
 * 
 * @typedef {Object} chaveC100Entrada
 * @property {Number} nr_documento Número do Documento
 * @property {String} serie_subserie_documento Numero de Série
 * @property {String} dt_emissao_documento Data da emissão do documento
 * @property {Number} id_modelo_documento Identificação do Modelo Documento
 * @property {Number} id_pessoa_remetente Identificação da Pessoa Remetente
 * @property {Number} id_empresa Identificação da Empresa
 * @global
 */
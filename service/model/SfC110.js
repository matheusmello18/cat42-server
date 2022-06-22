/**
 * Modulo SfC110
 * 
 * @module model/SfC110
 */

const Oracle = require('../Oracle');

/**
 * Classe SfC110 para Saída
 * 
 * @class SfC110
 * @constructor
 * @example
 * const model = require('./model');
 * const SfC110Saida = new model.NotaFiscal.Saida().SfC110();
 */
var SfC110Saida = function(){
  if (!(this instanceof SfC110Saida))
    return new SfC110Saida();
};

/**
 * Inserir o C110 Saída
 * 
 * @param {paramSfC110Saida} paramSfC110Saida
 * @return {Promise} Promise
 * @example
 * var paramSfC110Saida = {
 *   id_modelo_documento: 0,
 *   dm_entrada_saida: '',
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   nr_item_imp: 0,
 *   id_ref_0450: 0,
 *   ds_complementar: '',
 *   id_empresa: 1,
 *   id_usuario: 1
 * }
 * 
 * await SfC110Saida.insert(paramSfC110Saida);
 * 
 * ou
 *
 * const data = await SfC110Saida.insert(paramSfC110Saida).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */

SfC110Saida.prototype.insert = async (paramSfC110Saida) => {
  let sql = `insert into sf_c110_saida 
    ( id_modelo_documento, dm_entrada_saida, serie_subserie_documento, nr_documento, dt_emissao_documento, nr_item_imp, id_ref_0450, ds_complementar, id_empresa, id_usuario) 
    values 
    ( :id_modelo_documento, :dm_entrada_saida, :serie_subserie_documento, :nr_documento, to_date(:dt_emissao_documento, 'dd/mm/yyyy'), :nr_item_imp, :id_ref_0450, :ds_complementar, :id_empresa, :id_usuario)
    `;
  try {
    return await Oracle.insert(sql, {
      ...paramSfC110Saida.chaveC100Saida,
      ...paramSfC110Saida.camposC110Saida
    })
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Deletar C110 Saída atraves da chave do C100 Saída
 *
 * @param {chaveC100Saida} chaveC100Saida 
 * @return {Promise} Promise
 * @example
 * var chaveC100Saida = {
 *   dm_entrada_saida: '',
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   id_empresa: 1
 * }
 * 
 * await SfC110Saida.delete(chaveC100Saida);
 * 
 * ou
 *
 * const data = await SfC110Saida.delete(chaveC100Saida).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar o registro SFC195.');
 * })
 */

 SfC110Saida.prototype.delete = async (chaveC100Saida) => {
 let sql = `
   DELETE SF_C110_SAIDA
    WHERE ID_NOTA_FISCAL_SAIDA IN (
           SELECT ID_NOTA_FISCAL_SAIDA
             FROM IN_NOTA_FISCAL_SAIDA
            WHERE DM_ENTRADA_SAIDA                      = :dm_entrada_saida
              AND (NVL(TRIM(SERIE_SUBSERIE_DOCUMENTO),0) = NVL(TRIM(:serie_subserie_documento),0)
               OR F_STRZERO(NVL(SERIE_SUBSERIE_DOCUMENTO, '0'), 3) = F_STRZERO(NVL(:serie_subserie_documento, '0'), 3))
              AND NR_DOCUMENTO                          = :nr_documento
              and to_char(dt_emissao_documento,'dd/mm/yyyy') = :dt_emissao_documento
              AND ID_EMPRESA                            = :id_empresa)
 `;

 try {
   return await Oracle.delete(sql, chaveC100Saida);
 } catch (err) {
   throw new Error(err);
 }
};

module.exports.SfC110Saida = SfC110Saida;

/**
 * Campos Chave SFC110 Saída
 * 
 * @typedef {Object} chaveC100Saida
 * @property {String} dm_entrada_saida 1 - Entrada | 2 - Saída
 * @property {Number} nr_documento Número do Documento
 * @property {String} serie_subserie_documento Série e Subserie
 * @property {String} dt_emissao_documento Data da emissão do documento
 * @property {Number} id_empresa Identificação da Empresa
 * @global
 */

/**
 * Campos SFC110 Saída
 * 
 * @typedef {Object} camposC110Saida
 * @property {number} id_modelo_documento 
 * @property {String} nr_item_imp
 * @property {number} id_ref_0450
 * @property {String} ds_complementar
 * @property {number} id_usuario
 * @global
 */

/**
 * Tabela SFC110 Saída
 * 
 * @typedef {Object} paramSfC110Saida
 * @property {chaveC100Saida} chaveC100Saida
 * @property {camposC110Saida} camposC110Saida
 * @global
 */


/**
 * Classe SfC110 para Entrada
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const SfC110Entrada = new model.NotaFiscal.Entrada().SfC110();
 */
var SfC110Entrada = function() {
  if(!(this instanceof SfC110Entrada))
    return new SfC110Entrada();
}

/**
 * Inserir o C110 Entrada
 * 
 * @param {paramSfC110Entrada} paramSfC110Entrada
 * @return {Promise} Promise
 * @example
 * var paramSfC110Entrada = {
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   id_pessoa_remetente: 0,
 *   nr_item_imp: 0,
 *   id_ref_0450: 0,
 *   ds_complementar: '',
 *   id_empresa: 1,
 *   id_usuario: 1,
 *   id_modelo_documento: 0
 * }
 * 
 * await SfC110Entrada.insert(paramSfC110Entrada);
 * 
 * ou
 *
 * const data = await SfC110Entrada.insert(paramSfC110Entrada).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
 SfC110Entrada.prototype.insert = async (paramSfC110Entrada) => {
  let sql = `insert into sf_c110_entrada 
    ( serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, nr_item_imp, id_ref_0450, ds_complementar, id_empresa, id_usuario, id_modelo_documento) 
    values 
    ( :serie_subserie_documento, :nr_documento, to_date(:dt_emissao_documento, 'dd/mm/yyyy'), :id_pessoa_remetente, :nr_item_imp, :id_ref_0450, :ds_complementar, :id_empresa, :id_usuario, :id_modelo_documento)
    `;
  try {
    await Oracle.insert(sql, {
      ...paramSfC110Entrada.chaveC100Entrada,
      ...paramSfC110Entrada.camposC110Entrada
    })
  } catch (err) {
    throw new Error(err);
  }
};


/**
 * Deletar C110 Entrada atraves da chave do C100 Entrada
 *
 * @param {chaveC100Entrada} chaveC100Entrada 
 * @return {Promise} Promise
 * @example
 * var chaveC100Entrada = {
 *   id_modelo_documento: 0,
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   id_pessoa_remetente: 0
 * }
 * await SfC110Entrada.delete(chaveC100Entrada);
 * 
 * ou
 *
 * const data = await SfC110Entrada.delete(chaveC100Entrada).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar registro no SFC110 Entrada');
 * })
 */

SfC110Entrada.prototype.delete = async (chaveC100Entrada) => {
  let sql = `
  delete sf_c110_entrada
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

module.exports.SfC110Entrada = SfC110Entrada;

/**
 * Campos Chave SFC110 Entrada
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

/**
 * Campos SFC110 Entrada
 * 
 * @typedef {Object} camposC110Entrada
 * @property {number} id_modelo_documento 
 * @property {String} nr_item_imp
 * @property {number} id_ref_0450
 * @property {String} ds_complementar
 * @property {number} id_usuario
 * @global
 */

/**
 * Tabela SFC110 Entrada
 * 
 * @typedef {Object} paramSfC110Entrada
 * @property {chaveC100Entrada} chaveC100Entrada
 * @property {camposC110Entrada} camposC110Entrada
 * @global
 */
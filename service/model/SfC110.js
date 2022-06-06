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
 */
var SfC110Saida = function(){
  if (!(this instanceof SfC110Saida))
    return new SfC110Saida();
};

/**
 * Inserir o C110 Saída
 * 
 * @param {paramSfC110Saida} paramSfC110Saida
 * @return {Promise} Promrise<Result<T>>
 */
 SfC110Saida.prototype.insert = async (paramSfC110Saida) => {
  let sql = `insert into sf_c110_saida 
    ( id_modelo_documento, dm_entrada_saida, serie_subserie_documento, nr_documento, dt_emissao_documento, nr_item_imp, id_ref_0450, ds_complementar, id_empresa, id_usuario) 
    values 
    ( :id_modelo_documento, :dm_entrada_saida, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :nr_item_imp, :id_ref_0450, :ds_complementar, :id_empresa, :id_usuario)
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
 * @return {Promise} Promrise<Result<T>>
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
              AND DT_EMISSAO_DOCUMENTO                  = :dt_emissao_documento
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
 * @property {String} nr_documento Número do Documento
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
 */
var SfC110Entrada = function() {
  if(!(this instanceof SfC110Entrada))
    return new SfC110Entrada();
}

/**
 * Inserir o C110 Entrada
 * 
 * @param {paramSfC110Entrada} paramSfC110Entrada
 * @return {Promise} Promrise<Result<T>>
 */
 SfC110Entrada.prototype.insert = async (paramSfC110Entrada) => {
  let sql = `insert into sf_c110_entrada 
    ( serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, nr_item_imp, id_ref_0450, ds_complementar, id_empresa, id_usuario, id_modelo_documento) 
    values 
    ( :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_pessoa_remetente, :nr_item_imp, :id_ref_0450, :ds_complementar, :id_empresa, :id_usuario, :id_modelo_documento)
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
 * Deletar C110 Entrada atraves da chave do C100 Entada
 *
 * @param {chaveC100Entrada} chaveC100Entrada 
 * @return {Promise} Promrise<Result<T>>
 */

 SfC110Entrada.prototype.delete = async (chaveC100Entrada) => {
  let sql = `

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
 * @property {Number} id_pessoa_remetente Pessoa Remetente
 * @property {String} nr_documento Número do Documento
 * @property {String} serie_subserie_documento Série e Subserie
 * @property {String} dt_emissao_documento Data da emissão do documento
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
/**
 * @module SfC110
 */
const Oracle = require('../Oracle');

/**
 * Campos Chave SFC110 Saída
 * @typedef {Object} chaveC100Saida
 * @property {String} dm_entrada_saida 1 - Entrada | 2 - Saída
 * @property {String} nr_documento Número do Documento
 * @property {String} serie_subserie_documento Série e Subserie
 * @property {String} dt_emissao_documento Data da emissão do documento
 * @property {Number} id_empresa Identificação da Empresa
 */

/**
 * Campos SFC110 Saída
 * @typedef {Object} camposC110Saida
 * @property {number} id_modelo_documento 
 * @property {String} nr_item_imp
 * @property {number} id_ref_0450
 * @property {String} ds_complementar
 * @property {number} id_usuario
 */

/**
 * Tabela SFC110 Saída
 * @typedef {Object} SfC110Saida
 * @property {chaveC100Saida} chaveC100Saida
 * @property {camposC110Saida} camposC110Saida
 */

/**
 * Modulo SfC110
 * @typedef {Object} SfC110.Saida.insert
 * @function
 * @property {camposC110Saida} camposC110Saida
 */
module.exports.Saida = {
  /**
   * Inserir o C110 Saída
   * @param {SfC110Saida} SfC110Saida 
   * @return {Promise} Promrise<Result<T>>
   */
  insert: async (SfC110Saida) => {
    let sql = `insert into sf_c110_saida 
              ( id_modelo_documento, dm_entrada_saida, serie_subserie_documento, nr_documento, dt_emissao_documento, nr_item_imp, id_ref_0450, ds_complementar, id_empresa, id_usuario) 
              values 
              ( :id_modelo_documento, :dm_entrada_saida, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :nr_item_imp, :id_ref_0450, :ds_complementar, :id_empresa, :id_usuario)
              `;
    try {
      return await Oracle.insert(sql, {
        ...SfC110Saida.chaveC100Saida,
        ...SfC110Saida.camposC110Saida
      })
    } catch (err) {
      throw new Error(err);
    }
  },
  /**
   * Deletar C110 Saída atraves da chave do C100 Saída
   * @param {chaveC100Saida} chaveC100Saida 
   * @return {Promise} Promrise<Result<T>>
   */
  delete: async (chaveC100Saida) => {
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
  },
}

module.exports.Entrada = {
  insert: async (SfC110Entrada = {}) => {
    let sql = `insert into sf_c110_entrada 
              ( serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, nr_item_imp, id_ref_0450, ds_complementar, id_empresa, id_usuario, id_modelo_documento) 
              values 
              ( :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_pessoa_remetente, :nr_item_imp, :id_ref_0450, :ds_complementar, :id_empresa, :id_usuario, :id_modelo_documento)
              `;
    try {
      await Oracle.insert(sql, SfC110Entrada)
    } catch (err) {
      throw new Error(err);
    }
  },
  /**
		 * 
		 * @typedef {Object} chaveC100Entrada
 		 * @property {String} dm_entrada_saida 1 - Entrada | 2 - Saída
 		 * @property {Number} id_modelo_documento Identificador do modelo Documento
		 * @property {String} nr_documento Número do Documento
		 * @property {String} dt_emissao_documento Data da emissão do documento
		 * @property {Number} id_empresa Identificação da Empresa
		 * @param {chaveC100Entrada} chaveC100Entrada
		 */
   delete: async (chaveC100Entrada) => {
    let sql = `

    `;

    try {
      return await Oracle.delete(sql, chaveC100Entrada);
    } catch (err) {
      throw new Error(err);
    }
  },
}

/** require('./model').SfC110.Saida.insert
	SfC110.Saida.insert({
		id_modelo_documento:'',
		dm_entrada_saida:'',
		serie_subserie_documento:'',
		nr_documento:'',
		dt_emissao_documento:'',
		nr_item_imp:'',
		id_ref_0450:'',
		ds_complementar:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/

/** require('./model').SfC110.Entrada.insert
	SfC110.Entrada.insert({
		serie_subserie_documento:'',
		nr_documento:'',
		dt_emissao_documento:'',
		id_pessoa_remetente:'',
		nr_item_imp:'',
		id_ref_0450:'',
		ds_complementar:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario,
		id_modelo_documento:''
	})
*/
/**
 * Modulo Nota Fiscal
 * 
 * @module model/NotaFiscal
 * @example
 * const model = require('./model');
 */

const Oracle = require('../Oracle');

/**
 * Incluindo AcC060
 * @requires AcC060
 */
const AcC060 = require('./AcC060');

/**
 * Incluindo SfC110
 * @requires SfC110
 */
const SfC110 = require('./SfC110');

/**
 * Incluindo SfC195
 * @requires SfC195
 */
const SfC195 = require('./SfC195');

/**
 * Incluindo NotaFiscalItem
 * @requires NotaFiscalItem
 */
const NotaFiscalProdutoItem = require('./NotaFiscalProdutoItem');

/**
 * Classe de Saida.Produto
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const nfeSaida = new model.NotaFiscalProduto.Saida();
 */

var NotaFiscalSaidaProduto = function(){
  if(!(this instanceof NotaFiscalSaidaProduto))
    return new NotaFiscalSaidaProduto();
};

/**
 * Função inserir os dados do AcC700Entrada 
 * 
 * @param {dataNotaFiscalSaidaProduto} dataNotaFiscalSaidaProduto 
 * @returns {Promise} Promise
 * @example 
 * var dataNotaFiscalSaidaProduto = {
 *   dm_entrada_saida: '1', 
 *   id_pessoa_destinatario: 1,
 *   id_modelo_documento: 1, 
 *   serie_subserie_documento: '',
 *   nr_documento: '', 
 *   dm_tipo_fatura: '',
 *   dt_emissao_documento: '',
 *   dt_entrada_saida: '',
 *   vl_total_nota_fiscal: 0,
 *   vl_desconto: 0,
 *   vl_icms_substituicao: 0,
 *   vl_outras_despesas: 0,
 *   vl_total_mercadoria: 0,
 *   vl_frete: 0,
 *   vl_ipi: 0,
 *   vl_seguro: 0,
 *   dm_modalidade_frete: '',
 *   id_ref_413: '',
 *   vl_icms_desonerado: 0,
 *   dm_cancelamento: '',
 *   dm_gare: '',
 *   dm_gnre: '',
 *   nr_chave_nf_eletronica: '0',
 *   id_pessoa_remetente_cte: 0,
 *   vl_icms_fcp: 0,
 *   vl_icms_uf_dest: 0,
 *   vl_icms_uf_remet: 0,
 *   nr_chave_nf_eletron_ref_cat83: '',
 *   vl_fcp_st: 0,
 *   id_ref_331_munic_orig: 0,
 *   id_ref_331_munic_dest: 0,
 *   dm_tipo_cte: '',
 *   dm_finalidade: '',
 *   id_empresa: 1,
 *   id_usuario: 1
 * }
 * const data = (await nfeSaida.insert(dataNotaFiscalSaidaProduto));
 * 
 * ou
 *
 * const rows = await nfeSaida.insert(dataNotaFiscalSaidaProduto).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
NotaFiscalSaidaProduto.prototype.insert = async (dataNotaFiscalSaidaProduto) => {
  let sql = `insert into in_nota_fiscal_saida 
              ( dm_entrada_saida, id_pessoa_destinatario, id_modelo_documento, serie_subserie_documento, nr_documento, dm_tipo_fatura, dt_emissao_documento, dt_entrada_saida, vl_total_nota_fiscal, vl_desconto, vl_icms_substituicao, vl_outras_despesas, vl_total_mercadoria, vl_frete, vl_ipi, vl_seguro, dm_modalidade_frete, id_ref_413, vl_icms_desonerado, dm_cancelamento, dm_gare, dm_gnre, nr_chave_nf_eletronica, id_pessoa_remetente_cte, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, nr_chave_nf_eletron_ref_cat83, vl_fcp_st, id_ref_331_munic_orig, id_ref_331_munic_dest, dm_tipo_cte, dm_finalidade, id_empresa, id_usuario) 
              values 
              ( :dm_entrada_saida, :id_pessoa_destinatario, :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dm_tipo_fatura, :dt_emissao_documento, :dt_entrada_saida, :vl_total_nota_fiscal, :vl_desconto, :vl_icms_substituicao, :vl_outras_despesas, :vl_total_mercadoria, :vl_frete, :vl_ipi, :vl_seguro, :dm_modalidade_frete, :id_ref_413, :vl_icms_desonerado, :dm_cancelamento, :dm_gare, :dm_gnre, :nr_chave_nf_eletronica, :id_pessoa_remetente_cte, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :nr_chave_nf_eletron_ref_cat83, :vl_fcp_st, :id_ref_331_munic_orig, :id_ref_331_munic_dest, :dm_tipo_cte, :dm_finalidade, :id_empresa, :id_usuario)
            `;
  try {
    await Oracle.insert(sql, dataNotaFiscalSaidaProduto)
  } catch (err) {
    throw new Error(err);
  }
};



/**
 * 
 * @param {chaveC100Saida} chaveC100Saida
 * @returns {Promise} Promise
 * @example 
 * var chaveC100Saida = {
 *   dm_entrada_saida: '1',  
 *   nr_documento: '', 
 *   serie_subserie_documento: '',
 *   dt_emissao_documento: '',
 *   id_empresa: 1
 * }
 * const data = (await nfeSaida.insert(chaveC100Saida));
 * 
 * ou
 *
 * const rows = await nfeSaida.insert(chaveC100Saida).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
NotaFiscalSaidaProduto.prototype.delete = async (chaveC100Saida) => {
  let sql = `
  DELETE IN_NOTA_FISCAL_SAIDA
    WHERE DM_ENTRADA_SAIDA                      = :dm_entrada_saida
      AND (NVL(TRIM(SERIE_SUBSERIE_DOCUMENTO),0) = NVL(TRIM(:serie_subserie_documento),0)
      OR F_STRZERO(NVL(SERIE_SUBSERIE_DOCUMENTO, '0'), 3) = F_STRZERO(NVL(:serie_subserie_documento, '0'), 3))
      AND NR_DOCUMENTO                          = :nr_documento
      AND DT_EMISSAO_DOCUMENTO                  = :dt_emissao_documento
      AND ID_EMPRESA                            = :id_empresa
  `;

  try {
    return await Oracle.delete(sql, chaveC100Saida);
  } catch (err) {
    throw new Error(err);
  }
};


NotaFiscalSaidaProduto.prototype.Item = new NotaFiscalProdutoItem.Saida(),
/**
 * @property {SfC110Saida} SfC110Saida
 */
NotaFiscalSaidaProduto.prototype.SfC110 = new SfC110.SfC110Saida(),
NotaFiscalSaidaProduto.prototype.SfC195 = new SfC195.SfC195Saida()

module.exports.Saida = NotaFiscalSaidaProduto;

/**
 * Classe de Entrada.Produto
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const nfeEntrada = new model.NotaFiscalProduto.Entrada();
 */

 var NotaFiscalEntradaProduto = function(){
  if(!(this instanceof NotaFiscalSaidaProduto))
    return new NotaFiscalSaidaProduto();
};

/**
 * Função inserir os dados do AcC700Entrada 
 * 
 * @param {dataNotaFiscalEntradaProduto} dataNotaFiscalEntradaProduto 
 * @returns {Promise} Promise
 * @example 
 * var dataNotaFiscalEntradaProduto = {
 *   id_pessoa_remetente: 0, 
 *   id_modelo_documento: 0, 
 *   serie_subserie_documento: '', 
 *   nr_documento: '',
 *   dm_tipo_fatura: '',
 *   dt_emissao_documento: '',
 *   dt_entrada: '',
 *   vl_total_nota_fiscal: 0,
 *   vl_desconto: 0,
 *   vl_icms_substituicao: 0,
 *   vl_outras_despesas: 0,
 *   vl_total_mercadoria: 0,
 *   vl_frete: 0, 
 *   vl_seguro: 0,
 *   vl_ipi: 0,
 *   dm_modalidade_frete,
 *   id_ref_413: 0,
 *   vl_icms_desonerado: 0,
 *   nr_chave_nf_eletronica: '',
 *   vl_icms_fcp: 0,
 *   vl_icms_uf_dest: 0,
 *   vl_icms_uf_remet: 0,
 *   nr_chave_nf_eletron_ref_cat83: '',
 *   vl_fcp_st: 0, 
 *   id_ref_331_munic_orig: 0,
 *   id_ref_331_munic_dest: 0,
 *   dm_tipo_cte: '',
 *   dm_finalidade: '',
 *   id_empresa: 1,
 *   id_usuario: 1
 * }
 * const data = (await nfeEntrada.insert(dataNotaFiscalEntradaProduto));
 * 
 * ou
 *
 * const rows = await nfeEntrada.insert(dataNotaFiscalEntradaProduto).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
NotaFiscalSaidaProduto.prototype.insert = async (dataNotaFiscalEntradaProduto) => {
  let sql = `insert into in_nota_fiscal_entrada 
            ( id_pessoa_remetente, id_modelo_documento, serie_subserie_documento, nr_documento, dm_tipo_fatura, dt_emissao_documento, dt_entrada, vl_total_nota_fiscal, vl_desconto, vl_icms_substituicao, vl_outras_despesas, vl_total_mercadoria, vl_frete, vl_seguro, vl_ipi, dm_modalidade_frete, id_ref_413, vl_icms_desonerado, nr_chave_nf_eletronica, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, nr_chave_nf_eletron_ref_cat83, vl_fcp_st, id_ref_331_munic_orig, id_ref_331_munic_dest, dm_tipo_cte, dm_finalidade, id_empresa, id_usuario) 
            values 
            ( :id_pessoa_remetente, :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dm_tipo_fatura, :dt_emissao_documento, :dt_entrada, :vl_total_nota_fiscal, :vl_desconto, :vl_icms_substituicao, :vl_outras_despesas, :vl_total_mercadoria, :vl_frete, :vl_seguro, :vl_ipi, :dm_modalidade_frete, :id_ref_413, :vl_icms_desonerado, :nr_chave_nf_eletronica, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :nr_chave_nf_eletron_ref_cat83, :vl_fcp_st, :id_ref_331_munic_orig, :id_ref_331_munic_dest, :dm_tipo_cte, :dm_finalidade, :id_empresa, :id_usuario)
            `;
  try {
    await Oracle.insert(sql, dataNotaFiscalEntradaProduto)
  } catch (err) {
    throw new Error(err);
  }
}

NotaFiscalSaidaProduto.prototype.Item = new NotaFiscalProdutoItem.Entrada(),
NotaFiscalSaidaProduto.prototype.SfC110 = new SfC110.SfC110Entrada(),
NotaFiscalSaidaProduto.prototype.AcC060 = new AcC060.AcC060Entrada(),
NotaFiscalSaidaProduto.prototype.SfC195 = new SfC195.SfC195Entrada()

module.exports.Entrada = NotaFiscalEntradaProduto;

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
 * Campos da Tabela dataNotaFiscalSaidaProduto
 * 
 * @typedef {Object} dataNotaFiscalSaidaProduto
 * @property {String} dm_entrada_saida
 * @property {Number} id_pessoa_destinatario
 * @property {Number} id_modelo_documento
 * @property {String} serie_subserie_documento
 * @property {Number} nr_documento
 * @property {String} dm_tipo_fatura
 * @property {String} dt_emissao_documento
 * @property {String} dt_entrada_saida
 * @property {Number} vl_total_nota_fiscal
 * @property {Number} vl_desconto
 * @property {Number} vl_icms_substituicao
 * @property {Number} vl_outras_despesas
 * @property {Number} vl_total_mercadoria
 * @property {Number} vl_frete
 * @property {Number} vl_ipi
 * @property {Number} vl_seguro
 * @property {String} dm_modalidade_frete
 * @property {Number} id_ref_413
 * @property {Number} vl_icms_desonerado
 * @property {Number} dm_cancelamento
 * @property {String} dm_cancelamento
 * @property {String} dm_gare
 * @property {String} dm_gnre
 * @property {Number} nr_chave_nf_eletronica
 * @property {Number} id_pessoa_remetente_cte
 * @property {Number} vl_icms_fcp
 * @property {Number} vl_icms_uf_dest
 * @property {Number} vl_icms_uf_remet
 * @property {String} nr_chave_nf_eletron_ref_cat83
 * @property {Number} vl_fcp_st
 * @property {Number} id_ref_331_munic_orig
 * @property {Number} id_ref_331_munic_dest
 * @property {String} dm_tipo_cte
 * @property {String} dm_finalidade
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */

/**
 * Campos da Tabela dataNotaFiscalEntradaProduto
 * 
 * @typedef {Object} dataNotaFiscalEntradaProduto
 * @property {Number} id_pessoa_remetente
 * @property {Number} id_modelo_documento
 * @property {String} serie_subserie_documento
 * @property {String} nr_documento
 * @property {String} dm_tipo_fatura
 * @property {String} dt_emissao_documento
 * @property {String} dt_entrada
 * @property {Number} vl_total_nota_fiscal
 * @property {Number} vl_desconto
 * @property {Number} vl_icms_substituicao
 * @property {Number} vl_outras_despesas
 * @property {Number} vl_total_mercadoria
 * @property {Number} vl_frete
 * @property {Number} vl_seguro
 * @property {Number} vl_ipi
 * @property {String} dm_modalidade_frete
 * @property {Number} id_ref_413
 * @property {Number} vl_icms_desonerado
 * @property {String} nr_chave_nf_eletronica
 * @property {Number} vl_icms_fcp
 * @property {Number} vl_icms_uf_dest
 * @property {Number} vl_icms_uf_remet
 * @property {String} nr_chave_nf_eletron_ref_cat83
 * @property {Number} vl_fcp_st
 * @property {Number} id_ref_331_munic_orig
 * @property {Number} id_ref_331_munic_dest
 * @property {String} dm_tipo_cte
 * @property {String} dm_finalidade
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */
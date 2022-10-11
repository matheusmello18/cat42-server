/**
 * Modulo Item da Nota Fiscal
 * 
 * @module model/NotaFiscalItem
 */
const Oracle = require('../Oracle');

/**
 * Incluindo AcC050
 * @requires AcC050
 */
const AcC050 = require('./AcC050');

/**
 * Classe de Item da Nota Fiscal de Saida Produto
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const nfeItemSaida = new model.NotaFiscal.Saida().Item;
 */

 var NotaFiscalSaidaProdutoItem = function(){
  if(!(this instanceof NotaFiscalSaidaProdutoItem))
    return new NotaFiscalSaidaProdutoItem();
};

/**
 * Função inserir os dados na item da nota fiscal de saída 
 * 
 * @param {dataNotaFiscalSaidaItem} dataNotaFiscalSaidaItem 
 * @returns {Promise} Promise
 * @example
 * var dataNotaFiscalSaidaItem = {
 *   dm_entrada_saida: '1',
 *   id_modelo_documento: 0,
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   nr_sequencia: 1,
 *   id_produto_servico: 0,
 *   id_0190: 0,
 *   vl_unitario: 0,
 *   vl_total_item: 0,
 *   vl_desconto_item: 0,
 *   dm_movimentacao_fisica: '',
 *   cd_fiscal_operacao: '',
 *   nr_fci: '',
 *   id_ref_431: 0,
 *   vl_base_calculo_icms: 0,
 *   vl_icms: 0,
 *   vl_base_calculo_icms_subst: 0,
 *   aliq_icms_subs: 0,
 *   vl_icms_substituicao: 0,
 *   aliq_icms: 0,
 *   vl_reducao_bc_icms: 0,
 *   vl_perc_red_icms: 0,
 *   vl_perc_red_icms_st: 0,
 *   dm_mod_bc_icms: '',
 *   dm_mod_bc_icms_st: '',
 *   dm_tributacao_icms: '',
 *   id_ref_432: 0,
 *   vl_base_calculo_ipi: 0,
 *   vl_ipi: 0,
 *   aliq_ipi: 0,
 *   qtde: 0,
 *   unidade: '',
 *   dm_tributacao_ipi: '',
 *   vl_outras_despesas: 0,
 *   vl_frete: 0,
 *   vl_seguro: 0,
 *   nr_item: 1,
 *   ds_complementar: '',
 *   dm_mot_desc_icms: '',
 *   vl_icms_desonerado: 0,
 *   vl_bc_ii: 0,
 *   vl_desp_adu: 0,
 *   vl_ii: 0,
 *   vl_iof: 0,
 *   vl_bc_icms_uf_dest: 0,
 *   perc_icms_fcp: 0,
 *   aliq_icms_uf_dest: 0,
 *   aliq_icms_interestadual: 0,
 *   perc_icms_partilha: 0,
 *   vl_icms_fcp: 0,
 *   vl_icms_uf_dest: 0,
 *   vl_icms_uf_remet: 0,
 *   id_ref_453: 0,
 *   vl_bc_fcp_op: 0,
 *   aliq_fcp_op: 0,
 *   vl_fcp_op: 0,
 *   vl_bc_fcp_st: 0,
 *   aliq_fcp_st: 0,
 *   vl_fcp_st: 0,
 *   vl_bc_icms_st_obs: 0,
 *   vl_icms_st_obs: 0,
 *   qtde_tributada: 0,
 *   id_empresa: 1,
 *   id_usuario: 1
 * }
 * await nfeItemSaida.insert(dataNotaFiscalSaidaItem);
 * 
 * ou
 *
 * const data = await nfeItemSaida.insert(dataNotaFiscalSaidaItem).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir registro no item da nota fiscal');
 * })
 */
NotaFiscalSaidaProdutoItem.prototype.insert = async (dataNotaFiscalSaidaItem) => {
  let sql = `insert into in_nota_fiscal_saida_item 
            ( dm_entrada_saida, id_modelo_documento, serie_subserie_documento, nr_documento, dt_emissao_documento, nr_sequencia, id_produto_servico, id_0190, vl_unitario, vl_total_item, vl_desconto_item, dm_movimentacao_fisica, cd_fiscal_operacao, nr_fci, id_ref_431, vl_base_calculo_icms, vl_icms, vl_base_calculo_icms_subst, aliq_icms_subs, vl_icms_substituicao, aliq_icms, vl_reducao_bc_icms, vl_perc_red_icms, vl_perc_red_icms_st, dm_mod_bc_icms, dm_mod_bc_icms_st, dm_tributacao_icms, id_ref_432, vl_base_calculo_ipi, vl_ipi, aliq_ipi, qtde, unidade, dm_tributacao_ipi, vl_outras_despesas, vl_frete, vl_seguro, nr_item, ds_complementar, dm_mot_desc_icms, vl_icms_desonerado, vl_bc_ii, vl_desp_adu, vl_ii, vl_iof, vl_bc_icms_uf_dest, perc_icms_fcp, aliq_icms_uf_dest, aliq_icms_interestadual, perc_icms_partilha, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, id_ref_453, vl_bc_fcp_op, aliq_fcp_op, vl_fcp_op, vl_bc_fcp_st, aliq_fcp_st, vl_fcp_st, vl_bc_icms_st_obs, vl_icms_st_obs, qtde_tributada, id_empresa, id_usuario) 
            values 
            ( :dm_entrada_saida, :id_modelo_documento, :serie_subserie_documento, :nr_documento, to_date(:dt_emissao_documento, 'dd/mm/yyyy'), :nr_sequencia, :id_produto_servico, :id_0190, :vl_unitario, :vl_total_item, :vl_desconto_item, :dm_movimentacao_fisica, :cd_fiscal_operacao, :nr_fci, :id_ref_431, :vl_base_calculo_icms, :vl_icms, :vl_base_calculo_icms_subst, :aliq_icms_subs, :vl_icms_substituicao, :aliq_icms, :vl_reducao_bc_icms, :vl_perc_red_icms, :vl_perc_red_icms_st, :dm_mod_bc_icms, :dm_mod_bc_icms_st, :dm_tributacao_icms, :id_ref_432, :vl_base_calculo_ipi, :vl_ipi, :aliq_ipi, :qtde, :unidade, :dm_tributacao_ipi, :vl_outras_despesas, :vl_frete, :vl_seguro, :nr_item, :ds_complementar, :dm_mot_desc_icms, :vl_icms_desonerado, :vl_bc_ii, :vl_desp_adu, :vl_ii, :vl_iof, :vl_bc_icms_uf_dest, :perc_icms_fcp, :aliq_icms_uf_dest, :aliq_icms_interestadual, :perc_icms_partilha, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :id_ref_453, :vl_bc_fcp_op, :aliq_fcp_op, :vl_fcp_op, :vl_bc_fcp_st, :aliq_fcp_st, :vl_fcp_st, :vl_bc_icms_st_obs, :vl_icms_st_obs, :qtde_tributada, :id_empresa, :id_usuario)
            `;
  try {
    await Oracle.insert(sql, dataNotaFiscalSaidaItem)
  } catch (err) {
    throw err
  }
};

/**
 * Deletar Item da nota fiscal de Saida atraves da chave do C100 Saida
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
 * await nfeItemEntrada.delete(chaveC100Saida);
 * 
 * ou
 *
 * const data = await nfeItemEntrada.delete(chaveC100Saida).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar registro no item da nota fiscal saida');
 * })
 */

 NotaFiscalSaidaProdutoItem.prototype.delete = async (chaveC100Saida) => {
  let sql = `
  delete in_nota_fiscal_saida_item
   where (nvl(trim(serie_subserie_documento),0) = nvl(trim(:serie_subserie_documento),0)
          or f_strzero(nvl(serie_subserie_documento, '0'), 3) = f_strzero(nvl(:serie_subserie_documento, '0'), 3))
     and to_char(dt_emissao_documento,'dd/mm/yyyy') = :dt_emissao_documento
     and dm_entrada_saida                           = :dm_entrada_saida
     and nr_documento                               = :nr_documento
     and id_empresa                                 = :id_empresa`;

  try {
    return await Oracle.delete(sql, chaveC100Saida);
  } catch (err) {
    throw err
  }
}

NotaFiscalSaidaProdutoItem.prototype.AcC050 = new AcC050.AcC050Saida();

module.exports.Saida = NotaFiscalSaidaProdutoItem;


/**
 * Classe de Entrada.Produto.Item
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const nfeItemEntrada = new model.NotaFiscal.Entrada().Item;
 */

 var NotaFiscalEntradaProdutoItem = function(){
  if(!(this instanceof NotaFiscalEntradaProdutoItem))
    return new NotaFiscalEntradaProdutoItem();
};

/**
 * Função inserir os dados na item da nota fiscal de entrada
 * 
 * @param {dataNotaFiscalEntradaItem} dataNotaFiscalEntradaItem 
 * @returns {Promise} Promise
 * @example
 * var dataNotaFiscalEntradaItem = {
 *   id_modelo_documento: 0,
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   id_pessoa_remetente: 0,
 *   nr_sequencia: 1,
 *   id_produto_servico: 0,
 *   id_0190: 1,
 *   vl_unitario: 0,
 *   vl_total_item: 0,
 *   vl_desconto_item: 0,
 *   dm_movimentacao_fisica: '',
 *   cd_fiscal_operacao: '',
 *   nr_fci: '',
 *   id_ref_431: 0,
 *   vl_base_calculo_icms: 0,
 *   vl_icms: 0,
 *   vl_base_calculo_icms_subst: 0,
 *   aliq_icms_subst: 0,
 *   vl_icms_substituicao: 0,
 *   aliq_icms: 0,
 *   vl_reducao_bc_icms: 0,
 *   dm_tributacao_icms: '',
 *   id_ref_432: 0,
 *   vl_base_calculo_ipi: 0,
 *   vl_ipi: 0,
 *   aliq_ipi: 0,
 *   qtde: 0,
 *   unidade: '',
 *   dm_tributacao_ipi: '',
 *   vl_outras_despesas: 0,
 *   vl_frete: 0,
 *   vl_seguro: 0,
 *   nr_item: 1,
 *   ds_complementar: '',
 *   dm_mot_desc_icms: '',
 *   vl_icms_desonerado: 0,
 *   vl_bc_ii: 0,
 *   vl_desp_adu: 0,
 *   vl_ii: 0,
 *   vl_iof: 0,
 *   vl_bc_icms_uf_dest: 0,
 *   perc_icms_fcp: 0,
 *   aliq_icms_uf_dest: 0,
 *   aliq_icms_interestadual: 0,
 *   perc_icms_partilha: 0,
 *   vl_icms_fcp: 0,
 *   vl_icms_uf_dest: 0,
 *   vl_icms_uf_remet: 0,
 *   id_ref_453: 0,
 *   vl_bc_fcp_op: 0,
 *   aliq_fcp_op: 0,
 *   vl_fcp_op: 0,
 *   vl_bc_fcp_st: 0,
 *   aliq_fcp_st: 0,
 *   vl_fcp_st: 0,
 *   vl_bc_icms_st_obs: 0,
 *   vl_icms_st_obs: 0,
 *   cd_classificacao_fiscal_merc: '',
 *   id_empresa: 1,
 *   id_usuario: 1
 * }
 * await nfeItemEntrada.insert(dataNotaFiscalEntradaItem);
 * 
 * ou
 *
 * const data = await nfeItemEntrada.insert(dataNotaFiscalEntradaItem).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir registro no item da nota fiscal');
 * })
 */
NotaFiscalEntradaProdutoItem.prototype.insert = async (dataNotaFiscalEntradaItem) => {
  let sql = `insert into in_nota_fiscal_entrada_item 
            ( id_modelo_documento, serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, nr_sequencia, id_produto_servico, id_0190, vl_unitario, vl_total_item, vl_desconto_item, dm_movimentacao_fisica, cd_fiscal_operacao, nr_fci, id_ref_431, vl_base_calculo_icms, vl_icms, vl_base_calculo_icms_subst, aliq_icms_subst, vl_icms_substituicao, aliq_icms, vl_reducao_bc_icms, dm_tributacao_icms, id_ref_432, vl_base_calculo_ipi, vl_ipi, aliq_ipi, qtde, unidade, dm_tributacao_ipi, vl_outras_despesas, vl_frete, vl_seguro, nr_item, ds_complementar, dm_mot_desc_icms, vl_icms_desonerado, vl_bc_ii, vl_desp_adu, vl_ii, vl_iof, vl_bc_icms_uf_dest, perc_icms_fcp, aliq_icms_uf_dest, aliq_icms_interestadual, perc_icms_partilha, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, id_ref_453, vl_bc_fcp_op, aliq_fcp_op, vl_fcp_op, vl_bc_fcp_st, aliq_fcp_st, vl_fcp_st, vl_bc_icms_st_obs, vl_icms_st_obs, cd_classificacao_fiscal_merc, id_empresa, id_usuario) 
            values 
            ( :id_modelo_documento, :serie_subserie_documento, :nr_documento, to_date(:dt_emissao_documento, 'dd/mm/yyyy'), :id_pessoa_remetente, :nr_sequencia, :id_produto_servico, :id_0190, :vl_unitario, :vl_total_item, :vl_desconto_item, :dm_movimentacao_fisica, :cd_fiscal_operacao, :nr_fci, :id_ref_431, :vl_base_calculo_icms, :vl_icms, :vl_base_calculo_icms_subst, :aliq_icms_subst, :vl_icms_substituicao, :aliq_icms, :vl_reducao_bc_icms, :dm_tributacao_icms, :id_ref_432, :vl_base_calculo_ipi, :vl_ipi, :aliq_ipi, :qtde, :unidade, :dm_tributacao_ipi, :vl_outras_despesas, :vl_frete, :vl_seguro, :nr_item, :ds_complementar, :dm_mot_desc_icms, :vl_icms_desonerado, :vl_bc_ii, :vl_desp_adu, :vl_ii, :vl_iof, :vl_bc_icms_uf_dest, :perc_icms_fcp, :aliq_icms_uf_dest, :aliq_icms_interestadual, :perc_icms_partilha, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :id_ref_453, :vl_bc_fcp_op, :aliq_fcp_op, :vl_fcp_op, :vl_bc_fcp_st, :aliq_fcp_st, :vl_fcp_st, :vl_bc_icms_st_obs, :vl_icms_st_obs, :cd_classificacao_fiscal_merc, :id_empresa, :id_usuario)
            `;
  try {
    await Oracle.insert(sql, dataNotaFiscalEntradaItem)
  } catch (err) {
    throw err
  }
};

/**
 * Deletar Item da nota fiscal Entrada atraves da chave do C100 Entada
 * 
 * @param {chaveC100Entrada} chaveC100Entrada 
 * @returns {Promise} Promise
 * @example
 * var chaveC100Entrada = {
 *   id_modelo_documento: 0,
 *   serie_subserie_documento: '',
 *   nr_documento: '',
 *   dt_emissao_documento: '',
 *   id_pessoa_remetente: 0
 * }
 * await nfeItemEntrada.delete(chaveC100Entrada);
 * 
 * ou
 *
 * const data = await nfeItemEntrada.delete(chaveC100Entrada).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar registro no item da nota fiscal entrada');
 * })
 */
 NotaFiscalEntradaProdutoItem.prototype.delete = async (chaveC100Entrada) => {
  let sql = `delete in_nota_fiscal_entrada_item
              where nvl(trim(serie_subserie_documento),0) = nvl(trim(:serie_subserie_documento),0)
                and id_pessoa_remetente  = :id_pessoa_remetente
                and to_char(dt_emissao_documento,'dd/mm/yyyy') = :dt_emissao_documento
                and nr_documento         = :nr_documento
                and id_modelo_documento  = :id_modelo_documento
                and id_empresa           = :id_empresa
            `;
  try {
    await Oracle.insert(sql, chaveC100Entrada)
  } catch (err) {
    throw err
  }
};

NotaFiscalEntradaProdutoItem.prototype.AcC050 = new AcC050.AcC050Entrada();

module.exports.Entrada = NotaFiscalEntradaProdutoItem;


/**
 * Campos da Chave da Tabela Nota Fiscal de Saída
 * 
 * @typedef {Object} chaveC100Saida
 * @property {String} dm_entrada_saida 1 - Entrada | 2 - Saída
 * @property {Number} nr_documento Número do Documento
 * @property {String} serie_subserie_documento Numero de Série
 * @property {String} dt_emissao_documento Data da emissão do documento
 * @property {Number} id_empresa Identificação da Empresa
 * @global
 */

/**
 * Campos da Tabela dataNotaFiscalSaidaItem
 * 
 * @typedef {Object} dataNotaFiscalSaidaItem
 * @property {String} dm_entrada_saida
 * @property {Number} id_modelo_documento
 * @property {String} serie_subserie_documento
 * @property {Number} nr_documento
 * @property {String} dt_emissao_documento
 * @property {Number} nr_sequencia
 * @property {Number} id_produto_servico
 * @property {Number} id_0190
 * @property {Number} vl_unitario
 * @property {Number} vl_total_item
 * @property {Number} vl_desconto_item
 * @property {String} dm_movimentacao_fisica
 * @property {String} cd_fiscal_operacao
 * @property {String} nr_fci
 * @property {Number} id_ref_431
 * @property {Number} vl_base_calculo_icms
 * @property {Number} vl_icms
 * @property {Number} vl_base_calculo_icms_subst
 * @property {Number} aliq_icms_subs
 * @property {Number} vl_icms_substituicao
 * @property {Number} aliq_icms
 * @property {Number} vl_reducao_bc_icms
 * @property {Number} vl_perc_red_icms
 * @property {Number} vl_perc_red_icms_st
 * @property {String} dm_mod_bc_icms
 * @property {String} dm_mod_bc_icms_st
 * @property {String} dm_tributacao_icms
 * @property {Number} id_ref_432
 * @property {Number} vl_base_calculo_ipi
 * @property {Number} vl_ipi
 * @property {Number} aliq_ipi
 * @property {Number} qtde
 * @property {String} unidade
 * @property {String} dm_tributacao_ipi
 * @property {Number} vl_outras_despesas
 * @property {Number} vl_frete
 * @property {Number} vl_seguro
 * @property {Number} nr_item
 * @property {String} ds_complementar
 * @property {String} dm_mot_desc_icms
 * @property {Number} vl_icms_desonerado
 * @property {Number} vl_bc_ii
 * @property {Number} vl_desp_adu
 * @property {Number} vl_ii
 * @property {Number} vl_iof
 * @property {Number} vl_bc_icms_uf_dest
 * @property {Number} perc_icms_fcp
 * @property {Number} aliq_icms_uf_dest
 * @property {Number} aliq_icms_interestadual
 * @property {Number} perc_icms_partilha
 * @property {Number} vl_icms_fcp
 * @property {Number} vl_icms_uf_dest
 * @property {Number} vl_icms_uf_remet
 * @property {Number} id_ref_453
 * @property {Number} vl_bc_fcp_op
 * @property {Number} aliq_fcp_op
 * @property {Number} vl_fcp_op
 * @property {Number} vl_bc_fcp_st
 * @property {Number} aliq_fcp_st
 * @property {Number} vl_fcp_st
 * @property {Number} vl_bc_icms_st_obs
 * @property {Number} vl_icms_st_obs
 * @property {Number} qtde_tributada
 * @property {Number} id_empresa
 * @property {Number} id_usuario
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

/**
 * Campos da Tabela dataNotaFiscalEntradaItem
 * 
 * @typedef {Object} dataNotaFiscalEntradaItem
 * @property {Number} id_modelo_documento
 * @property {String} serie_subserie_documento
 * @property {Number} nr_documento
 * @property {String} dt_emissao_documento
 * @property {Number} id_pessoa_remetente
 * @property {Number} nr_sequencia
 * @property {Number} id_produto_servico
 * @property {Number} id_0190
 * @property {Number} vl_unitario
 * @property {Number} vl_total_item
 * @property {Number} vl_desconto_item
 * @property {String} dm_movimentacao_fisica
 * @property {String} cd_fiscal_operacao
 * @property {String} nr_fci
 * @property {Number} id_ref_431
 * @property {Number} vl_base_calculo_icms
 * @property {Number} vl_icms
 * @property {Number} vl_base_calculo_icms_subst
 * @property {Number} aliq_icms_subst
 * @property {Number} vl_icms_substituicao
 * @property {Number} aliq_icms
 * @property {Number} vl_reducao_bc_icms
 * @property {String} dm_tributacao_icms
 * @property {Number} id_ref_432
 * @property {Number} vl_base_calculo_ipi
 * @property {Number} vl_ipi
 * @property {Number} aliq_ipi
 * @property {Number} qtde
 * @property {String} unidade
 * @property {String} dm_tributacao_ipi
 * @property {Number} vl_outras_despesas
 * @property {Number} vl_outras_despesas
 * @property {Number} vl_frete
 * @property {Number} vl_seguro
 * @property {Number} nr_item
 * @property {String} ds_complementar
 * @property {String} dm_mot_desc_icms
 * @property {Number} vl_icms_desonerado
 * @property {Number} vl_bc_ii
 * @property {Number} vl_desp_adu
 * @property {Number} vl_ii
 * @property {Number} vl_iof
 * @property {Number} vl_bc_icms_uf_dest
 * @property {Number} perc_icms_fcp
 * @property {Number} aliq_icms_uf_dest
 * @property {Number} aliq_icms_interestadual
 * @property {Number} perc_icms_partilha
 * @property {Number} vl_icms_fcp
 * @property {Number} vl_icms_uf_dest
 * @property {Number} vl_icms_uf_remet
 * @property {Number} id_ref_453
 * @property {Number} vl_bc_fcp_op
 * @property {Number} aliq_fcp_op
 * @property {Number} vl_fcp_op
 * @property {Number} vl_bc_fcp_st
 * @property {Number} aliq_fcp_st
 * @property {Number} vl_fcp_st
 * @property {Number} vl_bc_icms_st_obs
 * @property {Number} vl_icms_st_obs
 * @property {String} cd_classificacao_fiscal_merc
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */
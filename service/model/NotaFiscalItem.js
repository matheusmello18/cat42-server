const Oracle = require('../Oracle');
const AcC050 = require('./AcC050');

module.exports.Saida = {
  insert: async (InNotaFiscalSaidaItem = {}) => {
    let sql = `insert into in_nota_fiscal_saida_item 
              ( dm_entrada_saida, id_modelo_documento, serie_subserie_documento, nr_documento, dt_emissao_documento, nr_sequencia, id_produto_servico, id_0190, vl_unitario, vl_total_item, vl_desconto_item, dm_movimentacao_fisica, cd_fiscal_operacao, nr_fci, id_ref_431, vl_base_calculo_icms, vl_icms, vl_base_calculo_icms_subst, aliq_icms_subs, vl_icms_substituicao, aliq_icms, vl_reducao_bc_icms, vl_perc_red_icms, vl_perc_red_icms_st, dm_mod_bc_icms, dm_mod_bc_icms_st, dm_tributacao_icms, id_ref_432, vl_base_calculo_ipi, vl_ipi, aliq_ipi, qtde, unidade, dm_tributacao_ipi, vl_outras_despesas, vl_frete, vl_seguro, nr_item, ds_complementar, dm_mot_desc_icms, vl_icms_desonerado, vl_bc_ii, vl_desp_adu, vl_ii, vl_iof, vl_bc_icms_uf_dest, perc_icms_fcp, aliq_icms_uf_dest, aliq_icms_interestadual, perc_icms_partilha, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, id_ref_453, vl_bc_fcp_op, aliq_fcp_op, vl_fcp_op, vl_bc_fcp_st, aliq_fcp_st, vl_fcp_st, vl_bc_icms_st_obs, vl_icms_st_obs, qtde_tributada, id_empresa, id_usuario) 
              values 
              ( :dm_entrada_saida, :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :nr_sequencia, :id_produto_servico, :id_0190, :vl_unitario, :vl_total_item, :vl_desconto_item, :dm_movimentacao_fisica, :cd_fiscal_operacao, :nr_fci, :id_ref_431, :vl_base_calculo_icms, :vl_icms, :vl_base_calculo_icms_subst, :aliq_icms_subs, :vl_icms_substituicao, :aliq_icms, :vl_reducao_bc_icms, :vl_perc_red_icms, :vl_perc_red_icms_st, :dm_mod_bc_icms, :dm_mod_bc_icms_st, :dm_tributacao_icms, :id_ref_432, :vl_base_calculo_ipi, :vl_ipi, :aliq_ipi, :qtde, :unidade, :dm_tributacao_ipi, :vl_outras_despesas, :vl_frete, :vl_seguro, :nr_item, :ds_complementar, :dm_mot_desc_icms, :vl_icms_desonerado, :vl_bc_ii, :vl_desp_adu, :vl_ii, :vl_iof, :vl_bc_icms_uf_dest, :perc_icms_fcp, :aliq_icms_uf_dest, :aliq_icms_interestadual, :perc_icms_partilha, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :id_ref_453, :vl_bc_fcp_op, :aliq_fcp_op, :vl_fcp_op, :vl_bc_fcp_st, :aliq_fcp_st, :vl_fcp_st, :vl_bc_icms_st_obs, :vl_icms_st_obs, :qtde_tributada, :id_empresa, :id_usuario)
              `;
    try {
      await Oracle.insert(sql, InNotaFiscalSaidaItem)
    } catch (err) {
      throw new Error(err);
    }
  },
  AcC050
}

module.exports.Entrada = {
  insert: async (InNotaFiscalEntradaItem = {}) => {
    let sql = `insert into in_nota_fiscal_entrada_item 
              ( id_modelo_documento, serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, nr_sequencia, id_produto_servico, id_0190, vl_unitario, vl_total_item, vl_desconto_item, dm_movimentacao_fisica, cd_fiscal_operacao, nr_fci, id_ref_431, vl_base_calculo_icms, vl_icms, vl_base_calculo_icms_subst, aliq_icms_subst, vl_icms_substituicao, aliq_icms, vl_reducao_bc_icms, dm_tributacao_icms, id_ref_432, vl_base_calculo_ipi, vl_ipi, aliq_ipi, qtde, unidade, dm_tributacao_ipi, vl_outras_despesas, vl_frete, vl_seguro, nr_item, ds_complementar, dm_mot_desc_icms, vl_icms_desonerado, vl_bc_ii, vl_desp_adu, vl_ii, vl_iof, vl_bc_icms_uf_dest, perc_icms_fcp, aliq_icms_uf_dest, aliq_icms_interestadual, perc_icms_partilha, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, id_ref_453, vl_bc_fcp_op, aliq_fcp_op, vl_fcp_op, vl_bc_fcp_st, aliq_fcp_st, vl_fcp_st, vl_bc_icms_st_obs, vl_icms_st_obs, cd_classificacao_fiscal_merc, id_empresa, id_usuario) 
              values 
              ( :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_pessoa_remetente, :nr_sequencia, :id_produto_servico, :id_0190, :vl_unitario, :vl_total_item, :vl_desconto_item, :dm_movimentacao_fisica, :cd_fiscal_operacao, :nr_fci, :id_ref_431, :vl_base_calculo_icms, :vl_icms, :vl_base_calculo_icms_subst, :aliq_icms_subst, :vl_icms_substituicao, :aliq_icms, :vl_reducao_bc_icms, :dm_tributacao_icms, :id_ref_432, :vl_base_calculo_ipi, :vl_ipi, :aliq_ipi, :qtde, :unidade, :dm_tributacao_ipi, :vl_outras_despesas, :vl_frete, :vl_seguro, :nr_item, :ds_complementar, :dm_mot_desc_icms, :vl_icms_desonerado, :vl_bc_ii, :vl_desp_adu, :vl_ii, :vl_iof, :vl_bc_icms_uf_dest, :perc_icms_fcp, :aliq_icms_uf_dest, :aliq_icms_interestadual, :perc_icms_partilha, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :id_ref_453, :vl_bc_fcp_op, :aliq_fcp_op, :vl_fcp_op, :vl_bc_fcp_st, :aliq_fcp_st, :vl_fcp_st, :vl_bc_icms_st_obs, :vl_icms_st_obs, :cd_classificacao_fiscal_merc, :id_empresa, :id_usuario)
              `;
    try {
      await Oracle.insert(sql, InNotaFiscalEntradaItem)
    } catch (err) {
      throw new Error(err);
    }
  },
  AcC050
}
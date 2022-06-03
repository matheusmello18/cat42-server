const Oracle = require('../Oracle');
const AcC060 = require('./AcC060');
const SfC110 = require('./SfC110');
const SfC195 = require('./SfC195');
const NotaFiscalItem = require('./NotaFiscalItem');

/**
 * Some documented component
 *
 * @component
 * @example
 * const text = 'some example text'
 * return (
 *   <Documented text={text} />
 * )
 */

module.exports.Saida = {
  Produto: {
    insert: async (InNotaFiscalSaidaProduto = {}) => {
      let sql = `insert into in_nota_fiscal_saida 
                  ( dm_entrada_saida, id_pessoa_destinatario, id_modelo_documento, serie_subserie_documento, nr_documento, dm_tipo_fatura, dt_emissao_documento, dt_entrada_saida, vl_total_nota_fiscal, vl_desconto, vl_icms_substituicao, vl_outras_despesas, vl_total_mercadoria, vl_frete, vl_ipi, vl_seguro, dm_modalidade_frete, id_ref_413, vl_icms_desonerado, dm_cancelamento, dm_gare, dm_gnre, nr_chave_nf_eletronica, id_pessoa_remetente_cte, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, nr_chave_nf_eletron_ref_cat83, vl_fcp_st, id_ref_331_munic_orig, id_ref_331_munic_dest, dm_tipo_cte, dm_finalidade, id_empresa, id_usuario) 
                  values 
                  ( :dm_entrada_saida, :id_pessoa_destinatario, :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dm_tipo_fatura, :dt_emissao_documento, :dt_entrada_saida, :vl_total_nota_fiscal, :vl_desconto, :vl_icms_substituicao, :vl_outras_despesas, :vl_total_mercadoria, :vl_frete, :vl_ipi, :vl_seguro, :dm_modalidade_frete, :id_ref_413, :vl_icms_desonerado, :dm_cancelamento, :dm_gare, :dm_gnre, :nr_chave_nf_eletronica, :id_pessoa_remetente_cte, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :nr_chave_nf_eletron_ref_cat83, :vl_fcp_st, :id_ref_331_munic_orig, :id_ref_331_munic_dest, :dm_tipo_cte, :dm_finalidade, :id_empresa, :id_usuario)
                `;
      try {
        await Oracle.insert(sql, InNotaFiscalSaidaProduto)
      } catch (err) {
        throw new Error(err);
      }
    },
		/**
		 * 
		 * @typedef {Object} chaveC100Saida
 		 * @property {String} dm_entrada_saida 1 - Entrada | 2 - Saída
 		 * @property {Number} id_modelo_documento Identificador do modelo Documento
		 * @property {String} nr_documento Número do Documento
		 * @property {String} dt_emissao_documento Data da emissão do documento
		 * @property {Number} id_empresa Identificação da Empresa
		 * @param {chaveC100Saida} chaveC100Saida
		 */
		delete: async (chaveC100Saida) => {
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
		},
    Item: NotaFiscalItem.Saida,
		SfC110: SfC110.Saida,
		SfC195: SfC195.Saida
  },
  Servico: {
    data: "colocar as funções insert|select|update|delete",
    item: {
      
      data: "colocar as funções insert|select|update|delete"
    }
  }
}

module.exports.Entrada = {
  Produto: {
    insert: async (InNotaFiscalEntradaProduto = {}) => {
      let sql = `insert into in_nota_fiscal_entrada 
                ( id_pessoa_remetente, id_modelo_documento, serie_subserie_documento, nr_documento, dm_tipo_fatura, dt_emissao_documento, dt_entrada, vl_total_nota_fiscal, vl_desconto, vl_icms_substituicao, vl_outras_despesas, vl_total_mercadoria, vl_frete, vl_seguro, vl_ipi, dm_modalidade_frete, id_ref_413, vl_icms_desonerado, nr_chave_nf_eletronica, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, nr_chave_nf_eletron_ref_cat83, vl_fcp_st, id_ref_331_munic_orig, id_ref_331_munic_dest, dm_tipo_cte, dm_finalidade, id_empresa, id_usuario) 
                values 
                ( :id_pessoa_remetente, :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dm_tipo_fatura, :dt_emissao_documento, :dt_entrada, :vl_total_nota_fiscal, :vl_desconto, :vl_icms_substituicao, :vl_outras_despesas, :vl_total_mercadoria, :vl_frete, :vl_seguro, :vl_ipi, :dm_modalidade_frete, :id_ref_413, :vl_icms_desonerado, :nr_chave_nf_eletronica, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :nr_chave_nf_eletron_ref_cat83, :vl_fcp_st, :id_ref_331_munic_orig, :id_ref_331_munic_dest, :dm_tipo_cte, :dm_finalidade, :id_empresa, :id_usuario)
                `;
      try {
        await Oracle.insert(sql, InNotaFiscalEntradaProduto)
      } catch (err) {
        throw new Error(err);
      }
    },
    Item: NotaFiscalItem.Entrada,
		SfC110: SfC110.Entrada,
		AcC060,
		SfC195: SfC195.Entrada
  },
  Servico: {
    data: "colocar as funções insert|select|update|delete",
    Item: {
      data: "colocar as funções insert|select|update|delete"
    }
  }
}
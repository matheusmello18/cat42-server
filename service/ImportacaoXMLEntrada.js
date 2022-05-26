const Oracle = require('./Oracle');
const model = require('./model');
const utils = require('../utils');



//deletar se existe o registro e importar novamnete;
//tomar atenção para este procedimento em outras importação se isso será necessário
//importar o cupom fiscal c800 e c850
//criar verificação que aceita somente modelo 55 e cupom fiscal (procurar seu modelo)
/**
 * 
 * @param {any} xmlObj
 * @param {number} id_simul_etapa 
 * @param {number} id_empresa 
 * @param {number} id_usuario 
 * @param {String} dt_periodo
 */
module.exports.Nfe = async (xmlObj, id_simul_etapa, id_empresa, id_usuario, dt_periodo) => {


  const Empresa = (await model.CtrlEmpresa.select(id_empresa)).rows[0];

  if(Empresa.CNPJ_EMPRESA !== xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.CNPJ[0]) { //então entrada
    await model.EtapaStatus.insert(dt_periodo, 2, id_simul_etapa, id_empresa, id_usuario, 'Nota fiscal informada não é uma nota fiscal de entrada.');
    throw new Error('Nota fiscal informada não é uma nota fiscal de entrada.');
  }

  /*
  await model.Pessoa.insert({
    dt_inicial:'',
    cd_pessoa:'',
    nm_razao_social:'',
    ds_endereco:'',
    ds_bairro:'',
    id_ref_331_municipio:'',
    uf:'',
    id_ref_331_pais:'',
    nr_cep:'',
    nr_cnpj_cpf:'',
    nr_inscricao_estadual:'',
    dt_movimento:'',
    nr_numero:'',
    ds_complemento:'',
    nr_fone:'',
    dm_contribuinte:'',
    nr_id_estrangeiro:'',
    id_empresa: id_empresa,
    id_usuario: id_usuario
  });

  await model.Unidade.insert({
    ds_unidade:'',
    ds_descricao:'',
    dt_inicial:'',
    dt_movimento:'',
    id_empresa: id_empresa,
    id_usuario: id_usuario
  })

  await model.Produto.insert({
    cd_produto_servico:'',
    cd_barra:'',
    ds_produto_servico:'',
    id_ref_331_ncm:'',
    id_ref_331_ex_ipi:'',
    dm_tipo_item:'',
    unidade:'',
    id_0190:'',
    dt_inicial:'',
    dt_movimento:'',
    id_cest:'',
    id_empresa: id_empresa,
    id_usuario: id_usuario
  })

  // não será insert e sim update, pois a nota veio da importação texto
  // entrada

  await model.NotaFiscal.Entrada.Produto.insert({
    id_pessoa_remetente:'',
    id_modelo_documento:'',
    serie_subserie_documento:'',
    nr_documento:'',
    dm_tipo_fatura:'',
    dt_emissao_documento:'',
    dt_entrada:'',
    vl_total_nota_fiscal:'',
    vl_desconto:'',
    vl_icms_substituicao:'',
    vl_outras_despesas:'',
    vl_total_mercadoria:'',
    vl_frete:'',
    vl_seguro:'',
    vl_ipi:'',
    dm_modalidade_frete:'',
    id_ref_413:'',
    vl_icms_desonerado:'',
    nr_chave_nf_eletronica:'',
    vl_icms_fcp:'',
    vl_icms_uf_dest:'',
    vl_icms_uf_remet:'',
    nr_chave_nf_eletron_ref_cat83:'',
    vl_fcp_st:'',
    id_ref_331_munic_orig:'',
    id_ref_331_munic_dest:'',
    dm_tipo_cte:'',
    dm_finalidade:'',
    id_empresa: id_empresa,
    id_usuario: id_usuario
  })

  await model.NotaFiscal.Entrada.Produto.SfC110.insert({
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
  
  await model.NotaFiscal.Entrada.Produto.AcC060.insert({
    dm_importacao:'',
    nr_di:'',
    dt_registro:'',
    dt_desembaraco:'',
    vl_pis:'',
    vl_cofins:'',
    id_nota_fiscal_entrada:'',
    id_pessoa_remetente:'',
    dt_emissao_documento:'',
    nr_documento:'',
    nr_item:'',
    nr_sequencia:'',
    serie_subserie_documento:'',
    id_empresa: id_empresa,
    id_usuario: id_usuario,
    id_modelo_documento:''
  })

  await model.NotaFiscal.Entrada.Produto.Item.insert({
    id_modelo_documento:'',
    serie_subserie_documento:'',
    nr_documento:'',
    dt_emissao_documento:'',
    id_pessoa_remetente:'',
    nr_sequencia:'',
    id_produto_servico:'',
    id_0190:'',
    vl_unitario:'',
    vl_total_item:'',
    vl_desconto_item:'',
    dm_movimentacao_fisica:'',
    cd_fiscal_operacao:'',
    nr_fci:'',
    id_ref_431:'',
    vl_base_calculo_icms:'',
    vl_icms:'',
    vl_base_calculo_icms_subst:'',
    aliq_icms_subst:'',
    vl_icms_substituicao:'',
    aliq_icms:'',
    vl_reducao_bc_icms:'',
    dm_tributacao_icms:'',
    id_ref_432:'',
    vl_base_calculo_ipi:'',
    vl_ipi:'',
    aliq_ipi:'',
    qtde:'',
    unidade:'',
    dm_tributacao_ipi:'',
    vl_outras_despesas:'',
    vl_frete:'',
    vl_seguro:'',
    nr_item:'',
    ds_complementar:'',
    dm_mot_desc_icms:'',
    vl_icms_desonerado:'',
    vl_bc_ii:'',
    vl_desp_adu:'',
    vl_ii:'',
    vl_iof:'',
    vl_bc_icms_uf_dest:'',
    perc_icms_fcp:'',
    aliq_icms_uf_dest:'',
    aliq_icms_interestadual:'',
    perc_icms_partilha:'',
    vl_icms_fcp:'',
    vl_icms_uf_dest:'',
    vl_icms_uf_remet:'',
    id_ref_453:'',
    vl_bc_fcp_op:'',
    aliq_fcp_op:'',
    vl_fcp_op:'',
    vl_bc_fcp_st:'',
    aliq_fcp_st:'',
    vl_fcp_st:'',
    vl_bc_icms_st_obs:'',
    vl_icms_st_obs:'',
    cd_classificacao_fiscal_merc:'',
    id_empresa: id_empresa,
    id_usuario: id_usuario
  })


  await model.NotaFiscal.Entrada.Produto.Item.AcC050.insert({
    id_ref_433:'',
    aliq_pis:'',
    vl_bc_pis:'',
    vl_pis:'',
    vl_aliq_pis:'',
    vl_pis_st:'',
    qtde_bc_pis:'',
    id_ref_434:'',
    aliq_cofins:'',
    vl_bc_cofins:'',
    vl_cofins:'',
    vl_aliq_cofins:'',
    vl_cofins_st:'',
    qtde_bc_cofins:'',
    id_nota_fiscal_entrada:'',
    dt_emissao_documento:'',
    id_pessoa_remetente:'',
    nr_documento:'',
    nr_item:'',
    nr_sequencia:'',
    serie_suserie_documento:'',
    id_empresa: id_empresa,
    id_usuario: id_usuario,
    id_modelo_documento:''
  })


  await model.SfC195.Entrada.insert({
    id_0460:'',
    ds_complementar:'',
    id_nota_fiscal_entrada:'',
    serie_subserie_documento:'',
    nr_documento:'',
    dt_emissao_documento:'',
    id_pessoa_remetente:'',
    nr_sequencia:'',
    nr_item:'',
    id_empresa: id_empresa,
    id_usuario: id_usuario,
    id_modelo_documento:''
  })
*/

}

/**
 * 
 * @param {any} xmlObj
 * @param {number} id_simul_etapa 
 * @param {number} id_empresa 
 * @param {number} id_usuario 
 * @param {String} dt_periodo 
 */
 module.exports.Cfe = async (xmlObj, id_simul_etapa, id_empresa, id_usuario, dt_periodo) => {

}
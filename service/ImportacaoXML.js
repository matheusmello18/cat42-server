const Oracle = require('./Oracle');
const CtrlEmpresa = require('./model/CtrlEmpresa');
const etapaStatus = require('./model/EtapaStatus');
const parseString = require('xml2js').parseString;
const fs = require("fs");

const InsertInPessoa = async (InPessoa = {}) => {
	let sql = `insert into in_pessoa 
						( dt_inicial, cd_pessoa, nm_razao_social, ds_endereco, ds_bairro, id_ref_331_municipio, uf, id_ref_331_pais, nr_cep, nr_cnpj_cpf, nr_inscricao_estadual, dt_movimento, nr_numero, ds_complemento, nr_fone, dm_contribuinte, nr_id_estrangeiro, id_empresa, id_usuario) 
						values 
						( :dt_inicial, :cd_pessoa, :nm_razao_social, :ds_endereco, :ds_bairro, :id_ref_331_municipio, :uf, :id_ref_331_pais, :nr_cep, :nr_cnpj_cpf, :nr_inscricao_estadual, :dt_movimento, :nr_numero, :ds_complemento, :nr_fone, :dm_contribuinte, :nr_id_estrangeiro, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, InPessoa)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertInPessoa
	InsertInPessoa({
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
	})
*/

const InsertSf0190 = async (Sf0190 = {}) => {
	let sql = `insert into sf_0190 
						( ds_unidade, ds_descricao, dt_inicial, dt_movimento, id_empresa, id_usuario) 
						values 
						( :ds_unidade, :ds_descricao, :dt_inicial, :dt_movimento, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, Sf0190)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertSf0190
	InsertSf0190({
		ds_unidade:'',
		ds_descricao:'',
		dt_inicial:'',
		dt_movimento:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/

const InsertInProdutoServico = async (InProdutoServico = {}) => {
	let sql = `insert into in_produto_servico 
						( cd_produto_servico, cd_barra, ds_produto_servico, id_ref_331_ncm, id_ref_331_ex_ipi, dm_tipo_item, unidade, id_0190, dt_inicial, dt_movimento, id_cest, id_empresa, id_usuario) 
						values 
						( :cd_produto_servico, :cd_barra, :ds_produto_servico, :id_ref_331_ncm, :id_ref_331_ex_ipi, :dm_tipo_item, :unidade, :id_0190, :dt_inicial, :dt_movimento, :id_cest, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, InProdutoServico)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertInProdutoServico
	InsertInProdutoServico({
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
*/

const InsertInNotaFiscalEntrada = async (InNotaFiscalEntrada = {}) => {
	let sql = `insert into in_nota_fiscal_entrada 
						( id_pessoa_remetente, id_modelo_documento, serie_subserie_documento, nr_documento, dm_tipo_fatura, dt_emissao_documento, dt_entrada, vl_total_nota_fiscal, vl_desconto, vl_icms_substituicao, vl_outras_despesas, vl_total_mercadoria, vl_frete, vl_seguro, vl_ipi, dm_modalidade_frete, id_ref_413, vl_icms_desonerado, nr_chave_nf_eletronica, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, nr_chave_nf_eletron_ref_cat83, vl_fcp_st, id_ref_331_munic_orig, id_ref_331_munic_dest, dm_tipo_cte, dm_finalidade, id_empresa, id_usuario) 
						values 
						( :id_pessoa_remetente, :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dm_tipo_fatura, :dt_emissao_documento, :dt_entrada, :vl_total_nota_fiscal, :vl_desconto, :vl_icms_substituicao, :vl_outras_despesas, :vl_total_mercadoria, :vl_frete, :vl_seguro, :vl_ipi, :dm_modalidade_frete, :id_ref_413, :vl_icms_desonerado, :nr_chave_nf_eletronica, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :nr_chave_nf_eletron_ref_cat83, :vl_fcp_st, :id_ref_331_munic_orig, :id_ref_331_munic_dest, :dm_tipo_cte, :dm_finalidade, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, InNotaFiscalEntrada)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertInNotaFiscalEntrada
	InsertInNotaFiscalEntrada({
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
*/

const InsertInNotaFiscalSaida = async (InNotaFiscalSaida = {}) => {
	let sql = `insert into in_nota_fiscal_saida 
						( dm_entrada_saida, id_pessoa_destinatario, id_modelo_documento, serie_subserie_documento, nr_documento, dm_tipo_fatura, dt_emissao_documento, dt_entrada_saida, vl_total_nota_fiscal, vl_desconto, vl_icms_substituicao, vl_outras_despesas, vl_total_mercadoria, vl_frete, vl_ipi, vl_seguro, dm_modalidade_frete, id_ref_413, vl_icms_desonerado, dm_cancelamento, dm_gare, dm_gnre, nr_chave_nf_eletronica, id_pessoa_remetente_cte, vl_icms_fcp, vl_icms_uf_dest, vl_icms_uf_remet, nr_chave_nf_eletron_ref_cat83, vl_fcp_st, id_ref_331_munic_orig, id_ref_331_munic_dest, dm_tipo_cte, dm_finalidade, id_empresa, id_usuario) 
						values 
						( :dm_entrada_saida, :id_pessoa_destinatario, :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dm_tipo_fatura, :dt_emissao_documento, :dt_entrada_saida, :vl_total_nota_fiscal, :vl_desconto, :vl_icms_substituicao, :vl_outras_despesas, :vl_total_mercadoria, :vl_frete, :vl_ipi, :vl_seguro, :dm_modalidade_frete, :id_ref_413, :vl_icms_desonerado, :dm_cancelamento, :dm_gare, :dm_gnre, :nr_chave_nf_eletronica, :id_pessoa_remetente_cte, :vl_icms_fcp, :vl_icms_uf_dest, :vl_icms_uf_remet, :nr_chave_nf_eletron_ref_cat83, :vl_fcp_st, :id_ref_331_munic_orig, :id_ref_331_munic_dest, :dm_tipo_cte, :dm_finalidade, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, InNotaFiscalSaida)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertInNotaFiscalSaida
	InsertInNotaFiscalSaida({
		dm_entrada_saida:'',
		id_pessoa_destinatario:'',
		id_modelo_documento:'',
		serie_subserie_documento:'',
		nr_documento:'',
		dm_tipo_fatura:'',
		dt_emissao_documento:'',
		dt_entrada_saida:'',
		vl_total_nota_fiscal:'',
		vl_desconto:'',
		vl_icms_substituicao:'',
		vl_outras_despesas:'',
		vl_total_mercadoria:'',
		vl_frete:'',
		vl_ipi:'',
		vl_seguro:'',
		dm_modalidade_frete:'',
		id_ref_413:'',
		vl_icms_desonerado:'',
		dm_cancelamento:'',
		dm_gare:'',
		dm_gnre:'',
		nr_chave_nf_eletronica:'',
		id_pessoa_remetente_cte:'',
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
*/

const InsertSfC110Saida = async (SfC110Saida = {}) => {
	let sql = `insert into sf_c110_saida 
						( id_modelo_documento, dm_entrada_saida, serie_subserie_documento, nr_documento, dt_emissao_documento, nr_item_imp, id_ref_0450, ds_complementar, id_empresa, id_usuario) 
						values 
						( :id_modelo_documento, :dm_entrada_saida, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :nr_item_imp, :id_ref_0450, :ds_complementar, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, SfC110Saida)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertSfC110Saida
	InsertSfC110Saida({
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

const InsertSfC110Entrada = async (SfC110Entrada = {}) => {
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
}

/** InsertSfC110Entrada
	InsertSfC110Entrada({
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

const InsertAcC060Entrada = async (AcC060Entrada = {}) => {
	let sql = `insert into ac_c060_entrada 
						( dm_importacao, nr_di, dt_registro, dt_desembaraco, vl_pis, vl_cofins, id_nota_fiscal_entrada, id_pessoa_remetente, dt_emissao_documento, nr_documento, nr_item, nr_sequencia, serie_subserie_documento, id_empresa, id_usuario, id_modelo_documento) 
						values 
						( :dm_importacao, :nr_di, :dt_registro, :dt_desembaraco, :vl_pis, :vl_cofins, :id_nota_fiscal_entrada, :id_pessoa_remetente, :dt_emissao_documento, :nr_documento, :nr_item, :nr_sequencia, :serie_subserie_documento, :id_empresa, :id_usuario, :id_modelo_documento)
						`;
	try {
		await Oracle.insert(sql, AcC060Entrada)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertAcC060Entrada
	InsertAcC060Entrada({
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
*/

const InsertAcC050Entrada = async (AcC050Entrada = {}) => {
	let sql = `insert into ac_c050_entrada 
						( id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_pis_st, qtde_bc_pis, id_ref_434, aliq_cofins, vl_bc_cofins, vl_cofins, vl_aliq_cofins, vl_cofins_st, qtde_bc_cofins, id_nota_fiscal_entrada, dt_emissao_documento, id_pessoa_remetente, nr_documento, nr_item, nr_sequencia, serie_suserie_documento, id_empresa, id_usuario, id_modelo_documento) 
						values 
						( :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_pis_st, :qtde_bc_pis, :id_ref_434, :aliq_cofins, :vl_bc_cofins, :vl_cofins, :vl_aliq_cofins, :vl_cofins_st, :qtde_bc_cofins, :id_nota_fiscal_entrada, :dt_emissao_documento, :id_pessoa_remetente, :nr_documento, :nr_item, :nr_sequencia, :serie_suserie_documento, :id_empresa, :id_usuario, :id_modelo_documento)
						`;
	try {
		await Oracle.insert(sql, AcC050Entrada)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertAcC050Entrada
	InsertAcC050Entrada({
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
*/

const InsertAcC050Saida = async (AcC050Saida = {}) => {
	let sql = `insert into ac_c050_saida 
						( dm_entrada_saida, id_modelo_documento, id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_pis_st, qtde_bc_pis, id_ref_434, aliq_cofins, vl_bc_cofins, vl_cofins, vl_aliq_cofins, vl_cofins_st, qtde_bc_cofins, id_nota_fiscal_saida, dt_emissao_documento, nr_documento, nr_item, nr_sequencia, serie_subserie_documento, id_empresa, id_usuario) 
						values 
						( :dm_entrada_saida, :id_modelo_documento, :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_pis_st, :qtde_bc_pis, :id_ref_434, :aliq_cofins, :vl_bc_cofins, :vl_cofins, :vl_aliq_cofins, :vl_cofins_st, :qtde_bc_cofins, :id_nota_fiscal_saida, :dt_emissao_documento, :nr_documento, :nr_item, :nr_sequencia, :serie_subserie_documento, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, AcC050Saida)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertAcC050Saida
	InsertAcC050Saida({
		dm_entrada_saida:'',
		id_modelo_documento:'',
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
		id_nota_fiscal_saida:'',
		dt_emissao_documento:'',
		nr_documento:'',
		nr_item:'',
		nr_sequencia:'',
		serie_subserie_documento:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/

const InsertInNotaFiscalSaidaItem = async (InNotaFiscalSaidaItem = {}) => {
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
}

/** InsertInNotaFiscalSaidaItem
	InsertInNotaFiscalSaidaItem({
		dm_entrada_saida:'',
		id_modelo_documento:'',
		serie_subserie_documento:'',
		nr_documento:'',
		dt_emissao_documento:'',
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
		aliq_icms_subs:'',
		vl_icms_substituicao:'',
		aliq_icms:'',
		vl_reducao_bc_icms:'',
		vl_perc_red_icms:'',
		vl_perc_red_icms_st:'',
		dm_mod_bc_icms:'',
		dm_mod_bc_icms_st:'',
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
		qtde_tributada:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/

const InsertInNotaFiscalEntradaItem = async (InNotaFiscalEntradaItem = {}) => {
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
}

/** InsertInNotaFiscalEntradaItem
	InsertInNotaFiscalEntradaItem({
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
*/

const InsertSfC195Saida = async (SfC195Saida = {}) => {
	let sql = `insert into sf_c195_saida 
						( dm_entrada_saida, id_0460, ds_complementar, id_nota_fiscal_saida, nr_item, id_modelo_documento, serie_subserie_documento, nr_documento, dt_emissao_documento, nr_sequencia, id_empresa, id_usuario) 
						values 
						( :dm_entrada_saida, :id_0460, :ds_complementar, :id_nota_fiscal_saida, :nr_item, :id_modelo_documento, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :nr_sequencia, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, SfC195Saida)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertSfC195Saida
	InsertSfC195Saida({
		dm_entrada_saida:'',
		id_0460:'',
		ds_complementar:'',
		id_nota_fiscal_saida:'',
		nr_item:'',
		id_modelo_documento:'',
		serie_subserie_documento:'',
		nr_documento:'',
		dt_emissao_documento:'',
		nr_sequencia:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/

const InsertSfC195Entrada = async (SfC195Entrada = {}) => {
	let sql = `insert into sf_c195_entrada 
						( id_0460, ds_complementar, id_nota_fiscal_entrada, serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, nr_sequencia, nr_item, id_empresa, id_usuario, id_modelo_documento) 
						values 
						( :id_0460, :ds_complementar, :id_nota_fiscal_entrada, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_pessoa_remetente, :nr_sequencia, :nr_item, :id_empresa, :id_usuario, :id_modelo_documento)
						`;
	try {
		await Oracle.insert(sql, SfC195Entrada)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertSfC195Entrada
	InsertSfC195Entrada({
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

const InsertAcC700Entrada = async (AcC700Entrada = {}) => {
	let sql = `insert into ac_c700_entrada 
						( dm_tipo_ligacao, dm_grupo_tensao, id_ref_331_municipio, nr_chave_nf_eletronica_ref, vl_fornecido, id_nota_fiscal_entrada, serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, id_empresa, id_usuario, id_modelo_documento) 
						values 
						( :dm_tipo_ligacao, :dm_grupo_tensao, :id_ref_331_municipio, :nr_chave_nf_eletronica_ref, :vl_fornecido, :id_nota_fiscal_entrada, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_pessoa_remetente, :id_empresa, :id_usuario, :id_modelo_documento)
						`;
	try {
		await Oracle.insert(sql, AcC700Entrada)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertAcC700Entrada
	InsertAcC700Entrada({
		dm_tipo_ligacao:'',
		dm_grupo_tensao:'',
		id_ref_331_municipio:'',
		nr_chave_nf_eletronica_ref:'',
		vl_fornecido:'',
		id_nota_fiscal_entrada:'',
		serie_subserie_documento:'',
		nr_documento:'',
		dt_emissao_documento:'',
		id_pessoa_remetente:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario,
		id_modelo_documento:''
	})
*/

const InsertAcC700Saida = async (AcC700Saida = {}) => {
	let sql = `insert into ac_c700_saida 
						( dm_entrada_saida, dm_tipo_ligacao, dm_grupo_tensao, id_ref_331_municipio, nr_chave_nf_eletronica_ref, vl_fornecido, id_nota_fiscal_saida, serie_subserie_documento, nr_documento, dt_emissao_documento, id_modelo_documento, id_empresa, id_usuario) 
						values 
						( :dm_entrada_saida, :dm_tipo_ligacao, :dm_grupo_tensao, :id_ref_331_municipio, :nr_chave_nf_eletronica_ref, :vl_fornecido, :id_nota_fiscal_saida, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_modelo_documento, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, AcC700Saida)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertAcC700Saida
	InsertAcC700Saida({
		dm_entrada_saida:'',
		dm_tipo_ligacao:'',
		dm_grupo_tensao:'',
		id_ref_331_municipio:'',
		nr_chave_nf_eletronica_ref:'',
		vl_fornecido:'',
		id_nota_fiscal_saida:'',
		serie_subserie_documento:'',
		nr_documento:'',
		dt_emissao_documento:'',
		id_modelo_documento:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/

const InsertSfC800 = async (SfC800 = {}) => {
	let sql = `insert into sf_c800 
						( nr_chave_cfe, id_modelo_documento, id_ref_413, dt_documento, nr_cnpj_cpf, nr_serie_sat, nr_cfe, nr_caixa, nm_destinatario, vl_desconto, vl_mercadoria, vl_outras_desp, vl_icms, vl_pis, vl_pis_st, vl_cofins, vl_cofins_st, vl_cfe, id_empresa, id_usuario) 
						values 
						( :nr_chave_cfe, :id_modelo_documento, :id_ref_413, :dt_documento, :nr_cnpj_cpf, :nr_serie_sat, :nr_cfe, :nr_caixa, :nm_destinatario, :vl_desconto, :vl_mercadoria, :vl_outras_desp, :vl_icms, :vl_pis, :vl_pis_st, :vl_cofins, :vl_cofins_st, :vl_cfe, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, SfC800)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertSfC800
	InsertSfC800({
		nr_chave_cfe:'',
		id_modelo_documento:'',
		id_ref_413:'',
		dt_documento:'',
		nr_cnpj_cpf:'',
		nr_serie_sat:'',
		nr_cfe:'',
		nr_caixa:'',
		nm_destinatario:'',
		vl_desconto:'',
		vl_mercadoria:'',
		vl_outras_desp:'',
		vl_icms:'',
		vl_pis:'',
		vl_pis_st:'',
		vl_cofins:'',
		vl_cofins_st:'',
		vl_cfe:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/

const InsertSfC850 = async (SfC850 = {}) => {
	let sql = `insert into sf_c850 
						( nr_item, dt_documento, nr_cfe, id_ref_413, nr_serie_sat, cd_fiscal_operacao, id_produto_servico, vl_total_item, id_0460, id_ref_431, aliq_icms, vl_bc_icms, vl_icms, id_ref_433, aliq_pis, vl_bc_pis, vl_pis, vl_aliq_pis, vl_qtde_bc_pis, id_ref_434, vl_bc_cofins, aliq_cofins, vl_cofins, vl_aliq_cofins, vl_qtde_bc_cofins, vl_desconto, vl_outras_desp, qtde, vl_unitario, id_empresa, id_usuario) 
						values 
						( :nr_item, :dt_documento, :nr_cfe, :id_ref_413, :nr_serie_sat, :cd_fiscal_operacao, :id_produto_servico, :vl_total_item, :id_0460, :id_ref_431, :aliq_icms, :vl_bc_icms, :vl_icms, :id_ref_433, :aliq_pis, :vl_bc_pis, :vl_pis, :vl_aliq_pis, :vl_qtde_bc_pis, :id_ref_434, :vl_bc_cofins, :aliq_cofins, :vl_cofins, :vl_aliq_cofins, :vl_qtde_bc_cofins, :vl_desconto, :vl_outras_desp, :qtde, :vl_unitario, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, SfC850)
	} catch (err) {
		throw new Error(err);
	}
}

/** InsertSfC850
	InsertSfC850({
		nr_item:'',
		dt_documento:'',
		nr_cfe:'',
		id_ref_413:'',
		nr_serie_sat:'',
		cd_fiscal_operacao:'',
		id_produto_servico:'',
		vl_total_item:'',
		id_0460:'',
		id_ref_431:'',
		aliq_icms:'',
		vl_bc_icms:'',
		vl_icms:'',
		id_ref_433:'',
		aliq_pis:'',
		vl_bc_pis:'',
		vl_pis:'',
		vl_aliq_pis:'',
		vl_qtde_bc_pis:'',
		id_ref_434:'',
		vl_bc_cofins:'',
		aliq_cofins:'',
		vl_cofins:'',
		vl_aliq_cofins:'',
		vl_qtde_bc_cofins:'',
		vl_desconto:'',
		vl_outras_desp:'',
		qtde:'',
		vl_unitario:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/

//deletar se existe o registro e importar novamnete;
//tomar atenção para este procedimento em outras importação se isso será necessário
//importar o cupom fiscal c800 e c850
//criar verificação que aceita somente modelo 55 e cupom fiscal (procurar seu modelo)
module.exports.XmlSaida = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

  fs.readFile(path, "utf8", async (err, xml) => {
    if (err){
      /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
      await etapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message);
      throw new Error(err.message);
    }
    parseString(xml, async function (err, result) {
      if (err){
        /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
        await etapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message);
        throw new Error(err.message);
      }

			var Empresa = await CtrlEmpresa.select(id_empresa);

			if(Empresa.rows[0].CNPJ_EMPRESA !== result.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0]) { //então saida
				await etapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Nota fiscal informada não é uma nota fiscal de saída.');
        throw new Error(err.message);
			}

			//result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].UF[0]
			//result.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ ou result.nfeProc.NFe[0].infNFe[0].dest[0].CPF
			//result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].UF[0]? EX : 

      console.log(result.nfeProc.$.versao)
      console.dir(result.nfeProc.NFe[0].infNFe[0].ide[0].cUF[0]);
      
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].cUF)
        console.log(result.nfeProc.NFe[0].infNFe[0].ide[0].cUF)
      
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].ver !== undefined)
        console.dir(result.nfeProc.NFe[0].infNFe[0].ide[0].ver)
  
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].ver)
        console.log(result.nfeProc.NFe[0].infNFe[0].ide[0].ver)

			var inParametro = await Oracle.select(
				`SELECT DM_IMPORTAXML_DEPARA, /*para nfe entrada*/
								DM_APURACAO_DTEMISSAO, 
								NVL(DM_IMPXML_CNPJ_PROD,'N') DM_IMPXML_CNPJ_PROD, 
								NVL(DM_PESQ_AC_0450,'S') DM_PESQ_AC_0450
					FROM IN_PARAMETRO_EMPRESA 
					WHERE ID_EMPRESA = :ID_EMPRESA`, 
				{ID_EMPRESA: id_empresa}
			);

			result.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ
			//if (inParametro.rows[0].DM_IMPORTAXML_DEPARA == '')
      InsertInPessoa({
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

      InsertSf0190({
        ds_unidade:'',
        ds_descricao:'',
        dt_inicial:'',
        dt_movimento:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      });

      InsertInProdutoServico({
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

      // saída
      InsertInNotaFiscalSaida({
        dm_entrada_saida:'',
        id_pessoa_destinatario:'',
        id_modelo_documento:'',
        serie_subserie_documento:'',
        nr_documento:'',
        dm_tipo_fatura:'',
        dt_emissao_documento:'',
        dt_entrada_saida:'',
        vl_total_nota_fiscal:'',
        vl_desconto:'',
        vl_icms_substituicao:'',
        vl_outras_despesas:'',
        vl_total_mercadoria:'',
        vl_frete:'',
        vl_ipi:'',
        vl_seguro:'',
        dm_modalidade_frete:'',
        id_ref_413:'',
        vl_icms_desonerado:'',
        dm_cancelamento:'',
        dm_gare:'',
        dm_gnre:'',
        nr_chave_nf_eletronica:'',
        id_pessoa_remetente_cte:'',
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

      InsertSfC110Saida({
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

      InsertAcC050Saida({
        dm_entrada_saida:'',
        id_modelo_documento:'',
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
        id_nota_fiscal_saida:'',
        dt_emissao_documento:'',
        nr_documento:'',
        nr_item:'',
        nr_sequencia:'',
        serie_subserie_documento:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      })

      InsertInNotaFiscalSaidaItem({
        dm_entrada_saida:'',
        id_modelo_documento:'',
        serie_subserie_documento:'',
        nr_documento:'',
        dt_emissao_documento:'',
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
        aliq_icms_subs:'',
        vl_icms_substituicao:'',
        aliq_icms:'',
        vl_reducao_bc_icms:'',
        vl_perc_red_icms:'',
        vl_perc_red_icms_st:'',
        dm_mod_bc_icms:'',
        dm_mod_bc_icms_st:'',
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
        qtde_tributada:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      })

      InsertSfC195Saida({
        dm_entrada_saida:'',
        id_0460:'',
        ds_complementar:'',
        id_nota_fiscal_saida:'',
        nr_item:'',
        id_modelo_documento:'',
        serie_subserie_documento:'',
        nr_documento:'',
        dt_emissao_documento:'',
        nr_sequencia:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      })

    })
  });
  
  //Oracle.execProcedure(nm_procedure1, id_empresa, id_usuario);
  //Oracle.execProcedure(nm_procedure2, id_empresa, id_usuario);
  
  await etapaStatus.insert(dt_periodo, 1, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Dados importado com sucesso.');
}


module.exports.XmlEntrada = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

  fs.readFile(path, "utf8", async (err, xml) => {
    if (err){
      /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
      await etapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message);
      throw new Error(err.message);
    }
    parseString(xml, async function (err, result) {
      if (err){
        /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
        await etapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message);
        throw new Error(err.message);
      }

			var Empresa = await CtrlEmpresa.select(id_empresa);

			if(Empresa.rows[0].CNPJ_EMPRESA !== result.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ[0]){ //então entrada
				await etapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Nota fiscal informada não é uma nota fiscal de entrada.');
        throw new Error(err.message);
			}

      console.log(result.nfeProc.$.versao)
      console.dir(result.nfeProc.NFe[0].infNFe[0].ide[0].cUF[0]);
      
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].cUF)
        console.log(result.nfeProc.NFe[0].infNFe[0].ide[0].cUF)
      
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].ver !== undefined)
        console.dir(result.nfeProc.NFe[0].infNFe[0].ide[0].ver)
  
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].ver)
        console.log(result.nfeProc.NFe[0].infNFe[0].ide[0].ver)

      InsertInPessoa({
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

      InsertSf0190({
        ds_unidade:'',
        ds_descricao:'',
        dt_inicial:'',
        dt_movimento:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      });

      InsertInProdutoServico({
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

      InsertInNotaFiscalEntrada({
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

      InsertSfC110Entrada({
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

      InsertSfC110Entrada({
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

      InsertAcC060Entrada({
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

      InsertAcC050Entrada({
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

      InsertInNotaFiscalEntradaItem({
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

      InsertSfC195Entrada({
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

    })
  });
  
  //Oracle.execProcedure(nm_procedure1, id_empresa, id_usuario);
  //Oracle.execProcedure(nm_procedure2, id_empresa, id_usuario);
  
  await etapaStatus.insert(dt_periodo, 1, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Dados importado com sucesso.');
}
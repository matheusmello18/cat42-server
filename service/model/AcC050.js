const Oracle = require('../Oracle');

module.exports.Saida = {
  insert: async (AcC050Saida = {}) => {
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
}

module.exports.Entrada = {
  insert: async (AcC050Entrada = {}) => {
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
}

/** require('./model').AcC050.Entrada.insert
	AcC050.Entrada.insert({
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

/** require('./model').AcC050.Saida.insert
	AcC050.Saida.insert({
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
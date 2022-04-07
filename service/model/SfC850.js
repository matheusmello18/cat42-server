const Oracle = require('../Oracle');

module.exports.insert = async (SfC850 = {}) => {
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

/** require('./model').SfC850.insert
	SfC850.insert({
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
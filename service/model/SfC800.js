const Oracle = require('../Oracle');

module.exports.insert = async (SfC800 = {}) => {
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

/** require('./model').SfC800.insert
	SfC800.insert({
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
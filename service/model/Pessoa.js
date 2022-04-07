const Oracle = require('../Oracle');

module.exports.insert = async (InPessoa = {}) => {
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

module.exports.sp_gera_pessoa_mestre_item = async () => {
  try {
    await Oracle.execProcedure('SP_GERA_PESSOA_MESTRE_ITEM');
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.mestre = {
	selectByRazaoSocial: async (nm_razao_social, id_empresa) => {
		let sql = `select in_pessoa_mestre.id_pessoa, 
											in_pessoa_mestre.cd_pessoa 
								from in_pessoa_item 
								inner join in_pessoa_mestre on in_pessoa_mestre.id_pessoa = in_pessoa_item.id_pessoa 
								where nm_razao_social = :nm_razao_social 
									and in_pessoa_mestre.id_empresa = :id_empresa_referencia`;
		try {
			await Oracle.insert(sql, {nm_razao_social: nm_razao_social, id_empresa_referencia: id_empresa})
		} catch (err) {
			throw new Error(err);
		}
	}
}
module.exports.item = {}

/** require('./model').Pessoa.insert
	Pessoa.Insert({
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
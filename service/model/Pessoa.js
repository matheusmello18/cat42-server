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

module.exports.mestre = {}
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
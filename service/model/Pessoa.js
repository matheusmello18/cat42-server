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

module.exports.Mestre = {
	insert: async (InPessoa = {}) => {
		let sql = `insert into in_pessoa_mestre
							( id_pessoa, cd_pessoa, id_empresa, id_usuario) 
							values 
							( :id_pessoa, :cd_pessoa, :id_empresa, :id_usuario)
							`;
		try {
			await Oracle.insert(sql, InPessoa)
		} catch (err) {
			throw new Error(err);
		}
	},
	selectByRazaoSocial: async (nm_razao_social, id_empresa) => {
		let sql = `select in_pessoa_mestre.id_pessoa, 
											in_pessoa_mestre.cd_pessoa 
								 from in_pessoa_item 
								inner join in_pessoa_mestre on in_pessoa_mestre.id_pessoa = in_pessoa_item.id_pessoa 
								where in_pessoa_item.nm_razao_social = :nm_razao_social 
									and in_pessoa_mestre.id_empresa    = :id_empresa`;
		try {
			await Oracle.select(sql, {nm_razao_social: nm_razao_social, id_empresa: id_empresa})
		} catch (err) {
			throw new Error(err);
		}
	},
	selectByCpfOrCpnj: async (nr_cnpj_cpf, dt_inicial, id_empresa) => {
		let sql = `select id_pessoa, cd_pessoa, dt_inicial
	 							 from (select mestre.id_pessoa, mestre.cd_pessoa, item.dt_inicial
								 				 from in_pessoa_mestre mestre
											  inner join in_pessoa_item item on (mestre.id_pessoa = item.id_pessoa)
											  where item.nr_cnpj_cpf  = :nr_cnpj_cpf
												  and mestre.id_empresa = :id_empresa
												  and (item.dt_inicial  = (select max(pi.dt_inicial)
																										from in_pessoa_item pi
																									 where pi.id_pessoa = item.id_pessoa
																									   and pi.dt_inicial <= to_date(:dt_inicial, 'dd/mm/yyyy'))
													 or item.dt_inicial is null)
												order by item.dt_inicial desc)
							  where rownum = 1`;
		try {
			await Oracle.select(sql, {nr_cnpj_cpf: nr_cnpj_cpf, dt_inicial: dt_inicial, id_empresa: id_empresa})
		} catch (err) {
			throw new Error(err);
		}
	}
}
module.exports.Item = {}

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
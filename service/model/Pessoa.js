/**
 * Modulo Pessoa
 * 
 * @module model/Pessoa
 * @example
 * const model = require('./model');
 */
const Oracle = require('../Oracle');

/**
 * Classe de Pessoa
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const Pessoa = new model.Pessoa();
 */

 var Pessoa = function(){
  if(!(this instanceof Pessoa))
    return new Pessoa();
};

/**
 * Função inserir os dados da Pessoa
 * 
 * @param {dataPessoa} dataPessoa
 * @returns {Promise} Promise
 * @example
 * var dataPessoa = {
 *   dt_inicial: '', 
 *   cd_pessoa: '',
 *   nm_razao_social: '',
 *   ds_endereco: '',
 *   ds_bairro: '',
 *   id_ref_331_municipio: 0,
 *   uf: '',
 *   id_ref_331_pais: 0,
 *   nr_cep: '',
 *   nr_cnpj_cpf: '',
 *   nr_inscricao_estadual: '',
 *   dt_movimento: '',
 *   nr_numero: '',
 *   ds_complemento: '',
 *   nr_fone: '',
 *   dm_contribuinte: '',
 *   nr_id_estrangeiro: 0,
 *   id_empresa: 1,
 *   id_usuario: 1
 * }
 * await Pessoa.insert(dataAcC700Saida);
 * 
 * ou
 *
 * const data = await Pessoa.insert(dataAcC700Saida).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
Pessoa.prototype.insert = async (dataPessoa) => {
	let sql = `insert into in_pessoa 
						( dt_inicial, cd_pessoa, nm_razao_social, ds_endereco, ds_bairro, id_ref_331_municipio, uf, id_ref_331_pais, nr_cep, nr_cnpj_cpf, nr_inscricao_estadual, dt_movimento, nr_numero, ds_complemento, nr_fone, dm_contribuinte, nr_id_estrangeiro, id_empresa, id_usuario) 
						values 
						( :dt_inicial, :cd_pessoa, :nm_razao_social, :ds_endereco, :ds_bairro, :id_ref_331_municipio, :uf, :id_ref_331_pais, :nr_cep, :nr_cnpj_cpf, :nr_inscricao_estadual, :dt_movimento, :nr_numero, :ds_complemento, :nr_fone, :dm_contribuinte, :nr_id_estrangeiro, :id_empresa, :id_usuario)
						`;
	try {
		return await Oracle.insert(sql, dataPessoa)
	} catch (err) {
		throw new Error(err);
	}
}

/**
 * Gerar Pessoa Mestre Item
 * @returns {Promise} Promise
 */
Pessoa.prototype.sp_gera_pessoa_mestre_item = async () => {
  try {
    return await Oracle.execProcedure('SP_GERA_PESSOA_MESTRE_ITEM');
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Classe de Pessoa.Mestre
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const PessoaMestre = new model.Pessoa().Mestre();
 */

var PessoaMestre = function(){
  if(!(this instanceof PessoaMestre))
    return new PessoaMestre();
};

/**
 * Função inserir os dados na Pessoa Mestre
 * 
 * @param {dataPessoaMestre} dataPessoaMestre
 * @returns {Promise} Promise
 * @example
 * var dataPessoaMestre = {
 *   id_pessoa, cd_pessoa, id_empresa, id_usuario
 * }
 * const rows = (await PessoaMestre.insert(dataPessoaMestre)).rows;
 * 
 * ou
 *
 * const data = await PessoaMestre.insert(dataPessoaMestre).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
PessoaMestre.prototype.insert = async (dataPessoaMestre) => {
	let sql = `insert into in_pessoa_mestre
						( id_pessoa, cd_pessoa, id_empresa, id_usuario) 
						values 
						( :id_pessoa, :cd_pessoa, :id_empresa, :id_usuario)
						`;
	try {
		return await Oracle.insert(sql, dataPessoaMestre)
	} catch (err) {
		throw new Error(err);
	}
};

/**
 * Função busca os dados da Pessoa por Código e Empresa
 * 
 * @param {string} cd_pessoa
 * @param {Number} id_empresa
 * @return {Promise} Promrise
 * 
 * @example
 * const rows = (await PessoaMestre.selectByCdPessoa('E44779', 1)).rows;
 * 
 * ou
 *
 * const rows = await PessoaMestre.selectByCdPessoa('E44779', 1).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
PessoaMestre.prototype.selectByCdPessoa = async (cd_pessoa, id_empresa) => {
	let sql = `select id_pessoa, cd_pessoa, id_empresa, id_usuario 
								from in_pessoa_mestre
							where cd_pessoa  = :cd_pessoa
								and id_empresa = :id_empresa`;
	try {
		return await Oracle.select(sql, {cd_pessoa: cd_pessoa, id_empresa: id_empresa})
	} catch (err) {
		throw new Error(err);
	}
};

/**
 * Função busca os dados da Pessoa por Razão Social e Empresa
 * 
 * @param {string} nm_razao_social
 * @param {Number} id_empresa
 * @return {Promise} Promrise
 * 
 * @example
 * const rows = (await PessoaMestre.selectByCdPessoa('PJK FRANCO E CIA LTDA', 1)).rows;
 * 
 * ou
 *
 * const rows = await PessoaMestre.selectByCdPessoa('PJK FRANCO E CIA LTDA', 1).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
PessoaMestre.prototype.selectByRazaoSocial = async (nm_razao_social, id_empresa) => {
	let sql = `select in_pessoa_mestre.id_pessoa, 
										in_pessoa_mestre.cd_pessoa 
								from in_pessoa_item 
							inner join in_pessoa_mestre on in_pessoa_mestre.id_pessoa = in_pessoa_item.id_pessoa 
							where in_pessoa_item.nm_razao_social = :nm_razao_social 
								and in_pessoa_mestre.id_empresa    = :id_empresa`;
	try {
		return await Oracle.select(sql, {nm_razao_social: nm_razao_social, id_empresa: id_empresa})
	} catch (err) {
		throw new Error(err);
	}
};

/**
 * Função busca os dados da Pessoa por CNPJ ou CPF e Empresa
 * 
 * @param {string} nr_cnpj_cpf
 * @param {Number} id_empresa
 * @return {Promise} Promrise
 * 
 * @example
 * const rows = (await PessoaMestre.selectByCpfOrCpnj('08821071000167', '01/12/2019', 1)).rows;
 * 
 * ou
 *
 * const rows = await PessoaMestre.selectByCpfOrCpnj('08821071000167', '01/12/2019', 1).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
PessoaMestre.prototype.selectByCpfOrCpnj = async (nr_cnpj_cpf, dt_inicial, id_empresa) => {
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
		return await Oracle.select(sql, {nr_cnpj_cpf: nr_cnpj_cpf, dt_inicial: dt_inicial, id_empresa: id_empresa})
	} catch (err) {
		throw new Error(err);
	}
};

PessoaMestre.prototype.Item = {}	

Pessoa.prototype.Mestre = new PessoaMestre();

module.exports.Pessoa = Pessoa;

/**
 * Campos da Tabela dataPessoa
 * 
 * @typedef {Object} dataPessoa
 * @property {String} dt_inicial
 * @property {String} cd_pessoa
 * @property {String} nm_razao_social
 * @property {String} ds_endereco
 * @property {String} ds_bairro
 * @property {Number} id_ref_331_municipio
 * @property {String} uf
 * @property {Number} id_ref_331_pais
 * @property {String} nr_cep
 * @property {String} nr_cnpj_cpf
 * @property {String} nr_inscricao_estadual
 * @property {String} dt_movimento
 * @property {String} nr_numero
 * @property {String} ds_complemento
 * @property {String} nr_fone
 * @property {String} dm_contribuinte
 * @property {Number} nr_id_estrangeiro
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 * @global
 */

/**
 * Campos da Tabela dataPessoaMestre
 * 
 * @typedef {Object} dataPessoaMestre
 * @property {Number} id_pessoa
 * @property {String} cd_pessoa
 * @property {Number} id_empresa
 * @property {Number} id_usuario
 */
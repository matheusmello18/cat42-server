const Oracle = require('../Oracle');

module.exports.Saida = {
  insert: async (SfC195Saida = {}) => {
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
}

module.exports.Entrada = {
  insert: async (SfC195Entrada = {}) => {
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
}

/** require('./model').SfC195.Saida.insert
	SfC195.Saida.insert({
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

/** require('./model').SfC195.Entrada.insert
	SfC195.Entrada.insert({
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
const Oracle = require('../Oracle');

module.exports.Saida = {
  insert: async (SfC110Saida = {}) => {
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
}

module.exports.Entrada = {
  insert: async (SfC110Entrada = {}) => {
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
}

/** require('./model').SfC110.Saida.insert
	SfC110.Saida.insert({
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

/** require('./model').SfC110.Entrada.insert
	SfC110.Entrada.insert({
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
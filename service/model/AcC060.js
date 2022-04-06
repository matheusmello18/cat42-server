const Oracle = require('../Oracle');

module.exports.Entrada = {
  insert: async (AcC060Entrada = {}) => {
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
}

/** require('./model').AcC060.Entrada.insert
	AcC060.Entrada.insert({
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
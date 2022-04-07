const Oracle = require('../Oracle');

module.exports.Saida = {
  insert: async (AcC700Saida = {}) => {
    let sql = `insert into ac_c700_saida 
              ( dm_entrada_saida, dm_tipo_ligacao, dm_grupo_tensao, id_ref_331_municipio, nr_chave_nf_eletronica_ref, vl_fornecido, id_nota_fiscal_saida, serie_subserie_documento, nr_documento, dt_emissao_documento, id_modelo_documento, id_empresa, id_usuario) 
              values 
              ( :dm_entrada_saida, :dm_tipo_ligacao, :dm_grupo_tensao, :id_ref_331_municipio, :nr_chave_nf_eletronica_ref, :vl_fornecido, :id_nota_fiscal_saida, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_modelo_documento, :id_empresa, :id_usuario)
              `;
    try {
      await Oracle.insert(sql, AcC700Saida)
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports.Entrada = {
  insert: async (AcC700Entrada = {}) => {
    let sql = `insert into ac_c700_entrada 
              ( dm_tipo_ligacao, dm_grupo_tensao, id_ref_331_municipio, nr_chave_nf_eletronica_ref, vl_fornecido, id_nota_fiscal_entrada, serie_subserie_documento, nr_documento, dt_emissao_documento, id_pessoa_remetente, id_empresa, id_usuario, id_modelo_documento) 
              values 
              ( :dm_tipo_ligacao, :dm_grupo_tensao, :id_ref_331_municipio, :nr_chave_nf_eletronica_ref, :vl_fornecido, :id_nota_fiscal_entrada, :serie_subserie_documento, :nr_documento, :dt_emissao_documento, :id_pessoa_remetente, :id_empresa, :id_usuario, :id_modelo_documento)
              `;
    try {
      await Oracle.insert(sql, AcC700Entrada)
    } catch (err) {
      throw new Error(err);
    }
  }
}

/** require('./model').AcC700.Entrada.insert
	AcC700.Entrada.insert({
		dm_tipo_ligacao:'',
		dm_grupo_tensao:'',
		id_ref_331_municipio:'',
		nr_chave_nf_eletronica_ref:'',
		vl_fornecido:'',
		id_nota_fiscal_entrada:'',
		serie_subserie_documento:'',
		nr_documento:'',
		dt_emissao_documento:'',
		id_pessoa_remetente:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario,
		id_modelo_documento:''
	})
*/

/** require('./model').AcC700.Saida.insert
	AcC700.Saida.insert({
		dm_entrada_saida:'',
		dm_tipo_ligacao:'',
		dm_grupo_tensao:'',
		id_ref_331_municipio:'',
		nr_chave_nf_eletronica_ref:'',
		vl_fornecido:'',
		id_nota_fiscal_saida:'',
		serie_subserie_documento:'',
		nr_documento:'',
		dt_emissao_documento:'',
		id_modelo_documento:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/
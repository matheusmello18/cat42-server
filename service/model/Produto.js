const Oracle = require('../Oracle');

module.exports.insert = async (InProdutoServico = {}) => {
	let sql = `insert into in_produto_servico 
						( cd_produto_servico, cd_barra, ds_produto_servico, id_ref_331_ncm, id_ref_331_ex_ipi, dm_tipo_item, unidade, id_0190, dt_inicial, dt_movimento, id_cest, id_empresa, id_usuario) 
						values 
						( :cd_produto_servico, :cd_barra, :ds_produto_servico, :id_ref_331_ncm, :id_ref_331_ex_ipi, :dm_tipo_item, :unidade, :id_0190, :dt_inicial, :dt_movimento, :id_cest, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, InProdutoServico)
	} catch (err) {
		throw new Error(err);
	}
}

module.exports.sp_gera_produto_mestre_item = async () => {
  try {
    await Oracle.execProcedure('SP_GERA_PRODUTO_MESTRE_ITEM');
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.mestre = {}
module.exports.item = {}
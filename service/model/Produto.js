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
    return await Oracle.execProcedure('SP_GERA_PRODUTO_MESTRE_ITEM');
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Mestre = {
	selectByCodigo: async (cd_produto_servico, id_empresa) => {
    let sql = `select max(id_produto_servico)
								 from in_produto_servico_mestre
							  where upper(cd_produto_servico) = upper(:cd_produto_servico)
								  and id_empresa                = :id_empresa`;
    try {
      return await Oracle.select(sql, {cd_produto_servico: cd_produto_servico, id_empresa: id_empresa})
    } catch (err) {
      throw new Error(err);
    }
  }
}
module.exports.Item = {
	selectByCodigo: async (cd_produto_servico, id_empresa, dt_inicial) => {
    let sql = `select psm.cd_produto_servico, psi.ds_produto_servico, psi.dm_tipo_item
								 from in_produto_servico_mestre psm 
								 left join in_produto_servico_item psi on (psm.id_produto_servico = psi.id_produto_servico) 
							  where psm.id_empresa = :id_empresa
								  and upper(psm.cd_produto_servico) = upper(:cd_produto_servico) 
								  and (psi.dt_inicial = (select max(item.dt_inicial) 
									 												 from in_produto_servico_item item 
																				  where item.id_produto_servico = psi.id_produto_servico 
																					  and item.dt_inicial <= to_date(:dt_inicial, 'DD/MM/YYYY')) 
									    or psi.dt_inicial is null) `;
    try {
      return await Oracle.select(sql, {id_empresa: id_empresa, cd_produto_servico: cd_produto_servico, dt_inicial: dt_inicial})
    } catch (err) {
      throw new Error(err);
    }
  }
}
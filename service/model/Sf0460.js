const Oracle = require('../Oracle');

module.exports.selectByCodigo = async (cd_codigo, id_empresa) => {
  let sql = `select id_0460, cd_obs, id_empresa, dt_inicial, dt_movimento, id_usuario, ds_obs 
               from sf_0460
              where DS_OBS = :cd_codigo
                and id_empresa = :id_empresa
                and rownum = 1`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo, id_empresa: id_empresa})
  } catch (err) {
    throw new Error(err);
  }
}
module.exports.insert = async (Sf0460 = {}) => {
  const nProx_Codigo = await Oracle.proxCod("SF_0460");
  Sf0460.cd_obs = parseInt(nProx_Codigo) + 1;

	let sql = `insert into SF_0460 (cd_obs, id_empresa, dt_inicial, dt_movimento, id_usuario, ds_obs) 
                 values (:cd_obs, :id_empresa, TO_DATE(:dt_inicial,'DD/MM/YYYY'), TO_DATE(:dt_movimento,'DD/MM/YYYY'), :id_usuario, :ds_obs)
						`;
	try {
		return await Oracle.insert(sql, Sf0460).then(async (e) => {
      return await Oracle.select('select id_0460, cd_obs, id_empresa, dt_inicial, dt_movimento, id_usuario, ds_obs from sf_0460 where rowid = :id', {id: e.lastRowid})
      .then((e) => {
        return e.rows[0];
      })
    });
    
	} catch (err) {
		throw new Error(err);
	}
}
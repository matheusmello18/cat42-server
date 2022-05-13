const Oracle = require('../Oracle');

module.exports.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_453, cd_453, ds_453, ds_grupo_cst
               from sf_453
              where cd_453 = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}
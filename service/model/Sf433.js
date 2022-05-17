const Oracle = require('../Oracle');

module.exports.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_433, cd_433, ds_433
               from sf_433
              where cd_433 = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}
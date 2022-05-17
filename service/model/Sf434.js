const Oracle = require('../Oracle');

module.exports.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_434, cd_434, ds_434
               from sf_434
              where cd_434 = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}
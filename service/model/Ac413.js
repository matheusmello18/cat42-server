const Oracle = require('../Oracle');

module.exports.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_413, cd_codigo, ds_descricao
               from ac_413
              where cd_codigo = :cd_codigo`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}
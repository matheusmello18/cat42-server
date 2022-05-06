const Oracle = require('../Oracle');

module.exports.selectByCodigo = async (cd_codigo) => {
  let sql = `select id_ref_431, cd_strib, ds_strib
               from ac_431
              where cd_strib = trim(:cd_codigo)`;
  try {
    return await Oracle.select(sql, {cd_codigo: cd_codigo})
  } catch (err) {
    throw new Error(err);
  }
}
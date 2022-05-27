const Oracle = require('../Oracle');

module.exports.selectByCdModeloDocumento = async (cd_modelo_documento) => {
  let sql = `select id_modelo_documento, cd_modelo_documento, ds_modelo_documento, ds_sigla, ds_modelo 
               from in_modelo_documento
              where cd_modelo_documento = :cd_modelo_documento`;
  try {
    return await Oracle.select(sql, {cd_modelo_documento: cd_modelo_documento})
  } catch (err) {
    throw new Error(err);
  }
}
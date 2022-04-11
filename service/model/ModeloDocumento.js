module.exports.selectByCdModeloDocumento = async (cd_modelo_documento) => {
  let sql = `select id_modelo_documento, cd_modelo_documento, ds_modelo_documento, ds_sigla, ds_modelo 
               from in_modelo_documento
              where cd_modelo_documento = :cd_modelo_documento`;
  try {
  await Oracle.insert(sql, InPessoa)
  } catch (err) {
  throw new Error(err);
  }
}
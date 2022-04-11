module.exports.selectByCdCofp = async (cd_modelo_documento) => {
  let sql = `select nvl(dm_icms_vl_contabil,    'N') dm_icms_vl_contabil, 
                    nvl(dm_vlcontabil_piscofins,'N') dm_vlcontabil_piscofins, 
                    nvl(dm_vlcontabil_ii,       'N') dm_vlcontabil_ii 
               from in_cfop 
              where ((cd_cfop_uf        = :cd_cfop) 
                 or  (cd_cfop_demais_uf = :cd_cfop) 
                 or  (cd_cfop_pais      = :cd_cfop))`;
  try {
  await Oracle.insert(sql, InPessoa)
  } catch (err) {
  throw new Error(err);
  }
}
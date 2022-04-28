const Oracle = require('../Oracle');

module.exports.selectByDsUnidade = async (ds_unidade, id_empresa, dt_inicial) => {
  let sql = `select id_0190, ds_unidade, ds_descricao, id_empresa, id_usuario, dt_inicial, dt_movimento, dm_tipo_unidade 
               from sf_0190 
              where id_empresa = :id_empresa 
                and upper(ds_unidade) = upper(:ds_unidade) 
                and (dt_inicial = (select max(sf.dt_inicial) 
                                     from sf_0190 sf 
                                    where sf.ds_unidade = sf_0190.ds_unidade 
                                      and sf.id_empresa = sf_0190.id_empresa 
                                      and sf.dt_inicial <= to_date(:dt_inicial,'dd/mm/yyyy'))
                 or dt_inicial is null)`;
  try {
    return await Oracle.select(sql, {ds_unidade: ds_unidade, ds_descricao: ds_descricao, id_empresa: id_empresa, dt_inicial: dt_inicial})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.selectDePara = async (ds_unidade_entrada, cnpj_principal, id_empresa) => {
  let sql = `select ds_unidade_saida, ds_descricao_saida, 
                    ds_unidade_entrada, cnpj_principal, id_empresa 
               from comp_unidadee_unidades 
              where ds_unidade_entrada = :ds_unidade_entrada
                and cnpj_principal     = :cnpj_principal
                and id_empresa         = :id_empresa`;
  try {
    return await Oracle.select(sql, {ds_unidade_entrada: ds_unidade_entrada, cnpj_principal: cnpj_principal, id_empresa: id_empresa})
  } catch (err) {
    throw new Error(err);
  }
}
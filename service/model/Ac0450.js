const Oracle = require('../Oracle');

module.exports.select = async (ds_observacao, id_empresa, dt_inicial) => {
  let sql = `select ac.id_ref_0450, ac.cd_observacao, 
                    ac.dt_inicial,  ac.dt_movimento, 
                    ac.ds_observacao
               from ac_0450 ac
              where ac.ds_observacao = :ds_observacao
                and ac.id_empresa    = :id_empresa
                and ac.dt_inicial    = (select max(ac_0450.dt_inicial)
                                          from ac_0450
                                         where ac_0450.ds_observacao = ac.ds_observacao
                                           and ac_0450.id_empresa    = ac.id_empresa
                                           and ac_0450.dt_inicial   <= to_date(:dt_inicial, 'dd/mm/yyyy'))`;
  try {
    return await Oracle.select(sql, {ds_observacao: ds_observacao, id_empresa: id_empresa, dt_inicial: dt_inicial})
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.insert = async (ds_observacao, id_empresa, dt_inicial) => {
  const nProx_Codigo = await Oracle.proxCod("SIMUL_CADASTRO");
  let cd_observacao = parseInt(nProx_Codigo) + 1;
  let sql = `insert into ac_0450(cd_observacao, 
                                 dt_inicial, 
                                 dt_movimento, 
                                 id_empresa, 
                                 id_usuario, 
                                 ds_observacao) 
                          values(:cd_observacao, 
                                 :dt_inicial, 
                                 :dt_movimento, 
                                 :id_empresa, 
                                 :id_usuario, 
                                 :ds_observacao)`;
  try {
    await Oracle.insert(sql, {cd_observacao: cd_observacao, ds_observacao: ds_observacao, id_empresa: id_empresa, dt_inicial: dt_inicial, dt_movimento: dt_inicial})
    return cd_observacao;
  } catch (err) {
    throw new Error(err);
  }
}
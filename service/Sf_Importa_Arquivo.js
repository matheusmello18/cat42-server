const Oracle = require('./Oracle');

const sqlInsert = `insert into sf_importa_texto (id_importa_texto, nr_referencia, ds_conteudo, id_empresa, id_usuario, dt_inicial, dt_final, nr_linha, id_projeto, id_modulo, ds_arquivo ) 
values (SQ_SF_IMPORTA_TEXTO.NEXTVAL, :nr_referencia, :ds_conteudo, :id_empresa, :id_usuario, :dt_inicial, :dt_final, :nr_linha, :id_projeto, :id_modulo, :ds_arquivo)`;

module.exports.Insert = async ( nr_referencia, ds_conteudo, id_empresa, id_usuario, dt_inicial, dt_final, nr_linha, id_projeto, id_modulo, ds_arquivo ) => {
  
  try {
    let params = {
      nr_referencia: nr_referencia,
      ds_conteudo: ds_conteudo,
      id_empresa: id_empresa,
      id_usuario: id_usuario,
      dt_inicial: dt_inicial,
      dt_final: dt_final,
      nr_linha: nr_linha,
      id_projeto: id_projeto,
      id_modulo: id_modulo,
      ds_arquivo: ds_arquivo
    };
    await Oracle.insert(sqlInsert, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

const sqlDelete = `
delete from sf_importa_texto
 where id_empresa = :id_empresa
   and dt_inicial between :dt_inicial and :dt_final
   and id_projeto = :id_projeto
   and id_modulo  = :id_modulo
   and id_usuario = :id_usuario
`;

module.exports.Delete = async (id_projeto, id_modulo, dt_inicial, dt_final, id_empresa, id_usuario) => {
  try {
    let params = {
      id_projeto: id_projeto,
      id_modulo: id_modulo,
      dt_inicial: dt_inicial,
      dt_final: dt_final,
      id_empresa: id_empresa,
      id_usuario: id_usuario
    };

    return await Oracle.delete(sqlDelete, params);
  
  } catch (err) {
    throw new Error(err);
  }
}
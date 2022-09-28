/**
 * Modulo Sf_Importa_Arquivo
 * 
 * @module model/Sf_Importa_Arquivo
 */
const Oracle = require('../Oracle');

/**
 * Classe de Sf_Importa_Arquivo
 * 
 * @constructor
 * @example
 * const Sf_Importa_Arquivo = new Sf_Importa_Arquivo();
 */
var Sf_Importa_Arquivo = function(){
  if(!(this instanceof Sf_Importa_Arquivo))
    return new Sf_Importa_Arquivo();
};

/**
 * Função inserir os dados na Importa Arquivo 
 * 
 * @param {String} nr_referencia
 * @param {String} ds_conteudo
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @param {String|Date} dt_inicial
 * @param {String|Date} dt_final
 * @param {Number} nr_linha
 * @param {Number} id_projeto
 * @param {Number} id_modulo
 * @param {String} ds_arquivo
 * @returns {Promise} Promise
 * @example
 * await Sf_Importa_Arquivo.insert('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao');
 * 
 * ou
 *
 * const data = await Sf_Importa_Arquivo.insert('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
Sf_Importa_Arquivo.prototype.Insert = async ( nr_referencia, ds_conteudo, id_empresa, id_usuario, dt_inicial, dt_final, nr_linha, id_projeto, id_modulo, ds_arquivo ) => {
  const sqlInsert = `insert into sf_importa_texto (id_importa_texto, nr_referencia, ds_conteudo, id_empresa, id_usuario, dt_inicial, dt_final, nr_linha, id_projeto, id_modulo, ds_arquivo ) 
  values (SQ_SF_IMPORTA_TEXTO.NEXTVAL, :nr_referencia, :ds_conteudo, :id_empresa, :id_usuario, :dt_inicial, :dt_final, :nr_linha, :id_projeto, :id_modulo, :ds_arquivo)`;
  
  try {
    let params = {
      nr_referencia: nr_referencia,
      ds_conteudo: ds_conteudo,
      id_empresa: id_empresa,
      id_usuario: id_usuario,
      dt_inicial: { type: Oracle.oracledb.DATE, val: dt_inicial},
      dt_final: { type: Oracle.oracledb.DATE, val: dt_final},
      nr_linha: nr_linha,
      id_projeto: id_projeto,
      id_modulo: id_modulo,
      ds_arquivo: ds_arquivo
    };
    await Oracle.insert(sqlInsert, params).then((result) => { return }).catch((e) => {return});
  
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Função inserir os dados na Importa Arquivo 
 * 
 * @param {array} binds
 * @returns {Promise} Promise
 * @example
 * await Sf_Importa_Arquivo.insert('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao');
 * 
 * ou
 *
 * const data = await Sf_Importa_Arquivo.insert('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
 Sf_Importa_Arquivo.prototype.InsertMany = async ( binds ) => {
  const sqlInsert = `insert into sf_importa_texto (nr_referencia, ds_conteudo, id_empresa, id_usuario, dt_inicial, dt_final, nr_linha, id_projeto, id_modulo, ds_arquivo ) 
  values (:nr_referencia, :ds_conteudo, :id_empresa, :id_usuario, to_date(:dt_inicial,'dd/mm/yyyy'), to_date(:dt_final,'dd/mm/yyyy'), :nr_linha, :id_projeto, :id_modulo, :ds_arquivo)`;
  
  try {
    await Oracle.insertMany(sqlInsert, binds); 
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Função deletar os dados na importa arquivo
 * 
 * @param {Number} id_projeto
 * @param {Number} id_modulo
 * @param {String|Date} dt_inicial
 * @param {String|Date} dt_final
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @returns {Promise} Promise
 * @example
 * await Sf_Importa_Arquivo.Delete(1, 1, '01/08/2019', '31/08/2019', 1, 1);
 * 
 * ou
 *
 * const data = await Sf_Importa_Arquivo.Delete(1, 1, '01/08/2019', '31/08/2019', 1, 1).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar o registro.');
 * })
 */
Sf_Importa_Arquivo.prototype.Delete = async (id_projeto, id_modulo, dt_inicial, dt_final, id_empresa, id_usuario) => {
  const sqlDelete = `
  delete from sf_importa_texto
   where id_empresa = :id_empresa
     and dt_inicial between :dt_inicial and :dt_final
     and id_projeto = :id_projeto
     and id_modulo  = :id_modulo
     and id_usuario = :id_usuario
  `;

  try {
    let params = {
      id_empresa: id_empresa,
      dt_inicial: { type: Oracle.oracledb.DATE, val: dt_inicial},
      dt_final: { type: Oracle.oracledb.DATE, val: dt_final},
      id_projeto: id_projeto,
      id_modulo: id_modulo,
      id_usuario: id_usuario
    };

    await Oracle.delete(sqlDelete, params);
  
  } catch (err) {
    throw new Error(err+'test');
  }
}

/**
 * Função deletar os Logs da importa arquivo
 * 
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @returns {Promise} Promise
 * @example
 * await Sf_Importa_Arquivo.DeleteLog(1, 1);
 * 
 * ou
 *
 * const data = await Sf_Importa_Arquivo.DeleteLog(1, 1).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar o registro.');
 * })
 */
 Sf_Importa_Arquivo.prototype.DeleteLog = async (id_empresa, id_usuario) => {
  const sqlDelete = `
    DELETE
      FROM IN_LOG_IMPORTACAO 
     WHERE ID_EMPRESA = :pId_Empresa 
       AND ID_USUARIO = :pId_Usuario
  `;

  try {
    let params = {
      pId_Empresa: id_empresa,
      pId_Usuario: id_usuario
    };

    await Oracle.delete(sqlDelete, params);
  
  } catch (err) {
    throw new Error(err);
  }
}


/**
 * Função selecionar Log da importa arquivo
 * 
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @returns {Promise} Promise
 * @example
 * const rows = (await Sf_Importa_Arquivo.SelectLogImportacao(1, 1)).rows;
 * 
 * ou
 *
 * const data = await Sf_Importa_Arquivo.SelectLogImportacao(1, 1).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message);
 * })
 */
 Sf_Importa_Arquivo.prototype.SelectLogImportacao = async (id_empresa, id_usuario) => {
  const sqlSelect = `
    SELECT * 
      FROM IN_LOG_IMPORTACAO 
     WHERE ID_EMPRESA = :pId_Empresa 
       AND ID_USUARIO = :pId_Usuario
  `;

  try {
    return await Oracle.select(sqlSelect, {pId_empresa: id_empresa, pId_Usuario: id_usuario})
  } catch (err) {
    throw new Error(err);
  }
}
module.exports.Sf_Importa_Arquivo = Sf_Importa_Arquivo;
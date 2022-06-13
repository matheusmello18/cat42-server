/**
 * Modulo SFImportaArquivo
 * 
 * @module model/SFImportaArquivo
 */
const Oracle = require('../Oracle');

/**
 * Classe de SFImportaArquivo
 * 
 * @constructor
 * @example
 * const SFImportaArquivo = new SFImportaArquivo();
 */
var SFImportaArquivo = function(){
  if(!(this instanceof SFImportaArquivo))
    return new SFImportaArquivo();
};

/**
 * Função inserir os dados do AcC700Saida 
 * 
 * @param {String} nr_referencia
 * @param {String} ds_conteudo
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @param {String} dt_inicial
 * @param {String} dt_final
 * @param {Number} nr_linha
 * @param {Number} id_projeto
 * @param {Number} id_modulo
 * @param {String} ds_arquivo
 * @returns {Promise} Promise
 * @example
 * await SFImportaArquivo.insert('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao');
 * 
 * ou
 *
 * const data = await SFImportaArquivo.insert('1','descricao', 1, 1, '01/08/2019', '31/08/2019', 1, 1, 1, 'descricao').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
SFImportaArquivo.prototype.Insert = async ( nr_referencia, ds_conteudo, id_empresa, id_usuario, dt_inicial, dt_final, nr_linha, id_projeto, id_modulo, ds_arquivo ) => {
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
    await Oracle.insert(sqlInsert, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Função inserir os dados do AcC700Saida 
 * 
 * @param {Number} id_projeto
 * @param {Number} id_modulo
 * @param {String} dt_inicial
 * @param {String} dt_final
 * @param {Number} id_empresa
 * @param {Number} id_usuario
 * @returns {Promise} Promise
 * @example
 * await SFImportaArquivo.Delete(1, 1, '01/08/2019', '31/08/2019', 1, 1);
 * 
 * ou
 *
 * const data = await SFImportaArquivo.Delete(1, 1, '01/08/2019', '31/08/2019', 1, 1).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao deletar o registro.');
 * })
 */
SFImportaArquivo.prototype.Delete = async (id_projeto, id_modulo, dt_inicial, dt_final, id_empresa, id_usuario) => {
  const sqlDelete = `
  delete from sf_importa_texto
   where id_empresa = :id_empresa
     and dt_inicial between :dt_inicial 
                        and :dt_final
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
    throw new Error(err);
  }
}

module.exports.SFImportaArquivo = SFImportaArquivo;
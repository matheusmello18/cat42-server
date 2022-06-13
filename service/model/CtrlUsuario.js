/**
 * Modulo CtrlUsuario
 * 
 * @module model/CtrlUsuario
 * @example
 * const model = require('./model');
 */

const Oracle = require('../Oracle');

/**
 * Classe de CtrlUsuario
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const CtrlUsuario = new model.CtrlUsuario();
 */
var CtrlUsuario = function(){
	if(!(this instanceof CtrlUsuario))
		return new CtrlUsuario();
};

/**
 * Função Busca os dados do CtrlUsuario por Email
 * 
 * @param {string} email
 * @param {string} senha
 * @returns {Promise} Promise
 * @example
 * const rows = (await CtrlUsuario.select('matheus.mello@painelfiscal.com.br','123456')).rows;
 * 
 * ou
 *
 * const rows = await CtrlUsuario.select('matheus.mello@painelfiscal.com.br','123456').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */

CtrlUsuario.prototype.select = async (email, senha = '') => {

  const sql = `SELECT S.ID_SIMUL_CADASTRO,
                      TO_CHAR(S.DT_CADASTRO, 'DD/MM/YYYY') DT_CADASTRO,
                      S.NM_EMPRESA,
                      S.NR_CNPJ,
                      S.NM_CONTATO,
                      S.NR_TELEFONE,
                      S.DS_EMAIL,
                      O.ID_ORGAO, 
                      O.DS_ORGAO,
                      S.DM_ATIVO DM_ATIVO_SIMULADOR,
                      TO_CHAR(S.DT_PERIODO, 'DD/MM/YYYY') DT_PERIODO,
                      C.ID_USUARIO, 
                      C.NM_COMPLETO, 
                      C.E_MAIL, 
                      C.NM_USUARIO, 
                      C.DM_ATIVO DM_ATIVO_USUARIO, 
                      C.HASH_RECOVERY,
                      S.ID_EMPRESA,
                      O.ID_PROJETO,
                      O.ID_MODULO
                 FROM SIMUL_CADASTRO S
                INNER JOIN CTRL_USUARIO C ON (C.ID_USUARIO = S.ID_USUARIO)
                INNER JOIN IN_ORGAO O ON (O.ID_ORGAO = S.ID_ORGAO)
                WHERE C.E_MAIL = :E_MAIL`;
const sqlWhereSenha = ` AND C.SENHA_USUARIO_WEB = :SENHA_USUARIO_WEB`;

  try {
    let qry, params;

    if (senha === ''){
      qry = sql;
      params = {
        E_MAIL: email.toUpperCase(),
      };
    } else {
      qry = sql + sqlWhereSenha;
      params = {
        E_MAIL: email.toUpperCase(),
        SENHA_USUARIO_WEB: senha,
      }
    }

    return await Oracle.select(qry, params);
  
  } catch (err) {
    throw new Error(err);
  }
}


/**
 * Função alterar os dados do CtrlUsuario do hash recovery
 * 
 * @param {number} id
 * @param {string} hash
 * @returns {Promise} Promise
 * @example
 * await CtrlUsuario.updateHash(1, 'AF8ADF87D5F45AF4787SDF');
 * 
 * ou
 *
 * await CtrlUsuario.updateHash(1, 'AF8ADF87D5F45AF4787SDF').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao realizar alteração da hash');
 * })
 */
CtrlUsuario.prototype.updateHash = async (id, hash) => {
  const sqlUpdate = `UPDATE CTRL_USUARIO 
                        SET HASH_RECOVERY = :HASH_RECOVERY 
                      WHERE ID_USUARIO    = :ID_USUARIO`;
  try {
    let params = {
      ID_USUARIO: id,
      HASH_RECOVERY: hash
    };

    return await Oracle.update(sqlUpdate, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Função busca os dados do CtrlUsuario pelo hash recovery
 * 
 * @param {string} hash
 * @returns {Promise} Promise
 * @example
 * const rows = (await CtrlUsuario.selectByHash('AF8ADF87D5F45AF4787SDF')).rows;
 * 
 * ou
 *
 * const rows = await CtrlUsuario.selectByHash('AF8ADF87D5F45AF4787SDF').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
CtrlUsuario.prototype.selectByHash = async (hash) => {

  const sqlHash = `SELECT S.ID_SIMUL_CADASTRO,
                          TO_CHAR(S.DT_CADASTRO, 'DD/MM/YYYY') DT_CADASTRO,
                          S.NM_EMPRESA,
                          S.NR_CNPJ,
                          S.NM_CONTATO,
                          S.NR_TELEFONE,
                          S.DS_EMAIL,
                          O.ID_ORGAO, 
                          O.DS_ORGAO,
                          S.DM_ATIVO DM_ATIVO_SIMULADOR,
                          TO_CHAR(S.DT_PERIODO, 'DD/MM/YYYY') DT_PERIODO,
                          C.ID_USUARIO, 
                          C.NM_COMPLETO, 
                          C.E_MAIL, 
                          C.NM_USUARIO, 
                          C.DM_ATIVO DM_ATIVO_USUARIO, 
                          C.HASH_RECOVERY,
                          S.ID_EMPRESA
                    FROM SIMUL_CADASTRO S
                    INNER JOIN CTRL_USUARIO C ON (C.ID_USUARIO = S.ID_USUARIO)
                    INNER JOIN IN_ORGAO     O ON (O.ID_ORGAO   = S.ID_ORGAO)
                    WHERE C.HASH_RECOVERY = :HASH_RECOVERY`;


  try {
    let params = {
      HASH_RECOVERY: hash,
    };

    return await Oracle.select(sqlHash, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Função alterar os dados da senha do CtrlUsuario pelo id
 * 
 * @param {number} id
 * @param {string} senhaWeb
 * @param {string} senha
 * @returns {Promise} Promise
 * @example
 * await CtrlUsuario.updateSenha(1, '123456', '123456');
 * 
 * ou
 *
 * await CtrlUsuario.updateSenha(1, '123456', '123456').then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao realizar alteração da senha')
 * })
 */

CtrlUsuario.prototype.updateSenha = async (id, senhaWeb, senha) => {

  const sqlUpdateHash = `UPDATE CTRL_USUARIO 
                            SET HASH_RECOVERY     = :HASH_RECOVERY,
                                SENHA_USUARIO_WEB = :SENHA_USUARIO_WEB,
                                SENHA_USUARIO     = :SENHA_USUARIO
                          WHERE ID_USUARIO        = :ID_USUARIO`;

  try {
    let params = {
      ID_USUARIO: id,
      HASH_RECOVERY: null,
      SENHA_USUARIO_WEB: senhaWeb,
      SENHA_USUARIO: senha,
    };

    return await Oracle.update(sqlUpdateHash, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.CtrlUsuario = CtrlUsuario
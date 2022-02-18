const oracledb = require('oracledb');
const Oracle = require('./Oracle');

const sql = `SELECT ID_USUARIO, NM_COMPLETO, E_MAIL, NM_USUARIO, DM_ATIVO, HASH_RECOVERY FROM CTRL_USUARIO WHERE E_MAIL = :E_MAIL`;
const sqlWhereSenha = ` AND SENHA_USUARIO_WEB = :SENHA_USUARIO_WEB`

module.exports.select = async (email, senha = '') => {
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
    console.log(err.message);
  }
}

const sqlUpdate = `UPDATE CTRL_USUARIO SET HASH_RECOVERY = :HASH_RECOVERY WHERE ID_USUARIO = :ID_USUARIO`;

module.exports.updateHash = async (id, hash) => {
  try {
    let params = {
      ID_USUARIO: id,
      HASH_RECOVERY: hash
    };

    return await Oracle.update(sqlUpdate, params);
  
  } catch (err) {
    console.log(err.message);
  }
}

const sqlHash = `SELECT ID_USUARIO, NM_COMPLETO, E_MAIL, NM_USUARIO, DM_ATIVO, HASH_RECOVERY FROM CTRL_USUARIO WHERE HASH_RECOVERY = :HASH_RECOVERY`;

module.exports.selectByHash = async (hash) => {
  try {
    params = {
      HASH_RECOVERY: hash,
    };

    return await Oracle.select(sqlHash, params);
  
  } catch (err) {
    console.log(err.message);
  }
}

const sqlUpdateHash = `UPDATE CTRL_USUARIO 
                          SET HASH_RECOVERY = :HASH_RECOVERY,
                          SENHA_USUARIO_WEB = :SENHA_USUARIO_WEB,
                          SENHA_USUARIO     = :SENHA_USUARIO
                        WHERE ID_USUARIO = :ID_USUARIO`;

module.exports.updateSenha = async (id, senhaWeb, senha) => {
  try {
    let params = {
      ID_USUARIO: id,
      HASH_RECOVERY: null,
      SENHA_USUARIO_WEB: senhaWeb,
      SENHA_USUARIO: senha,
    };

    return await Oracle.update(sqlUpdateHash, params);
  
  } catch (err) {
    console.log(err.message);
  }
}
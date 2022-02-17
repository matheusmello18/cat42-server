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
      HASH_RECOVERY: hash,
      ID_USUARIO: id
    };

    return await Oracle.execute(qry, params, {autoCommit: true});
  
  } catch (err) {
    console.log(err.message);
  }
}
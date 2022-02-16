const oracledb = require('oracledb');
const Oracle = require('./Oracle');

const sql = `SELECT ID_USUARIO, NM_COMPLETO, E_MAIL, NM_USUARIO, DM_ATIVO, ID_EMPRESA FROM CTRL_USUARIO WHERE NM_USUARIO = :NM_USUARIO`;
const sqlWhereSenha = ` AND SENHA_USUARIO = :SENHA_USUARIO`

module.exports.select = async (usuario, senha = '') => {
  try {
    let qry, params;

    if (senha === ''){
      qry = sql;
      params = {
        NM_USUARIO: usuario.toUpperCase(),
      };
    } else {
      qry = sql + sqlWhereSenha;
      params = {
        NM_USUARIO: usuario.toUpperCase(),
        SENHA_USUARIO: senha,
      }
    }

    return await Oracle.select(qry, params);
  
  } catch (err) {
    console.log(err.message);
  }
}
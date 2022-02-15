const oracledb = require('oracledb');
const Oracle = require('./Oracle');

const sql = `SELECT ID_USUARIO, NM_COMPLETO, E_MAIL, NM_USUARIO, DM_ATIVO, ID_EMPRESA FROM CTRL_USUARIO WHERE NM_USUARIO = :NM_USUARIO AND SENHA_USUARIO = :SENHA_USUARIO`;


module.exports.select = async (usuario, senha) => {
  try {
    
    const params = {
      NM_USUARIO: usuario,
      SENHA_USUARIO: senha,
    };

    return await Oracle.select(sql, params);
  
  } catch (err) {
    console.log(err.message);
  }
}
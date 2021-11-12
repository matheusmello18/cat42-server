const oracledb = require('oracledb');
const config = require('../config/Config');

let connection;

module.exports = async (NomeEntidade) => {

  try {
    connection = await oracledb.getConnection(config.db);

    const ProxCodId = await connection.execute(
      `BEGIN
        SP_PROX_CODIGO(:cNome_Entidade, :nProx_Codigo);
       END;`,
      {
        cNome_Entidade:  NomeEntidade,
        nProx_Codigo:  { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }, {autoCommit: true}
    );

    return ProxCodId.outBinds.nProx_Codigo;
  } catch (err) {
    throw new Error(err.message);
  } finally {
    if (connection) {
      try {
        await connection.close();   // Always close connections
      } catch (err) {
        throw new Error(err.message);
      }
    }
  }
}
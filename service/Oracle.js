const oracledb = require('oracledb');
const config = require('../config/Config');

if (process.platform === 'win32') { // Windows
  oracledb.initOracleClient({ libDir: 'D:\\app\\mathe\\product\\11.2.0\\client_1\\instantclient' });
} else if (process.platform === 'darwin') { // macOS
  oracledb.initOracleClient({ libDir: process.env.HOME + '/Downloads/instantclient_19_8' });
}

let connection;

module.exports.insert = async (sql,params) => {
  try {
    connection = await oracledb.getConnection(config.db);

    const result = await connection.execute(
      sql, params, {autoCommit: true}
    );

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

module.exports.select = async (sql,params) => {
  try {
    connection = await oracledb.getConnection(config.db);

    return await connection.execute(
      sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

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
// exempos de como uilizar os oracledb
// https://github.com/oracle/node-oracledb/blob/main/examples
const oracledb = require('oracledb');
const config = require('../config/Config');

if (process.platform === 'win32') { // Windows
  oracledb.initOracleClient({ libDir: 'D:\\app\\mathe\\product\\11.2.0\\client_1\\instantclient' });
} else if (process.platform === 'linux') { // macOS
  oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_21_4' });
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

module.exports.update = async (sql,params) => {
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
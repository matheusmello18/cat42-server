// exempos de como uilizar os oracledb
// https://github.com/oracle/node-oracledb/blob/main/examples
const oracledb = require('oracledb');
const config = require('../config/Config');

if (process.platform === 'win32') { // Windows
  oracledb.initOracleClient({ libDir: config.oracle.libDir });
} else if (process.platform === 'linux') { // macOS
  oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_21_4' });
}

module.exports.oracledb = oracledb;

module.exports.insert = async (sql,params) => {
  let connection;

  try {
    connection = await oracledb.getConnection(config.db);

    return await connection.execute(
      sql, params, {autoCommit: true}
    ).catch(err => {
      if (err.errorNum === 1008){
        throw new Error('Nem todas as variáveis ​​vinculadas');
      } else{
        throw new Error(err);
      }
    });

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
  let connection;

  try {
    connection = await oracledb.getConnection(config.db);

    return await connection.execute(
      sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    ).catch(err => {
      throw new Error(err);
    });
  
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
  let connection;

  try {
    connection = await oracledb.getConnection(config.db);

    await connection.execute(
      sql, params, {autoCommit: true}
    ).catch(err => {
      throw new Error(err);
    });

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

module.exports.delete = async (sql,params) => {
  let connection;

  try {
    connection = await oracledb.getConnection(config.db);

    return await connection.execute(
      sql, params, {autoCommit: true}
    ).catch(err => {
      throw new Error(err);
    }); 

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

module.exports.proxCod = async (NomeEntidade) => {
  let connection;

  try {
    connection = await oracledb.getConnection(config.db);

    const ProxCodId = await connection.execute(
      `BEGIN
        SP_PROX_CODIGO(:cNome_Entidade, :nProx_Codigo);
        END;`,
      {
        cNome_Entidade:  NomeEntidade,
        nProx_Codigo:  { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    ).catch(err => {
      throw new Error(err);
    });

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

module.exports.execProcedure = async (nm_procedure, nameByName = {}) => {
  let connection;

  try {
    connection = await oracledb.getConnection(config.db);

    var params = '';
    Object.keys(nameByName).forEach(element => {
      params = params + `:${element},`;
    });
    params = params.substring(0, params.length-1);

    await connection.execute(
      `BEGIN
        ${nm_procedure}(${params});
       END;`,
      nameByName,
    ).catch(err => {
      throw new Error(err);
    });
    
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
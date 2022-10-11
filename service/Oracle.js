// exempos de como uilizar os oracledb
// https://github.com/oracle/node-oracledb/blob/main/examples
const oracledb = require('oracledb');
const config = require('../config/Config');
const dbConfig = config.db;
if (process.platform === 'win32') { // Windows
  oracledb.initOracleClient({ libDir: config.oracle.libDir21 });
} else if (process.platform === 'linux') { // macOS
  oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_21_4' });
}

module.exports.oracledb = oracledb;

module.exports.monitorLogError = async (ds_query, JsonParams, msgError) => {
  let connection;

  let sql = `insert into simul_monitor_log_error 
               (ds_query, ds_params, ds_error, dt_monitor)
            values
               (:ds_query, :ds_params, ds_error, :dt_monitor)`
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    let objParams = {
      ds_query: ds_query,
      ds_params: JSON.stringify(JsonParams),
      ds_error: msgError,
      dt_monitor: { type: oracledb.DATE, val: new Date() },      
    };

    return await connection.execute(
      sql, objParams, {autoCommit: true}
    ).catch(err => {
      // gravar em arquivo de log
    });

  } catch (err) {
    // gravar em arquivo de log
  } finally {
    if (connection) {
      try {
        await connection.close();   // Always close connections
      } catch (err) {
        // gravar em arquivo de log
      }
    }
  }
}

module.exports.insert = async (sql,params) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    return await connection.execute(
      sql, params, {autoCommit: true}
    ).catch(err => {
      module.exports.monitorLogError(sql, params, err.message);

      if (err.errorNum === 1008){
        throw new Error('Nem todas as variáveis ​​vinculadas');
      } else{
        throw err;
      }
    });

  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();   // Always close connections
      } catch (err) {
        throw err
      }
    }
  }
}

module.exports.insertMany = async (sql,binds) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    return await connection.executeMany(
      sql, binds, {autoCommit: true}
    ).catch(err => {
      module.exports.monitorLogError(sql, binds, err.message);

      if (err.errorNum === 1008){
        throw new Error('Nem todas as variáveis ​​vinculadas');
      } else{
        throw err
      }
    });

  } catch (err) {
    throw err
  } finally {
    if (connection) {
      try {
        await connection.close();   // Always close connections
      } catch (err) {
        throw err
      }
    }
  }
}

module.exports.select = async (sql,params) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    return await connection.execute(
      sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    ).catch(err => {
      module.exports.monitorLogError(sql, params, err.message);

      throw err
    });
  
  } catch (err) {
    throw err
  } finally {
    if (connection) {
      try {
        await connection.close();   // Always close connections
      } catch (err) {
        throw err
      }
    }
  }
}

module.exports.update = async (sql,params) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      sql, params, {autoCommit: true}
    ).catch(err => {
      module.exports.monitorLogError(sql, params, err.message);

      throw err
    });

  } catch (err) {
    throw err
  } finally {
    if (connection) {
      try {
        await connection.close();   // Always close connections
      } catch (err) {
        throw err
      }
    }
  }
}

module.exports.delete = async (sql,params) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    return await connection.execute(
      sql, params, {autoCommit: true}
    ).catch(err => {
      module.exports.monitorLogError(sql, params, err.message);

      throw err
    }); 

  } catch (err) {
    throw err
  } finally {
    if (connection) {
      try {
        await connection.close();   // Always close connections
      } catch (err) {
        throw err
      }
    }
  }
}

module.exports.proxCod = async (NomeEntidade) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    let sql =
    `BEGIN
       SP_PROX_CODIGO(:cNome_Entidade, :nProx_Codigo);
     END;`;

     let params = {
      cNome_Entidade:  NomeEntidade,
      nProx_Codigo:  { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
    };

    const ProxCodId = await connection.execute(
      sql, params
    ).catch(err => {
      module.exports.monitorLogError(sql, params, err.message);

      throw err
    });

    return ProxCodId.outBinds.nProx_Codigo;
    
  } catch (err) {
    throw err
  } finally {
    if (connection) {
      try {
        await connection.close();   // Always close connections
      } catch (err) {
        throw err
      }
    }
  }
}

module.exports.execProcedure = async (nm_procedure, nameByName = {}) => {

  try {
    var params = '';
    Object.keys(nameByName).forEach(element => {
      params = params + `:${element},`;
    });
    params = params.substring(0, params.length-1);

    
    let connection = await oracledb.getConnection(dbConfig);

    let query = 
    `BEGIN
      ${nm_procedure.trim()}(${params});
    END;`

    await connection.execute(
      query,
      nameByName, {autoCommit: true}
    ).then((v) => {
      console.log(v);
    }).catch(err => {
      module.exports.monitorLogError(query, params, err.message);

      console.log(err);
      throw err
    });
  } catch (err) {
    console.log(err);
    throw err
  }
}

const exec_procedure_asynchronous = (nm_procedure, nameByName = {}) => {
  console.log(nm_procedure, nameByName);
  try {
    var params = '';
    Object.keys(nameByName).forEach(element => {
      params = params + `:${element},`;
    });
    params = params.substring(0, params.length-1);

    
    oracledb.getConnection(dbConfig, (err, connection) => {
      if (err)
        throw err

      let query = 
      `BEGIN 
        ${nm_procedure.trim()}(${params}); 
       END;`;
      connection.execute(
        query,
        nameByName, ((err, result) => {
          if (err){
            module.exports.monitorLogError(query, params, err.message);
            throw err
          }
        })
      );

      connection.close();
    });    
  } catch (err) {
    console.log(err);
    throw err
  }
}

module.exports.execLargProcedure = async (nm_procedure, nameByName = {}) => {
  const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  try{
    let terminou = '0'
    
    await module.exports.delete(`
      DELETE FROM SIMUL_SEMAFORO 
       WHERE ID_USUARIO = :pId_Usuario
         and ID_EMPRESA = :pId_Empresa
         and DT_PERIODO = :pDt_Inicial`, 
      {
        pId_Usuario:nameByName.pId_Usuario,
        pId_Empresa:nameByName.pId_Empresa,
        pDt_Inicial:nameByName.pDt_Inicial,
      }
    );
    await module.exports.insert(
      `INSERT INTO SIMUL_SEMAFORO
          (ID_USUARIO, DM_TERMINOU, ID_EMPRESA, DT_PERIODO) 
       VALUES
          (:pId_Usuario, :dm_terminou, :pId_Empresa, :pDt_Inicial)`,
      {
        pId_Usuario:nameByName.pId_Usuario, 
        dm_terminou:'0',
        pId_Empresa:nameByName.pId_Empresa,
        pDt_Inicial:nameByName.pDt_Inicial,
      }
    );

    exec_procedure_asynchronous(nm_procedure,nameByName);
    
    while (terminou === '0') {
      console.log('object');
      await sleep(60000).then( async(v) => {
        const row = (await module.exports.select(
          `select DM_TERMINOU 
             from SIMUL_SEMAFORO 
            where ID_USUARIO = :pId_Usuario
              and ID_EMPRESA = :pId_Empresa
              and DT_PERIODO = :pDt_Inicial `, 
          {
            pId_Usuario:nameByName.pId_Usuario,
            pId_Empresa:nameByName.pId_Empresa,
            pDt_Inicial:nameByName.pDt_Inicial,
          }
        )).rows[0]
        console.log(row);
        terminou = row.DM_TERMINOU;
      })
    }

    
  } catch(err){
    throw err
  }

};
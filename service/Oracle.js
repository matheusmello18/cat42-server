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
  let connection = await oracledb.getConnection(dbConfig);
  
  let sqlMaxId = 'select nvl(max(id_simul_monitor_log_error),0)+1 id_simul_monitor_log_error from simul_monitor_log_error';

  let idMonitor;

  try {
      idMonitor = await connection.execute(
      sqlMaxId, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    ).catch(async (err) => {
      throw err
    }).then((v) => {
      return v.rows[0].ID_SIMUL_MONITOR_LOG_ERROR
    })
  } catch (err) {
    // gravar em arquivo
  }

  let sql = `insert into simul_monitor_log_error 
               (id_simul_monitor_log_error, ds_query, ds_params, ds_error, dt_monitor)
            values
               (:id_simul_monitor_log_error, :ds_query, :ds_params, :ds_error, :dt_monitor)`
  try {
    
    
    let objParams = {
      id_simul_monitor_log_error: idMonitor,
      ds_query: ds_query,
      ds_params: JSON.stringify(JsonParams),
      ds_error: msgError,
      dt_monitor: { type: oracledb.DATE, val: new Date() },      
    };

    await connection.execute(
      sql, objParams, {autoCommit: true}
    ).catch(err => {
      //gravar em arquivo de log
    });

    return idMonitor;

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
    ).catch(async (err) => {
      const code = (await module.exports.monitorLogError(sql, params, err.stack));
      err.code = code

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
    ).catch(async (err) => {
      const code = (await module.exports.monitorLogError(sql, binds, err.stack));
      err.code = code
      
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
    ).catch(async (err) => {
      const code = (await module.exports.monitorLogError(sql, params, err.stack));
      err.code = code

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
    ).catch(async (err) => {
      const code = (await module.exports.monitorLogError(sql, params, err.stack));
      err.code = code

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
    ).catch(async (err) => {
      const code = (await module.exports.monitorLogError(sql, params, err.stack));
      err.code = code

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
    ).catch(async (err) => {
      const code = (await module.exports.monitorLogError(sql, params, err.stack));
      err.code = code

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
    }).catch(async (err) => {
      const code = (await module.exports.monitorLogError(query, params, err.stack));
      err.code = code

      throw err
    });
  } catch (err) {
    throw err
  }
}

const exec_procedure_asynchronous = (nm_procedure, nameByName = {}) => {
  try {
    var params = '';
    Object.keys(nameByName).forEach(element => {
      params = params + `:${element},`;
    });
    params = params.substring(0, params.length-1);


    let query = 
    `BEGIN 
      ${nm_procedure.trim()}(${params}); 
     END;`;
     
    oracledb.getConnection(dbConfig, (err, connection) => {
      if (err)
        throw err

      connection.execute(
        query,
        nameByName, ((err, result) => {
          if (err){
            throw err
          }
        })
      );

      connection.close();
    });    
  } catch (err) {
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

    try {
      exec_procedure_asynchronous(nm_procedure,nameByName);
    } catch (err) {
      const code = (await module.exports.monitorLogError(nm_procedure, nameByName, err.stack));
      err.code = code
      throw err
    }
    
    while (terminou === '0') {
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
        terminou = row.DM_TERMINOU;
      })
    }

  } catch(err){
    throw err
  }

};
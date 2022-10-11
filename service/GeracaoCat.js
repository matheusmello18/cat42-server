const Oracle = require('./Oracle');

/**
 * 
 * @param {number} id_simul_etapa 
 * @param {number} id_empresa 
 * @param {number} id_usuario 
 * @param {String} dt_periodo 
 * @param {String} nm_procedure1 
 * @param {String} nm_procedure2 
 */
module.exports.Cat42 = async (id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {
  
  try {
    var dateParts = dt_periodo.split("/");
    var dt_inicial = new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, 1);
    var dt_final = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]), 0);
  
    var paramProcedures = {
      pId_Empresa: id_empresa,
      pDt_Inicial: {type: Oracle.oracledb.DATE, val: dt_inicial },
      pDt_Final: {type: Oracle.oracledb.DATE, val: dt_final },
      pId_Usuario: id_usuario,
    }

    var paramProcedures2 = {
      pId_Empresa: id_empresa,
      pId_Usuario: id_usuario,
      pDt_Inicial: {type: Oracle.oracledb.DATE, val: dt_inicial },
      pDt_Final: {type: Oracle.oracledb.DATE, val: dt_final },
    }
    
    if (nm_procedure1 !== undefined){
      if(nm_procedure1.trim() !== "")
        await Oracle.execProcedure(nm_procedure1, paramProcedures);
    }
    if (nm_procedure2 !== undefined)
      if(nm_procedure2.trim() !== ""){
        await Oracle.execProcedure(nm_procedure2, paramProcedures2);  
      }
  } catch (err) {
    throw err
  }
  
}
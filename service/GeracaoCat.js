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
  
    if (nm_procedure1 !== undefined || nm_procedure1 !== "")
      await Oracle.execProcedure(nm_procedure1, { 
        pDt_Inicial: dt_inicial,
        pDt_Final: dt_final,
        pId_Empresa: id_empresa,
        pId_Usuario: id_usuario,
      });
    if (nm_procedure2 !== undefined || nm_procedure2 !== "")
      await Oracle.execProcedure(nm_procedure2, {id_empresa: id_empresa, id_usuario: id_usuario});  
  } catch (error) {
    throw new Error(error.message);
  }
  
}
const oracledb = require('oracledb');
const Oracle = require('./Oracle');

const sql = `
SELECT S.ID_SIMUL_STATUS,
       to_char(S.DT_PERIODO, 'dd/mm/yyyy') DT_PERIODO,
       T.ID_SIMUL_TP_STATUS,
       T.CD_STATUS,
       T.DS_STATUS,
       S.DS_STATUS DS_STATUS_LOG,
       S.ID_SIMUL_ETAPA,
       S.ID_EMPRESA,
       S.ID_USUARIO
  FROM SIMUL_ETAPA_STATUS S 
 INNER JOIN SIMUL_TIPO_STATUS T ON S.ID_SIMUL_TP_STATUS = T.ID_SIMUL_TP_STATUS
 WHERE S.ID_SIMUL_ETAPA = :id_simul_etapa
   AND S.ID_EMPRESA     = :id_empresa
   AND S.ID_USUARIO     = :id_usuario
`;

module.exports.select = async (id_empresa, id_usuario, id_simul_etapa) => {
  try {
    let params;

    params = {
      id_simul_etapa: parseInt(id_simul_etapa),
      id_empresa: parseInt(id_empresa),
      id_usuario: parseInt(id_usuario),
    };

    return await Oracle.select(sql, params);
  
  } catch (err) {
    console.log(err.message);
  }
}
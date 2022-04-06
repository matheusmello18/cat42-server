const Oracle = require('../Oracle');

const sql = `SELECT ID_EMPRESA, 
                    NM_FANTASIA, 
                    NM_EMPRESA, 
                    INSCR_EMPRESA, 
                    REPLACE(REPLACE(REPLACE(CNPJ_EMPRESA,'.',''),'/',''),'-','') CNPJ_EMPRESA
               FROM CTRL_EMPRESA 
              WHERE ID_EMPRESA = :ID_EMPRESA`;


module.exports.select = async (id_empresa) => {
  try {
    let params;

    params = {
      ID_EMPRESA: parseInt(id_empresa),
    };

    return await Oracle.select(sql, params);
  
  } catch (err) {
    throw new Error(err);
  }
}
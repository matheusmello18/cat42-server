const oracledb = require('oracledb');
const Oracle = require('./Oracle');
const ProxCod = require('./ProxCod');


const insert = `INSERT INTO SIMUL_CADASTRO (ID_SIMUL_CADASTRO, DT_CADASTRO, NM_EMPRESA, NR_CNPJ, NM_CONTATO, NR_TELEFONE, DS_EMAIL) 
                VALUES (:ID_SIMUL_CADASTRO, :DT_CADASTRO, :NM_EMPRESA, :NR_CNPJ, :NM_CONTATO, :NR_TELEFONE, :DS_EMAIL)`;

module.exports.inserir = async (obj) => {
  try {
    const nProx_Codigo = await ProxCod("SIMUL_CADASTRO");

    const params = {
      ID_SIMUL_CADASTRO: nProx_Codigo,
      DT_CADASTRO: { type: oracledb.DATE, val: new Date()},
      NM_EMPRESA: obj.nome_empresa,
      NR_CNPJ: obj.cnpj.replace(".","").replace(".","").replace("-","").replace("/",""),
      NM_CONTATO: obj.nome_contato,
      NR_TELEFONE: obj.telefone.replace("(","").replace(")","").replace("-",""),
      DS_EMAIL: obj.email,
    };

    await Oracle.insert(insert, params);

    return nProx_Codigo;
  } catch (err) {
    console.log(err.message);
  }
}

const sql = `SELECT * FROM SIMUL_CADASTRO ORDER BY ID_SIMUL_CADASTRO`;
const sqlWhere = `SELECT * FROM SIMUL_CADASTRO WHERE ID_SIMUL_CADASTRO = :ID_SIMUL_CADASTRO`;


module.exports.select = async (id = '') => {
  try {
    if (id !== ''){
      const params = {
        ID_SIMUL_CADASTRO: id,
      };

      return await Oracle.select(sqlWhere, params);
    } else {
      return await Oracle.select(sql, {});
    }
    
  } catch (err) {
    console.log(err.message);
  }
}
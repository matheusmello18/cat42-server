const oracledb = require('oracledb');
const Oracle = require('./Oracle');


const insert = `INSERT INTO SIMUL_CADASTRO (ID_SIMUL_CADASTRO, DT_CADASTRO, NM_EMPRESA, NR_CNPJ, NM_CONTATO, NR_TELEFONE, DS_EMAIL) 
                VALUES (:ID_SIMUL_CADASTRO, :DT_CADASTRO, :NM_EMPRESA, :NR_CNPJ, :NM_CONTATO, :NR_TELEFONE, :DS_EMAIL)`;

module.exports.inserir = async (obj) => {
  try {
    const nProx_Codigo = await Oracle.proxCod("SIMUL_CADASTRO");

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
    throw new Error(err);
  }
}

module.exports.update = async (obj) => {
  let sqlUpdate = `UPDATE SIMUL_CADASTRO 
  SET NM_EMPRESA = :NM_EMPRESA,
      NM_CONTATO = :NM_CONTATO,
      NR_TELEFONE = :NR_TELEFONE 
WHERE ID_SIMUL_CADASTRO = :ID_SIMUL_CADASTRO`;
  try {
    
    const params = {
      ID_SIMUL_CADASTRO: obj.ID_SIMUL_CADASTRO,
      NM_EMPRESA: obj.NM_EMPRESA,
      NM_CONTATO: obj.NM_CONTATO,
      NR_TELEFONE: obj.NR_TELEFONE
    };

    await Oracle.update(sqlUpdate, params);

  } catch (err) {
    throw new Error(err);
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
    throw new Error(err);
  }
}
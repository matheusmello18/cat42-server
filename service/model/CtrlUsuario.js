const Oracle = require('../Oracle');

const sql = `SELECT S.ID_SIMUL_CADASTRO,
                    TO_CHAR(S.DT_CADASTRO, 'DD/MM/YYYY') DT_CADASTRO,
                    S.NM_EMPRESA,
                    S.NR_CNPJ,
                    S.NM_CONTATO,
                    S.NR_TELEFONE,
                    S.DS_EMAIL,
                    O.ID_ORGAO, 
                    O.DS_ORGAO,
                    S.DM_ATIVO DM_ATIVO_SIMULADOR,
                    TO_CHAR(S.DT_PERIODO, 'DD/MM/YYYY') DT_PERIODO,
                    C.ID_USUARIO, 
                    C.NM_COMPLETO, 
                    C.E_MAIL, 
                    C.NM_USUARIO, 
                    C.DM_ATIVO DM_ATIVO_USUARIO, 
                    C.HASH_RECOVERY,
                    S.ID_EMPRESA,
                    O.ID_PROJETO,
                    O.ID_MODULO
               FROM SIMUL_CADASTRO S
              INNER JOIN CTRL_USUARIO C ON (C.ID_USUARIO = S.ID_USUARIO)
              INNER JOIN IN_ORGAO O ON (O.ID_ORGAO = S.ID_ORGAO)
              WHERE C.E_MAIL = :E_MAIL`;
const sqlWhereSenha = ` AND C.SENHA_USUARIO_WEB = :SENHA_USUARIO_WEB`;

module.exports.select = async (email, senha = '') => {
  try {
    let qry, params;

    if (senha === ''){
      qry = sql;
      params = {
        E_MAIL: email.toUpperCase(),
      };
    } else {
      qry = sql + sqlWhereSenha;
      params = {
        E_MAIL: email.toUpperCase(),
        SENHA_USUARIO_WEB: senha,
      }
    }

    return await Oracle.select(qry, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

const sqlUpdate = `UPDATE CTRL_USUARIO 
                      SET HASH_RECOVERY = :HASH_RECOVERY 
                    WHERE ID_USUARIO    = :ID_USUARIO`;

module.exports.updateHash = async (id, hash) => {
  try {
    let params = {
      ID_USUARIO: id,
      HASH_RECOVERY: hash
    };

    return await Oracle.update(sqlUpdate, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

const sqlHash = `SELECT S.ID_SIMUL_CADASTRO,
                        TO_CHAR(S.DT_CADASTRO, 'DD/MM/YYYY') DT_CADASTRO,
                        S.NM_EMPRESA,
                        S.NR_CNPJ,
                        S.NM_CONTATO,
                        S.NR_TELEFONE,
                        S.DS_EMAIL,
                        O.ID_ORGAO, 
                        O.DS_ORGAO,
                        S.DM_ATIVO DM_ATIVO_SIMULADOR,
                        TO_CHAR(S.DT_PERIODO, 'DD/MM/YYYY') DT_PERIODO,
                        C.ID_USUARIO, 
                        C.NM_COMPLETO, 
                        C.E_MAIL, 
                        C.NM_USUARIO, 
                        C.DM_ATIVO DM_ATIVO_USUARIO, 
                        C.HASH_RECOVERY,
                        S.ID_EMPRESA
                   FROM SIMUL_CADASTRO S
                  INNER JOIN CTRL_USUARIO C ON (C.ID_USUARIO = S.ID_USUARIO)
                  INNER JOIN IN_ORGAO     O ON (O.ID_ORGAO   = S.ID_ORGAO)
                  WHERE C.HASH_RECOVERY = :HASH_RECOVERY`;

module.exports.selectByHash = async (hash) => {
  try {
    params = {
      HASH_RECOVERY: hash,
    };

    return await Oracle.select(sqlHash, params);
  
  } catch (err) {
    throw new Error(err);
  }
}

const sqlUpdateHash = `UPDATE CTRL_USUARIO 
                          SET HASH_RECOVERY     = :HASH_RECOVERY,
                              SENHA_USUARIO_WEB = :SENHA_USUARIO_WEB,
                              SENHA_USUARIO     = :SENHA_USUARIO
                        WHERE ID_USUARIO        = :ID_USUARIO`;

module.exports.updateSenha = async (id, senhaWeb, senha) => {
  try {
    let params = {
      ID_USUARIO: id,
      HASH_RECOVERY: null,
      SENHA_USUARIO_WEB: senhaWeb,
      SENHA_USUARIO: senha,
    };

    return await Oracle.update(sqlUpdateHash, params);
  
  } catch (err) {
    throw new Error(err);
  }
}
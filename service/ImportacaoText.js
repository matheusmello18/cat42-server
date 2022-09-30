const Oracle = require('./Oracle');
const model = require('./model');
const utils = require('../utils');
const nReadlines = require('n-readlines');
var readline = require('linebyline');

module.exports.Text = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2, id_modulo, id_projeto) => {

  var dateParts = dt_periodo.split("/");
  var dt_inicial = new Date(dateParts[2], dateParts[1]-1, 1);
  var dt_final = new Date(dateParts[2], dateParts[1], 0);

  
  await new model.Sf_Importa_Arquivo().DeleteLog(
    id_empresa, 
    id_usuario
  );

  await new model.Sf_Importa_Arquivo().Delete(
    id_projeto, 
    id_modulo, 
    dt_inicial, 
    dt_final, 
    id_empresa, 
    id_usuario
  );

  const broadbandLines = new nReadlines(path);
  let nr_linha = 0;
  let nextline, linha, arrLinha;
  let binds =[]

  while (nextline = broadbandLines.next()) {
    nr_linha = nr_linha + 1;
    linha = nextline.toString('ascii');
    arrLinha = linha.split("|");
    binds.push({
      nr_referencia: arrLinha[1],
      ds_conteudo: linha,
      id_empresa: id_empresa,
      id_usuario: id_usuario,
      dt_inicial:  utils.FormatarData.DateNodeToDateOracleString(dt_inicial),
      dt_final: utils.FormatarData.DateNodeToDateOracleString(dt_final),
      nr_linha: nr_linha,
      id_projeto: id_projeto,
      id_modulo: id_modulo,
      ds_arquivo: filename
    });
  }

  await new model.Sf_Importa_Arquivo().InsertMany(binds);

  if (nm_procedure1 !== undefined){
    if (nm_procedure1.trim() !== ""){
      try {
        await Oracle.execLargProcedure(nm_procedure1, 
          { 
            pDt_Inicial: { type: Oracle.oracledb.DATE, val: dt_inicial},
            pDt_Final: { type: Oracle.oracledb.DATE, val: dt_final},
            pId_Empresa: parseInt(id_empresa),
            pId_Usuario: parseInt(id_usuario),
            pId_Projeto: parseInt(id_projeto),
            pId_Modulo: parseInt(id_modulo),
            pRemove: 1,
            pEmissPropria: 1,
            pCupomFiscalE: 1,
            pCad_Aux: 0
          }
        );
      } catch (err) {
        console.log(err.message);
        /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
        await new model.EtapaStatus().insert(dt_periodo, 3, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message.split(/\sORA-[0-9]*:/)[1].trim());
        throw new Error(err.message);
      }
    }
  }

  const rows = await new model.Sf_Importa_Arquivo().SelectLogImportacao(id_empresa, id_usuario).then((data) => {
    return data.rows;
  }).catch((err) => {
    console.log(err.message);
    throw new Error(err.message);
  })
  
  if (rows.length > 0){
    if (nm_procedure2 !== undefined){
      if (nm_procedure2.trim() !== ""){
        console.log('tem dados');
        var paramProcedures = {
          pId_Simul_Etapa: id_simul_etapa,
          pId_Empresa: id_empresa,
          pId_Usuario: id_usuario,
          pDt_Inicial: {type: Oracle.oracledb.DATE, val: dt_inicial },
          pDt_Final: {type: Oracle.oracledb.DATE, val: dt_final }
        }
        await Oracle.execLargProcedure(nm_procedure2, paramProcedures);
      }
    }
  } else {
    await new model.EtapaStatus().insert(dt_periodo, 1, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Dados importado com sucesso.');
  }
}
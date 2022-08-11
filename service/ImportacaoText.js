const Oracle = require('./Oracle');
const model = require('./model');
const nReadlines = require('n-readlines');

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
  
  while (nextline = broadbandLines.next()) {
    nr_linha = nr_linha + 1;
    linha = nextline.toString('ascii');
    arrLinha = linha.split("|");

    try {
      await new model.Sf_Importa_Arquivo().Insert(
        arrLinha[1],
        linha,
        id_empresa,
        id_usuario,
        dt_inicial, 
        dt_final, 
        nr_linha,
        id_projeto,
        id_modulo,
        filename
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  if (nm_procedure1 !== undefined || nm_procedure1.trim() !== ""){
    try {
      await Oracle.execProcedure(nm_procedure1, 
        { 
          pDt_Inicial: dt_inicial,
          pDt_Final: dt_final,
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
      /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
      await new model.EtapaStatus().insert(dt_periodo, 3, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message.split(/\sORA-[0-9]*:/)[1].trim());
      throw new Error(err.message);
    }
  }

  const rows = await new model.Sf_Importa_Arquivo().SelectLogImportacao(id_empresa, id_usuario).then((data) => {
    return data.rows;
  }).catch((err) => {
    throw new Error(err.message);
  })

  if (rows.length > 0){
    if (nm_procedure2 !== undefined || nm_procedure2.trim() !== "")
      await Oracle.execProcedure(nm_procedure2, {pId_Simul_Etapa: id_simul_etapa, pId_Empresa: id_empresa, pId_Usuario: id_usuario, pDt_Inicial: dt_inicial, pDt_Final: dt_final});
  } else {
    await new model.EtapaStatus().insert(dt_periodo, 1, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Dados importado com sucesso.');
  }
}
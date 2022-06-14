const model = require('./model');
const impXmlSaida = require('./ImportacaoXMLSaida');
const impXmlEntrada = require('./ImportacaoXMLEntrada');
const parseString = require('xml2js').parseString;
const fs = require("fs");


//deletar se existe o registro e importar novamnete;
//tomar atenção para este procedimento em outras importação se isso será necessário
//importar o cupom fiscal c800 e c850
//criar verificação que aceita somente modelo 55 e cupom fiscal (procurar seu modelo)
/**
 * 
 * @param {String} filename 
 * @param {String} path 
 * @param {number} id_simul_etapa 
 * @param {number} id_empresa 
 * @param {number} id_usuario 
 * @param {String} dt_periodo 
 * @param {String} nm_procedure1 
 * @param {String} nm_procedure2 
 */
module.exports.XmlSaida = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

  fs.readFile(path, "utf8", async (err, xml) => {
    if (err) {
      await new model.EtapaStatus().insert(dt_periodo, 2, id_simul_etapa, id_empresa, id_usuario, err.message);
      throw new Error(err.message);
    }
    parseString(xml, async function (err, xmlObj) {
      if (err) {
        await new model.EtapaStatus().insert(dt_periodo, 2, id_simul_etapa, id_empresa, id_usuario, err.message);
        throw new Error(err.message);
      }

      if (xmlObj.nfeProc !== undefined){
        await impXmlSaida.Nfe(xmlObj, id_simul_etapa, id_empresa, id_usuario, dt_periodo).catch(async (err) => {
          await new model.EtapaStatus().insert(dt_periodo, 2, id_simul_etapa, id_empresa, id_usuario, err.message);
        });
			} else if (xmlObj.CFe !== undefined) { //c800
        await impXmlSaida.Cfe(xmlObj, id_simul_etapa, id_empresa, id_usuario, dt_periodo).catch(async (err) => {
          await new model.EtapaStatus().insert(dt_periodo, 2, id_simul_etapa, id_empresa, id_usuario, err.message);
        });
      } else {
        await new model.EtapaStatus().insert(dt_periodo, 2, id_simul_etapa, id_empresa, id_usuario, 'XML fora do padrão da importação.');
      }
    })
  });
  
  //Oracle.execProcedure(nm_procedure1, id_empresa, id_usuario);
  //Oracle.execProcedure(nm_procedure2, id_empresa, id_usuario);
  
  await new model.EtapaStatus().insert(dt_periodo, 1, id_simul_etapa, id_empresa, id_usuario, 'Dados importado com sucesso.');
}


module.exports.XmlEntrada = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

  fs.readFile(path, "utf8", async (err, xml) => {
    if (err) {
      await new model.EtapaStatus().insert(dt_periodo, 2, id_simul_etapa, id_empresa, id_usuario, err.message);
      throw new Error(err.message);
    }
    parseString(xml, async function (err, xmlObj) {
      if (err) {
        await new model.EtapaStatus().insert(dt_periodo, 2, id_simul_etapa, id_empresa, id_usuario, err.message);
        throw new Error(err.message);
      }

      if (xmlObj.nfeProc !== undefined){
        await impXmlEntrada.Nfe(xmlObj, id_simul_etapa, id_empresa, id_usuario, dt_periodo);
			} else if (xmlObj.CFe !== undefined) {
        await impXmlEntrada.Cfe(xmlObj, id_simul_etapa, id_empresa, id_usuario, dt_periodo);
      } else {
        await new model.EtapaStatus().insert(dt_periodo, 2, id_simul_etapa, id_empresa, id_usuario, 'XML fora do padrão da importação.');
      }
    })
  });
  
  //Oracle.execProcedure(nm_procedure1, id_empresa, id_usuario);
  //Oracle.execProcedure(nm_procedure2, id_empresa, id_usuario);
  
  await new model.EtapaStatus().insert(dt_periodo, 1, id_simul_etapa, id_empresa, id_usuario, 'Dados importado com sucesso.');
}
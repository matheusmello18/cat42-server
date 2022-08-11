const Oracle = require('./Oracle');
const model = require('./model');
const impXmlSaida = require('./ImportacaoXMLSaida');
const impXmlEntrada = require('./ImportacaoXMLEntrada');
const parseString = require('xml2js').parseString;
const fs = require("fs");
const extract = require('extract-zip')
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

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
console.log(filename, ' -----> ',path);

  if (path.endsWith('.zip')){

    const newPath = appDir+'\\'+path.replace(".zip", "");

    try {
      await extract(appDir + '\\' + path, { dir: newPath })

      const files = fs.readdirSync(newPath)
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(file);

        const xml = fs.readFileSync(newPath+'\\'+file, {encoding:'utf8', flag:'r'})

        const parseStringAsync = new Promise((resolve, reject) => {
          parseString(xml, (err, jsonXML) => err ? reject(err) : resolve(jsonXML) );
        });
    
        await parseStringAsync
        .catch(async (err) => {
          throw new Error(err.message + ' - Arquivo: ' + file);
        })
        .then(async (jsonXML) => {
          try {
            if (jsonXML.nfeProc === undefined || jsonXML.CFe === undefined) {
              throw new Error('XML fora do padrão da importação. - Arquivo: ' + file);
            }

            if (jsonXML.nfeProc !== undefined){
              await impXmlSaida.Nfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo);
            } else if (jsonXML.CFe !== undefined) { //c800
              await impXmlSaida.Cfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo)
            }  
            
            var dateParts = dt_periodo.split("/");
            var dt_inicial = new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, 1);
            var dt_final = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]), 0);
            
            if (nm_procedure1 !== undefined || nm_procedure1.trim() !== "")
              await Oracle.execProcedure(nm_procedure1, {pId_Simul_Etapa: id_simul_etapa, pId_Empresa: id_empresa, pId_Usuario: id_usuario, pDt_Inicial: dt_inicial, pDt_Final: dt_final});
            if (nm_procedure2 !== undefined || nm_procedure2.trim() !== "")
              await Oracle.execProcedure(nm_procedure2, {pId_Simul_Etapa: id_simul_etapa, pId_Empresa: id_empresa, pId_Usuario: id_usuario, pDt_Inicial: dt_inicial, pDt_Final: dt_final});
          } catch (err) {
            throw new Error(err.message + ' - Arquivo: ' + file);
          }
          
        });
        
      }//fim for

    } catch (err) {
      throw new Error(err.message);
    }
    
  } else if (path.endsWith('.xml')){

    const xml = fs.readFileSync(path, {encoding:'utf8', flag:'r'})

    const parseStringAsync = new Promise((resolve, reject) => {
      parseString(xml, (err, jsonXML) => err ? reject(err) : resolve(jsonXML) );
    });

    await parseStringAsync
    .catch(async (err) => {
      throw new Error(err.message + ' - Arquivo: ' + filename);
    })
    .then(async (jsonXML) => {
      try {
        if (jsonXML.nfeProc === undefined || jsonXML.CFe === undefined) {
          throw new Error('XML fora do padrão da importação. - Arquivo: ' + filename);
        }

        if (jsonXML.nfeProc !== undefined){
          await impXmlSaida.Nfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo);
        } else if (jsonXML.CFe !== undefined) { //c800
          await impXmlSaida.Cfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo)
        }  
        
        var dateParts = dt_periodo.split("/");
        var dt_inicial = new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, 1);
        var dt_final = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]), 0);

        if (nm_procedure1 !== undefined || nm_procedure1.trim() !== "")
          await Oracle.execProcedure(nm_procedure1, {pId_Simul_Etapa: id_simul_etapa, pId_Empresa: id_empresa, pId_Usuario: id_usuario, pDt_Inicial: dt_inicial, pDt_Final: dt_final});
        if (nm_procedure2 !== undefined || nm_procedure2.trim() !== "")
          await Oracle.execProcedure(nm_procedure2, {pId_Simul_Etapa: id_simul_etapa, pId_Empresa: id_empresa, pId_Usuario: id_usuario, pDt_Inicial: dt_inicial, pDt_Final: dt_final});
      } catch (err) {
        throw new Error(err.message + ' - Arquivo: ' + filename);
      }
    });
  } 
}

module.exports.XmlEntrada = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

  const xml = fs.readFileSync(path, {encoding:'utf8', flag:'r'})
  
  const parseStringAsync = new Promise((resolve, reject) => {
      parseString(xml, (err, jsonXML) => err ? reject(err) : resolve(jsonXML) );
  });

  await parseStringAsync
  .catch(async (err) => {
    throw new Error(err.message);
  })
  .then(async (jsonXML) => {
    try {
        
      if (jsonXML.nfeProc === undefined) {
        throw new Error('XML fora do padrão da importação. - Arquivo: ' + filename);
      }

      if (jsonXML.nfeProc !== undefined){
        await impXmlEntrada.Nfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo);
      }

      var dateParts = dt_periodo.split("/");
      var dt_inicial = new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, 1);
      var dt_final = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]), 0);

      if (nm_procedure1 !== undefined || nm_procedure1.trim() !== "")
        await Oracle.execProcedure(nm_procedure1, {pId_Simul_Etapa: id_simul_etapa, pId_Empresa: id_empresa, pId_Usuario: id_usuario, pDt_Inicial: dt_inicial, pDt_Final: dt_final});
      if (nm_procedure2 !== undefined || nm_procedure2.trim() !== "")
        await Oracle.execProcedure(nm_procedure2, {pId_Simul_Etapa: id_simul_etapa, pId_Empresa: id_empresa, pId_Usuario: id_usuario, pDt_Inicial: dt_inicial, pDt_Final: dt_final});


      const ProdsSimul = await new model.ProdutoSimulador().BuscarPeloProdutosSimul(jsonXML, id_empresa, id_usuario).then((data) => {
        return data.rows;
      });
      for (let i = 0; i < ProdsSimul.length; i++) {
        await new model.ProdutoSimulador().updateStatus(1, ProdsSimul[i].ID_PRODUTO, id_empresa, id_usuario).catch((err) => {
          throw new Error('Erro ao atualizar o status do produto. Produto: ' + ProdsSimul[i].DS_PRODUTO);
        });
      }
      
    } catch (err) {

      const ProdsSimul = await new model.ProdutoSimulador().BuscarPeloProdutosSimul(jsonXML, id_empresa, id_usuario).then((data) => {
        return data.rows;
      });
      for (let i = 0; i < ProdsSimul.length; i++) {
        await new model.ProdutoSimulador().updateStatus(3, ProdsSimul[i].ID_PRODUTO, id_empresa, id_usuario).catch((err) => {
          throw new Error('Erro ao atualizar o status do produto. Produto: ' + ProdsSimul[i].DS_PRODUTO);
        });
      }
      throw new Error(err.message + ' - Arquivo: ' + filename);
    }

  })
}
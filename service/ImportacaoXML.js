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

  if (path.endsWith('.zip')){

    const newPath = appDir+'\\'+path.replace(".zip", "");

    try {
      await extract(appDir + '\\' + path, { dir: newPath })

      const files = fs.readdirSync(newPath)
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let xml
        
        try {
           xml = fs.readFileSync(newPath+'\\'+file, {encoding:'utf8', flag:'r'})
        } catch (error) {
          if (error.code === 'EISDIR')
            throw new Error('O zip não pode conter pastas dentro dele, apenas os XML');
        }

        const parseStringAsync = new Promise((resolve, reject) => {
          parseString(xml, (err, jsonXML) => err ? reject(err) : resolve(jsonXML) );
        });
    
        await parseStringAsync
        .catch(async (err) => {
          console.log(err);
          throw new Error(err.message + ' - Arquivo: ' + file);
        })
        .then(async (jsonXML) => {
          try {
            /*if (jsonXML.nfeProc === undefined && jsonXML.CFe === undefined) {
              throw new Error('XML fora do padrão da importação. - Arquivo: ' + file);
            }*/

            if (jsonXML.nfeProc !== undefined){
              await impXmlSaida.Nfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo);
            } else if (jsonXML.CFe !== undefined) { //c800
              await impXmlSaida.Cfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo)
            }  
            
            var dateParts = dt_periodo.split("/");
            var dt_inicial = new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, 1);
            var dt_final = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]), 0);
            
            var paramProcedures = {
              pId_Simul_Etapa: id_simul_etapa,
              pId_Empresa: id_empresa,
              pId_Usuario: id_usuario,
              pDt_Inicial: {type: Oracle.oracledb.DATE, val: dt_inicial },
              pDt_Final: {type: Oracle.oracledb.DATE, val: dt_final }
            }
            
            if (nm_procedure1 !== undefined) {
              if (nm_procedure1.trim() !== "")
                await Oracle.execProcedure(nm_procedure1, paramProcedures);
            }

            if (nm_procedure2 !== undefined){
              if (nm_procedure2.trim() !== "")
                await Oracle.execProcedure(nm_procedure2, paramProcedures);
            }
          } catch (err) {
            console.log(err);
            throw new Error(err.message + ' - Arquivo: ' + file);
          }
          
        }).catch((err) => {
          console.log(err);
        })
        
      }//fim for

      await new model.EtapaStatus().insert(dt_periodo, 1, id_simul_etapa, id_empresa, id_usuario, 'Dados importado com sucesso.');
      
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

        var paramProcedures = {
          pId_Simul_Etapa: id_simul_etapa,
          pId_Empresa: id_empresa,
          pId_Usuario: id_usuario,
          pDt_Inicial: {type: Oracle.oracledb.DATE, val: dt_inicial },
          pDt_Final: {type: Oracle.oracledb.DATE, val: dt_final }
        }

        if (nm_procedure1 !== undefined){
          if (nm_procedure1.trim() !== "")
            await Oracle.execProcedure(nm_procedure1, paramProcedures);
        }

        if (nm_procedure2 !== undefined){
          if (nm_procedure2.trim() !== "")
            await Oracle.execProcedure(nm_procedure2, paramProcedures);
        }

        await new model.EtapaStatus().insert(dt_periodo, 1, id_simul_etapa, id_empresa, id_usuario, 'Dados importado com sucesso.');
      } catch (err) {
        throw new Error(err.message + ' - Arquivo: ' + filename);
      }
    });
  }
}

module.exports.xXmlEntrada = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

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

      var paramProcedures = {
        pId_Simul_Etapa: id_simul_etapa,
        pId_Empresa: id_empresa,
        pId_Usuario: id_usuario,
        pDt_Inicial: {type: Oracle.oracledb.DATE, val: dt_inicial },
        pDt_Final: {type: Oracle.oracledb.DATE, val: dt_final }
      }

      if (nm_procedure1 !== undefined){
        if (nm_procedure1.trim() !== "")
          await Oracle.execProcedure(nm_procedure1, paramProcedures);
      }

      if (nm_procedure2 !== undefined) {
        if (nm_procedure2.trim() !== "")
          await Oracle.execProcedure(nm_procedure2, paramProcedures);
      }

      await new model.ProdutoSimulador().BuscarPeloProdutosSimul(jsonXML, id_empresa, id_usuario).then(async (data) => {
        for (let i = 0; i < data.rows.length; i++) {
          await new model.ProdutoSimulador().updateStatus(1, data.rows[i].ID_PRODUTO, id_empresa, id_usuario).catch((err) => {
            throw new Error('Erro ao atualizar o status do produto. Produto: ' + data.rows[i].DS_PRODUTO);
          });
        }
        return data.rows;
      });

      await new model.ProdutoSimulador().ComPendencia(id_empresa, id_usuario).then(async (data) => {
        if (data.rows[0].TOTAL === 0){
          await new model.EtapaStatus().insert(dt_periodo, 1, id_simul_etapa, id_empresa, id_usuario, 'Dados importado com sucesso.');
        } else {
          await new model.EtapaStatus().insert(dt_periodo, 3, id_simul_etapa, id_empresa, id_usuario, 'Pendência de importação de XML para o Produto');
        }
        return data.rows;
      });
      
    } catch (err) {

      await new model.ProdutoSimulador().BuscarPeloProdutosSimul(jsonXML, id_empresa, id_usuario).then(async (data) => {
        for (let i = 0; i < data.rows.length; i++) {
          await new model.ProdutoSimulador().updateStatus(3, data.rows[i].ID_PRODUTO, id_empresa, id_usuario).catch((err) => {
            throw new Error('Erro ao atualizar o status do produto. Produto: ' + data.rows[i].DS_PRODUTO);
          });
        }
        return data.rows;
      });
      console.log(err);
      throw new Error(err.message + ' - Arquivo: ' + filename);
    }

  })
}

module.exports.XmlEntrada = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

  if (path.endsWith('.zip')){

    const newPath = appDir+'\\'+path.replace(".zip", "");

    try {
      await extract(appDir + '\\' + path, { dir: newPath })

      const files = fs.readdirSync(newPath)
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let xml
        
        try {
           xml = fs.readFileSync(newPath+'\\'+file, {encoding:'utf8', flag:'r'})
        } catch (error) {
          if (error.code === 'EISDIR')
            throw new Error('O zip não pode conter pastas dentro dele, apenas os XML');
        }

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

            var paramProcedures = {
              pId_Simul_Etapa: id_simul_etapa,
              pId_Empresa: id_empresa,
              pId_Usuario: id_usuario,
              pDt_Inicial: {type: Oracle.oracledb.DATE, val: dt_inicial },
              pDt_Final: {type: Oracle.oracledb.DATE, val: dt_final }
            }

            if (nm_procedure1 !== undefined){
              if (nm_procedure1.trim() !== "")
                await Oracle.execProcedure(nm_procedure1, paramProcedures);
            }

            if (nm_procedure2 !== undefined) {
              if (nm_procedure2.trim() !== "")
                await Oracle.execProcedure(nm_procedure2, paramProcedures);
            }

            await new model.ProdutoSimulador().BuscarPeloProdutosSimul(jsonXML, id_empresa, id_usuario).then(async (data) => {
              for (let i = 0; i < data.rows.length; i++) {
                await new model.ProdutoSimulador().updateStatus(1, data.rows[i].ID_PRODUTO, id_empresa, id_usuario).catch((err) => {
                  throw new Error('Erro ao atualizar o status do produto. Produto: ' + data.rows[i].DS_PRODUTO);
                });
              }
              return data.rows;
            });

            await new model.ProdutoSimulador().ComPendencia(id_empresa, id_usuario).then(async (data) => {
              if (data.rows[0].TOTAL === 0){
                await new model.EtapaStatus().insert(dt_periodo, 1, id_simul_etapa, id_empresa, id_usuario, 'Dados importado com sucesso.');
              } else {
                await new model.EtapaStatus().insert(dt_periodo, 3, id_simul_etapa, id_empresa, id_usuario, 'Pendência de importação de XML para o Produto');
              }
              return data.rows;
            });
            
          } catch (err) {

            await new model.ProdutoSimulador().BuscarPeloProdutosSimul(jsonXML, id_empresa, id_usuario).then(async (data) => {
              for (let i = 0; i < data.rows.length; i++) {
                await new model.ProdutoSimulador().updateStatus(3, data.rows[i].ID_PRODUTO, id_empresa, id_usuario).catch((err) => {
                  throw new Error('Erro ao atualizar o status do produto. Produto: ' + data.rows[i].DS_PRODUTO);
                });
              }
              return data.rows;
            });
            console.log(err);
            throw new Error(err.message + ' - Arquivo: ' + filename);
          }

        })
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
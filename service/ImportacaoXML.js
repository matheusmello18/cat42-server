const Oracle = require('./Oracle');
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
            if (jsonXML.nfeProc !== undefined){
              await impXmlSaida.Nfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo);
            } else if (jsonXML.CFe !== undefined) { //c800
              await impXmlSaida.Cfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo)
            }  
            
            if (nm_procedure1 !== undefined || nm_procedure1 !== "")
              Oracle.execProcedure(nm_procedure1, {id_empresa: id_empresa, id_usuario: id_usuario});
            if (nm_procedure2 !== undefined || nm_procedure2 !== "")
              Oracle.execProcedure(nm_procedure2, {id_empresa: id_empresa, id_usuario: id_usuario});
          } catch (err) {
            throw new Error(err.message + ' - Arquivo: ' + file);
          }
          
          
          if (jsonXML.nfeProc !== undefined && jsonXML.CFe !== undefined) {
            throw new Error('XML fora do padrão da importação. - Arquivo: ' + file);
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
        if (jsonXML.nfeProc !== undefined){
          await impXmlSaida.Nfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo);
        } else if (jsonXML.CFe !== undefined) { //c800
          await impXmlSaida.Cfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo)
        }  
        
        if (nm_procedure1 !== undefined || nm_procedure1 !== "")
          Oracle.execProcedure(nm_procedure1, {id_empresa: id_empresa, id_usuario: id_usuario});
        if (nm_procedure2 !== undefined || nm_procedure2 !== "")
          Oracle.execProcedure(nm_procedure2, {id_empresa: id_empresa, id_usuario: id_usuario});
      } catch (err) {
        throw new Error(err.message + ' - Arquivo: ' + filename);
      }
      
      
      if (jsonXML.nfeProc !== undefined && jsonXML.CFe !== undefined) {
        throw new Error('XML fora do padrão da importação. - Arquivo: ' + filename);
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
      if (jsonXML.nfeProc !== undefined){
        await impXmlEntrada.Nfe(jsonXML, id_simul_etapa, id_empresa, id_usuario, dt_periodo);
      } 

      if (nm_procedure1 !== undefined || nm_procedure1 !== "")
        Oracle.execProcedure(nm_procedure1, {id_empresa: id_empresa, id_usuario: id_usuario});
      if (nm_procedure2 !== undefined || nm_procedure2 !== "")
        Oracle.execProcedure(nm_procedure2, {id_empresa: id_empresa, id_usuario: id_usuario});
    } catch (err) {
      throw new Error(err.message);
    }
        
    if (jsonXML.nfeProc !== undefined && jsonXML.CFe !== undefined) {
      throw new Error('XML fora do padrão da importação.');
    }
  })
}
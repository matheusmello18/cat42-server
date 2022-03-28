const Oracle = require('./Oracle');
const etapaStatus = require('./EtapaStatus');
const produtos = require('./Produtos');
const sfimportatexto = require('./Sf_Importa_Arquivo');
const ExcelJS = require('exceljs'); // documentação: https://www.npmjs.com/package/exceljs
const nReadlines = require('n-readlines');

module.exports.Excel = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {
  try {
    let existeErrorCampoNulo = false;
    // realizar os deletes da tabela produto
    produtos.Delete(id_empresa, id_usuario);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);
    const worksheet = workbook.worksheets[0];

    await worksheet.eachRow({ includeEmpty: false }, async function(row, rowNumber) {
      if (![1,2].includes(rowNumber)){
        
        let camposNulo = 'Campo(s) vazio(s):';

        if (row.getCell(1).value === null ) // cd_produto
          camposNulo = camposNulo.concat(' Cd. Produto,');
        if (row.getCell(2).value === null ) // ds_produto
          camposNulo = camposNulo.concat(' Ds. Produto,');
        if (row.getCell(3).value === null ) // ds_unidade_venda
          camposNulo = camposNulo.concat(' UM Venda,');
        if (row.getCell(4).value === null ) // cd_produto_forn
          camposNulo = camposNulo.concat(' Cd. Produto Fornecedor,');
        if (row.getCell(5).value === null ) // ds_unidade_forn
          camposNulo = camposNulo.concat(' UM Fornecedor,');
        if (row.getCell(6).value === null ) // vl_fator_conversao
          camposNulo = camposNulo.concat(' Fator Conversao,');
        if (row.getCell(7).value === null ) // aliq_icms
          camposNulo = camposNulo.concat(' Aliq ICMS,');
        if (row.getCell(8).value === null ) // vl_saldo_estoque_inicial
          camposNulo = camposNulo.concat(' Saldo Inicial Estoque,');

        if (camposNulo.endsWith(',')){
          existeErrorCampoNulo = true;
          camposNulo = camposNulo.substring(0, camposNulo.length-1);
          camposNulo = camposNulo.concat(`. Número da linha: ${rowNumber.toString()}`)
          
          /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
          await etapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), camposNulo);

        } else {
          const nProx_Codigo = await Oracle.proxCod("SIMUL_PRODUTO");
          await produtos.Insert(
            nProx_Codigo,
            row.getCell(1).value, //cd_produto
            row.getCell(2).value, //ds_produto
            row.getCell(3).value, //ds_unidade_venda
            row.getCell(4).value, //cd_produto_forn
            row.getCell(5).value, //ds_unidade_forn
            row.getCell(6).value, //vl_fator_conversao
            row.getCell(7).value, //aliq_icms
            row.getCell(8).value, //vl_saldo_estoque_inicial
            id_empresa, 
            id_usuario
          );
        }
      }
    });

    if (!existeErrorCampoNulo){
      //executar a procedure configurada
      
      await Oracle.execProcedure(nm_procedure1, {id_empresa: id_empresa, id_usuario: id_usuario, abc: `teste`, xyz: `xxxx`});
      await etapaStatus.insert(dt_periodo, 1, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Dados importado com sucesso.');
    }
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Text = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2, id_modulo, id_projeto) => {

  var dateParts = dt_periodo.split("/");
  var dt_inicial = new Date(dateParts[2], dateParts[1]-1, 1);
  var dt_final = new Date(dateParts[2], dateParts[1], 0);
  
  await sfimportatexto.Delete(
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

    await sfimportatexto.Insert(
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
  }

  await Oracle.execProcedure(nm_procedure1, 
    { pDt_Inicial: dt_inicial,
      pDt_Final: dt_final,
      pId_Empresa: parseInt(id_empresa),
      pId_Usuario: parseInt(id_usuario),
      pId_Projeto: parseInt(id_projeto),
      pId_Modulo: parseInt(id_modulo),
      pRemove: 1,
      pEmissPropria: 0,
      pCupomFiscalE: 0,
      pCad_Aux: 0 }
  );
  
  await etapaStatus.insert(dt_periodo, 1, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Dados importado com sucesso.');

  //Oracle.execProcedure(nm_procedure2, id_empresa, id_usuario);

}

module.exports.Xml = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

  Oracle.execProcedure(nm_procedure1, id_empresa, id_usuario);
  Oracle.execProcedure(nm_procedure2, id_empresa, id_usuario);
  
}
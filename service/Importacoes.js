const Oracle = require('./Oracle');
const etapaStatus = require('./EtapaStatus');
const produtos = require('./Produtos');
const ExcelJS = require('exceljs'); // documentação: https://www.npmjs.com/package/exceljs

module.exports.Excel = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {
  try {
    let existeErrorCampoNulo = false;
    // realizar os deletes da tabela produto
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);
    const worksheet = workbook.worksheets[0];

    await worksheet.eachRow({ includeEmpty: false }, async function(row, rowNumber) {
      if (![1,2].includes(rowNumber)){
        
        let params;
        let camposNulo = 'Campo(s) vazio(s):';
        

        if (row.getCell(1).value.lenght === 0 ) // cd_produto
          camposNulo.concat(' Cd. Produto,');
        if (row.getCell(2).value.lenght === 0 ) // ds_produto
          camposNulo.concat(' Ds. Produto,');
        if (row.getCell(3).value.lenght === 0 ) // ds_unidade_venda
          camposNulo.concat(' UM Venda,');
        if (row.getCell(4).value.lenght === 0 ) // cd_produto_forn
          camposNulo.concat(' Cd. Produto Fornecedor,');
        if (row.getCell(5).value.lenght === 0 ) // ds_unidade_forn
          camposNulo.concat(' UM Fornecedor,');
        if (row.getCell(6).value.lenght === 0 ) // vl_fator_conversao
          camposNulo.concat(' Fator Conversao,');
        if (row.getCell(7).value.lenght === 0 ) // aliq_icms
          camposNulo.concat(' Aliq ICMS,');
        if (row.getCell(8).value.lenght === 0 ) // vl_saldo_estoque_inicial
          camposNulo.concat(' Saldo Inicial Estoque,');

        if (camposNulo.endsWith(',')){
          existeErrorCampoNulo = true;
          camposNulo = camposNulo.substring(0, camposNulo.length-1);
          camposNulo.concat(`. Número da linha: ${rowNumber.toString()}`)
          
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
      console.log("matheus");
      console.log(nm_procedure1, nm_procedure2);
      //aqui que irá determinar a estapa status
      /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
      await etapaStatus.insert(dt_periodo, 1, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Dados importado com sucesso.');
    }
  } catch (err) {
    throw new Error(err);
  }
}

module.exports.Text = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

}

module.exports.Xml = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

}
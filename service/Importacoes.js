const etapaStatus = require('./EtapaStatus');
const produtos = require('./Produtos');
const ExcelJS = require('exceljs'); // documentação: https://www.npmjs.com/package/exceljs

module.exports.Excel = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nr_cnpj) => {
  try {
    console.log(filename, path);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);
    const worksheet = workbook.worksheets[0];

    worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
      if (![1,2].includes(rowNumber)){
        console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
        console.log(row.getCell(6).value, row.getCell(7).value, row.getCell(8).value);
        produtos.Insert(
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
        /*row.eachCell((cell, colNumber) => {
          console.log(cell.value, colNumber);
        })*/
      }
    });

    /* 

    let params; */

    /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
    /*params = {
      dt_periodo: dt_periodo,
      id_simul_tp_status: 1, // 1,2,3
      id_simul_etapa: parseInt(id_simul_etapa),
      id_empresa: parseInt(id_empresa),
      id_usuario: parseInt(id_usuario),
      ds_status: `chuta o balde para o cliente`
    };


    etapaStatus.insert(params); */
  
  } catch (err) {
    console.log(err.message);
  }
}

module.exports.Text = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nr_cnpj) => {

}

module.exports.Xml = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nr_cnpj) => {

}
const etapaStatus = require('./EtapaStatus');
const ProxCod = require('./ProxCod');
const ExcelJS = require('exceljs');

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
        /*row.eachCell((cell, colNumber) => {
          console.log(cell.value, colNumber);
        })*/
      }
    });

    /* const nProx_Codigo = await ProxCod("SIMUL_CADASTRO");

    let params; */

    /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
    /*params = {
      id_simul_status: nProx_Codigo,
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
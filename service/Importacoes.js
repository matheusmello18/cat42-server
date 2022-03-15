const etapaStatus = require('./EtapaStatus');
const ProxCod = require('./ProxCod');

module.exports.Excel = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo) => {
  try {
    console.log(filename, path);
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(`../uploads/${filename}`);
    workbook.eachSheet(function(worksheet, sheetId) {
      console.log(sheetId);

      worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
      });

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
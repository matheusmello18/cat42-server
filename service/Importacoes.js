const ImportacaoExcel = require("./ImportacaoExcel");
const ImportacaoText = require("./ImportacaoText");
const ImportacaoXML = require("./ImportacaoXML");

module.exports.Excel = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {
  try {
    await ImportacaoExcel.Excel(filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports.Text = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2, id_modulo, id_projeto) => {
  try {
    await ImportacaoText.Text(filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports.XmlSaida = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {
  try {
    await ImportacaoXML.XmlSaida(filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports.XmlEntrada = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {
  try {
    await ImportacaoXML.XmlEntrada(filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2);
  } catch (err) {
    throw new Error(err.message);
  }
}
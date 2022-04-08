module.exports.DateXmlToDateOracleString = (DateXml) => {
  let dateParts = DateXml.split("T")[0].split("-");
  return ''.concat(dateParts[2],'/',dateParts[1],'/',dateParts[0]);
}

module.exports.DateNodeToDateOracleString = (DateNode) => {
  return ''.concat(DateNode.getDate(),'/',DateNode.getMonth()+1,'/',DateNode.getFullYear());
}

module.exports.DateXmlToDateTimeOracleString = (DateXml) => {
  let dateTimeParts = DateXml.split("T");
  let timePart = dateTimeParts[1].split("-")[0];
  let dateParts = dateTimeParts[0].split("-");
  return ''.concat(dateParts[2],'/',dateParts[1],'/',dateParts[0], ' ', timePart);
}


module.exports.DateOracleToDateNode = (DateOracle) => {
  var dateParts = DateOracle.split("/");
  return new Date(dateParts[2], dateParts[1]-1, dateParts[0]);
}


module.exports.DateOracleToPrimeiroDia = (DateOracle) => {
  var dateParts = DateOracle.split("/");
  return ''.concat(1,'/',dateParts[1],'/',dateParts[2]);
}

module.exports.DateOracleToUltimoDia = (DateOracle) => {
  var dateParts = DateOracle.split("/");
  return module.exports.DateNodeToDateOracleString(new Date(dateParts[2], dateParts[1], 0));
}

module.exports.RetornarMenorDataEmNode = (DataOracle1, DataOracle2) => {
  let DataNode1 = module.exports.DateOracleToDateNode(DataOracle1);
  let DataNode2 = module.exports.DateOracleToDateNode(DataOracle2);

  if (DataNode1 < DataNode2)
    return DataNode1;
  else
    return DataNode2;
}

module.exports.RetornarMenorDataEmOracle = (DataOracle1, DataOracle2) => {
  return module.exports.DateNodeToDateOracleString(
    module.exports.RetornarMenorDataEmNode(DataOracle1, DataOracle2)
  );
}
/** Modo de usar
 * console.log(utils.FormatarData.DateXmlToDateOracleString("2020-11-13T18:23:29-03:00"));
 * console.log(utils.FormatarData.DateXmlToDateTimeOracleString("2020-11-13T18:23:29-03:00"));
 * console.log(utils.FormatarData.DateOracleToPrimeiroDia("15/02/2020"));
 * console.log(utils.FormatarData.DateOracleToUltimoDia("15/02/2020"));
 * console.log(utils.FormatarData.DateOracleToDateNode("15/02/2020"));
 */
const Oracle = require('../service/Oracle');
var fs = require('fs');

module.exports.banco = async (objData, myErr) => {
  const idMonitor = (await Oracle.monitorLogError('Exception', objData, myErr.stack));
  return idMonitor;
}

module.exports.gravar = (myErr) => {
  const nameFile = new Date().toDateString() + '.log';
  
  fs.appendFile('log/'+nameFile, myErr.stack.concat("\n"), 'utf8', (err) => {
    console.log(err);
  });
}
var fs = require('fs');

module.exports.gravar = (myErr) => {
  const nameFile = new Date().toDateString() + '.log';
  
  fs.appendFile('log/'+nameFile, myErr.stack.concat("\n"), 'utf8', (err) => {
    console.log(err);
  });

  /*fs.access(nameFile, fs.constants.F_OK, (err) => {
    if (err){
      //criar
    } else {
      fs.writeFile(nameFile, myErr.stack, 'utf8', (err) => {
        console.log(err);
      });
    }
    console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
  });*/

  
}
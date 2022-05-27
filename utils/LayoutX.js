
const Oracle = require('../service/Oracle');
const fs = require('fs');

module.exports.GeraInsertLayoutX = async () => {
  
  let codLayouts = [6776,6777,6778,6779,6780,6859,6858,6781,6785,6786,6784,6783,6791,7516,7473,7474,7157,7158];
  let sql, sql1, campos, fields = ''
  let layoutCampo = {}

  fs.writeFile('layoutX.sql', '', (err) => {
    if (err) throw err;
  });

  for (const codLayout of codLayouts) {
    codLayout;

    
    sql = '';
    campos = '';
    fields = '';  
    layoutCampo = {};

    layoutCampo =  await Oracle.select(
      `SELECT L.NM_ENTIDADE, C.NM_CAMPO, C.DM_TIPO_CAMPO
        FROM IN_LAYOUT_CAMPO C
      INNER JOIN IN_LAYOUT L ON (L.ID_LAYOUT = C.ID_LAYOUT AND L.ID_EMPRESA = C.ID_EMPRESA)
        WHERE C.ID_EMPRESA = :id_empresa
          AND C.ID_LAYOUT  = :id_layout`,
      {id_empresa: 1, id_layout: codLayout});

    sql = `insert into ${layoutCampo.rows[0].NM_ENTIDADE.toLowerCase()} \n`;
      


    layoutCampo.rows.forEach( (val) => {
      fields = fields + ` :${val.NM_CAMPO},`;
      campos = campos + ` ${val.NM_CAMPO},`;
    })

    campos = campos.substring(0, campos.length-1);

    fields = fields.substring(0, fields.length-1);
    
    sql1 = `(${campos.toLowerCase()}) \nvalues \n(${fields.toLowerCase()}) \n\n`;



    fs.appendFile('layoutX.sql', sql+sql1, (err) => {
      if (err) throw err;
  });
  }
}

module.exports.GeraFunctionInsert = async () => {
//  let codLayouts = [6776,6777,6778,6779,6780,6859,6858,6781,6785,6786,6784,6783,6791,7516,7473,7474,7157,7158];
  let codLayouts = [7157, 7158]
  let func, sql, campos, fields, tabela, params = ''
  let layoutCampo = {}

  fs.writeFile('layoutX.php', '', (err) => {
    if (err) throw err;
  });

  for (const codLayout of codLayouts) {
    func = ''; sql = ''; tabela = ''; campos = ''; fields = ''; params = '';
    layoutCampo = {};

    layoutCampo =  await Oracle.select(
      `SELECT L.NM_ENTIDADE, C.NM_CAMPO, C.DM_TIPO_CAMPO
        FROM IN_LAYOUT_CAMPO C
      INNER JOIN IN_LAYOUT L ON (L.ID_LAYOUT = C.ID_LAYOUT AND L.ID_EMPRESA = C.ID_EMPRESA)
        WHERE C.ID_EMPRESA = :id_empresa
          AND C.ID_LAYOUT  = :id_layout`,
      {id_empresa: 1, id_layout: codLayout});

    tabela = layoutCampo.rows[0].NM_ENTIDADE.toLowerCase();
    sql = `insert into ${tabela} \n`;

    layoutCampo.rows.forEach( (val) => {
      fields = fields + ` :${val.NM_CAMPO},`;
      campos = campos + ` ${val.NM_CAMPO},`;
      if (val.NM_CAMPO === 'ID_EMPRESA')
        params = params + `\n\t\t${val.NM_CAMPO}: ID_EMPRESA,`;
      else if (val.NM_CAMPO === 'ID_USUARIO')
        params = params + `\n\t\t${val.NM_CAMPO}: ID_USUARIO,`;
      else
        params = params + `\n\t\t${val.NM_CAMPO}:'',`;
    })

    campos = campos.substring(0, campos.length-1);
    fields = fields.substring(0, fields.length-1);
    params = params.substring(0, params.length-1);
    sql = sql + `\t\t\t\t\t\t(${campos.toLowerCase()}) \n\t\t\t\t\t\tvalues \n\t\t\t\t\t\t(${fields.toLowerCase()})\n\t\t\t\t\t\t`;

    tabela = tabela.split("_").map((e,index,array) => { return e.charAt(0).toUpperCase() + e.slice(1)}).join("")
    func = `const Insert${tabela} = async (${tabela} = {}) => {\n\tlet sql = \`${sql}\`;\n\ttry {\n\t\tawait Oracle.insert(sql, ${tabela})\n\t} catch (err) {\n\t\tthrow new Error(err);\n\t}\n}\n\n`
    func = `${func}/** Insert${tabela}\n\tInsert${tabela}({${params.toLowerCase()}\n\t})\n*/\n\n`;

    fs.appendFile('layoutX.php', func, (err) => {
      if (err) throw err;
  });
  }
}

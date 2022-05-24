/**
 * @name SimuladorCat42
 * @file index
 * @author Matheus de Mello
 * @version 1.0.0
 * @tutorial serve
 * @since 01/01/2022
 */

/**
 * Servidor web express 
 * @requires express
 */
const express = require("express");
const serve = express();

/**
 * Configurar body para tornar json
 * @requires body-parser
 */
const bodyParser = require("body-parser")

/**
 * Utilitário para trabalhar com diretório
 * @requires path
 */
const path = require("path")

/**
 * Configurar permissão de acesso de url externas
 * @requires cors
 */
const cors = require("cors")

/**
 * Configuração do Site
 * @requires config
 */
const config = require('./config/Config');

/**
 * Rota de cliente
 * @requires cliente
 */
const cliente = require("./route/v1/cliente")

/**
 * Rota de usuário
 * @requires users
 */
const users = require("./route/v1/users")

/**
 * Rota de etapas
 * @requires etapas
 */
const etapas = require("./route/v1/etapas")

const model = require('./service/model')
const utils = require('./utils')
const jsonNfe = require("./test/35201153309795000180550010005589881507126891.json")


var corsOptions = {
  origin: config.appFrontEnd.origin, // colocar aqui o ip externo e o nome do site
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

serve.use(cors(corsOptions))

serve.use(bodyParser.urlencoded({extended: false}))
serve.use(bodyParser.json())

serve.use(express.static(path.join(__dirname, "public")))

serve.use('/api/v1/cliente', cliente)
serve.use('/api/v1/user', users)
serve.use('/api/v1/etapas', etapas)

serve.get('*', (req, res) => {
  res.json({msg: "rota não existe"})
})
serve.post('*', (req, res) => {
  res.json({msg: "rota não existe"})
})



/*let t = parseFloat("")
if (t == NaN)
  console.log(t)

const obj = {
  person: {
    name: 'Foo',
    age: 50
  }
};

console.log(obj.person.name);
console.log(obj.myperson?.name);
console.log(obj.myperson.name);
*/

/*
console.log(jsonNfe.nfeProc.NFe[0].infNFe[0].det[0].imposto[0].ICMS[0]);
console.log(Object.keys(jsonNfe.nfeProc.NFe[0].infNFe[0].det[0].imposto[0].ICMS[0]));
console.log(['ICMS00', 'ICMS10', 'ICMS20', 'ICMS90'].some((value) => {
  return value == Object.keys(jsonNfe.nfeProc.NFe[0].infNFe[0].det[0].imposto[0].ICMS[0])[0]
}))
*/

//console.log(utils.Validar.ifelse(jsonNfe.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ, jsonNfe.nfeProc.NFe[0].infNFe[0].dest[0].CPF));
 //console.log(utils.FormatarData.DateOracleToPrimeiroDia("15/02/2020"));
 //console.log(utils.FormatarData.DateOracleToUltimoDia("15/12/2020"));
 //console.log(utils.FormatarData.RetornarMenorDataEmOracle("15/04/2020", "15/03/2020"));
 //console.log(jsonNfe.nfeProc.NFe[0].infNFe[0].det[0].imposto[0].ICMS[0].ICMS90[0]?.origX === undefined);

async function getT(){
  /*var retorno1 = (await model.CtrlEmpresa.select(77)).rows;
  console.log(retorno1.length)
  console.log(retorno1[0])*/
  
  console.log("----")

  /*var retorno = (await model.Ac331.municipio.select('3534302')).rows[0];
  console.log(retorno)*/ // se não encontrou vem como undefined

  console.log("---->")

  /*await model.Ac331.municipio.select('3534302').then((e) => {
    console.log(e.rows[0])
  }).catch((r) => {
    console.log(r)
  });*/

  // const sf = await model.Sf0460.insert(
  //   {
  //     cd_obs: 'c00154', 
  //     id_empresa: 1, 
  //     dt_inicial: utils.FormatarData.DateNodeToDateOracleString(new Date()), 
  //     dt_movimento: utils.FormatarData.DateNodeToDateOracleString(new Date()), 
  //     id_usuario: 1, 
  //     ds_obs: 'olá matheus de mello, esteja na good vibes'
  //   }).then((e) => {
  //     console.log('matheus');
  //     console.log(e);
  //   });
}
//getT();


serve.listen(8081, function(){
  console.log("Servidor Rodando. Url: http://localhost:8081");
});
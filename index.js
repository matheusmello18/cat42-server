const express = require("express");
const serve = require("./serve");
const bodyParser = require("body-parser")
const path = require("path")
const cors = require("cors")

const config = require('./config/Config');
const cliente = require("./route/v1/cliente")
const users = require("./route/v1/users")
const etapas = require("./route/v1/etapas")

const model = require('./service/model')
//const layoutX = require('./utils/LayoutX')


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

//console.log(model.NotaFiscal.Saida.Produto.item.data)
/*
async function getT(){
  var retorno1 = await model.CtrlEmpresa.select(7);
  console.log(retorno1.rows)
  var retorno = await model.Ac331.municipio.select('3534302');
  console.log(retorno.rows)
}
getT();
*/

//layoutX.GeraFunctionInsert();
//layoutX.GeraInsertLayoutX();

serve.listen(8081, function(){
  console.log("Servidor Rodando. Url: http://localhost:8081");
});
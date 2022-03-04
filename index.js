const express = require("express");
const serve = require("./serve");
const bodyParser = require("body-parser")
const path = require("path")
const cors = require("cors")

const cliente = require("./route/v1/cliente")
const users = require("./route/v1/users")
const etapas = require("./route/v1/etapas")

var corsOptions = {
  origin: ['http://localhost:3001','http://192.168.1.188:3001'], // colocar aqui o ip externo e o nome do site
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

serve.listen(8081, function(){
  console.log("Servidor Rodando. Url: http://localhost:8081");
});
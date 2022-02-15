const express = require("express")
const router = express.Router();
const simulador = require("../../service/Simulador")
const sendEmail = require("../../service/SendEmail")

router.post("/login", async (req, res) => {

  if (req.body.email === 'matheus.mello@painelfiscal.com.br' && req.body.password === '123')
    return res.status(200).json({success:"true!", user: {email: 'matheus.mello@painelfiscal.com.br', nome:'matheus de mello', dt_nascimento: '01/04/1988', body: req.body}});
  else
    return res.status(200).json({success:"false", user: null});
})

router.post("/store", async (req, res) => {
  var id = 0
  id = await simulador.inserir(req.body)
  var retorno = await simulador.select(id);
  
  if (id > 0) {
    sendEmail.cadastro(retorno.rows).catch(console.error);
    sendEmail.administrador(retorno.rows).catch(console.error);
  }

  return res.status(200).json({success:"true!", rows: retorno.rows})
})

router.post("/forget", async (req, res) => {
  var id = 0
  id = await simulador.inserir(req.body)
  var retorno = await simulador.select(id);
  
  if (id > 0) {
    sendEmail.cadastro(retorno.rows).catch(console.error);
    sendEmail.administrador(retorno.rows).catch(console.error);
  }

  return res.status(200).json({success:"true!", rows: retorno.rows})
})

router.post("/account", async (req, res) => {
  var id = 0
  id = await simulador.inserir(req.body)
  var retorno = await simulador.select(id);
  
  if (id > 0) {
    sendEmail.cadastro(retorno.rows).catch(console.error);
    sendEmail.administrador(retorno.rows).catch(console.error);
  }

  return res.status(200).json({success:"true!", rows: retorno.rows})
})

module.exports = router;
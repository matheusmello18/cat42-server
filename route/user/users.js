const express = require("express")
const router = express.Router();
const Usuario = require("../../service/CtrlUsuario")

router.post("/login", async (req, res) => {
  const usuario = Usuario.select(req.body.usuario.toUpperCase(), req.body.senha);
  return res.status(200).json({success:"true", user: usuario, body: req.body});
  
  if (req.body.usuario === 'MATHEUS')
    return res.status(200).json({success:"true", user: usuario});
  else
    return res.status(200).json({success:"false", user: null});
})

router.post("/forget", async (req, res) => {
  return res.status(200).json({success:"true", user: null});
})

router.post("/account", async (req, res) => {
  if (req.body.usuario === 'MATHEUS')
    return res.status(200).json({success:"true", user: {usuario: 'matheus.mello@painelfiscal.com.br', nome:'matheus de mello', dt_nascimento: '01/04/1988', body: req.body}});
  else
    return res.status(200).json({success:"false", user: null});
})

module.exports = router;
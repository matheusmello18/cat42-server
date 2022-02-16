const express = require("express")
const router = express.Router();
const Usuario = require("../../service/CtrlUsuario")

router.post("/login", async (req, res) => {
  const usuario = await Usuario.select(req.body.usuario.toUpperCase(), req.body.senha);

  if (usuario.rows[0] !== undefined)
    return res.status(200).json({success:"true", user: usuario.rows[0]});
  else
    return res.status(200).json({success:"false", user: null});
})

router.post("/forget", async (req, res) => {
  return res.status(200).json({success:"true", user: null});
})

router.post("/account", async (req, res) => {
  const usuario = await Usuario.select(req.body.usuario.toUpperCase());

  if (usuario.rows[0] !== undefined)
    return res.status(200).json({success:"true", user: usuario.rows[0]});
  else
    return res.status(200).json({success:"false", user: null});
})

module.exports = router;
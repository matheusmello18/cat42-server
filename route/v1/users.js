const express = require("express")
const router = express.Router();
var CryptoJS = require("crypto-js");

const sendEmail = require("../../service/SendEmail")
const Usuario = require("../../service/CtrlUsuario")

router.post("/login", async (req, res) => {
  try {
    const usuario = await Usuario.select(req.body.email, req.body.senha);
  
    if (usuario.rows[0] !== undefined)
      return res.status(200).json({success:"true", user: usuario.rows[0]});
    else
      return res.status(200).json({success:"false", user: null});
  } catch (err) {
    return res.status(200).json({success:"false", user: null});    
  }
})

router.post("/forget", async (req, res) => {
  try {
    const usuario = await Usuario.select(req.body.email);
  
    if (usuario.rows[0] !== undefined)
    {
      var hash = CryptoJS.MD5(usuario.rows[0].E_MAIL + Date.now()).toString();
      await Usuario.updateHash(usuario.rows[0].ID_USUARIO, hash);
      sendEmail.recuperarSenha(usuario.rows[0], hash).catch(console.error);
      return res.status(200).json({success:"true", user: usuario.rows[0]});
    }

    return res.status(200).json({success:"false", user: null});

  } catch (err) {
    return res.status(200).json({success:"false", user: null});
  }
})

router.post("/account", async (req, res) => {
  try {
    
    const usuario = await Usuario.select(req.body.email);
  
    if (usuario.rows[0] !== undefined)
      return res.status(200).json({success:"true", user: usuario.rows[0]});
    else
      return res.status(200).json({success:"false", user: null});

  } catch (err) {
    return res.status(200).json({success:"false", user: null});
  }
})

router.post("/hash", async (req, res) => {
  try {
    const usuario = await Usuario.selectByHash(req.body.hash);
  
    if (usuario.rows[0] !== undefined)
      return res.status(200).json({success:"true", user: usuario.rows[0]});
    else
      return res.status(200).json({success:"false", user: null});
  } catch (err) {
    return res.status(200).json({success:"false", user: null});
  }
})

router.post("/recovery", async (req, res) => {
  try {
    const usuario = await Usuario.select(req.body.email);
    await Usuario.updateSenha(req.body.id, req.body.senhaWeb, req.body.senha)
  
    if (usuario.rows[0] !== undefined)
      return res.status(200).json({success:"true", user: usuario.rows[0]});
    else
      return res.status(200).json({success:"false", user: null});
  } catch (err) {
    return res.status(200).json({success:"false", user: null});
  }
})

module.exports = router;
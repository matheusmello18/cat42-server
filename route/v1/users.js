const express = require("express")
const router = express.Router();
var CryptoJS = require("crypto-js");

const sendEmail = require("../../service/SendEmail")
const Usuario = require("../../service/model/CtrlUsuario")

router.post("/login", async (req, res) => {
  try {
    const usuario = await new Usuario.CtrlUsuario().select(req.body.email, req.body.senha);
  
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
    const usuario = await new Usuario.CtrlUsuario().select(req.body.email);
  
    if (usuario.rows[0] !== undefined)
    {
      var hash = CryptoJS.MD5(usuario.rows[0].E_MAIL + Date.now()).toString();
      await new Usuario.CtrlUsuario().updateHash(usuario.rows[0].ID_USUARIO, hash);
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
    
    const usuario = await new Usuario.CtrlUsuario().select(req.body.email);
  
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
    const usuario = await new Usuario.CtrlUsuario().selectByHash(req.body.hash);
  
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
    const usuario = await new Usuario.CtrlUsuario().select(req.body.email)
    .catch(async (err) => {
      err.message = 'Falha ao buscar o cliente por E-mail. '
      throw err
    });

    await new Usuario.CtrlUsuario().updateSenha(req.body.id, req.body.senhaWeb, req.body.senha)
    .catch(async (err) => {
      err.message = 'Falha ao alterar a senha. '
      throw err
    });
  
    if (usuario.rows[0] !== undefined)
      return res.status(200).json({success:"true", user: usuario.rows[0]});
    else
      return res.status(200).json({success:"false", user: null});
  } catch (err) {
    return res.status(200).json({success:"false", user: null});
  }
})

module.exports = router;
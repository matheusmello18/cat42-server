const express = require("express")
const router = express.Router();
const simulador = require("../../service/Simulador")
const Usuario = require("../../service/model/CtrlUsuario")
const sendEmail = require("../../service/SendEmail")

router.post("/add", async (req, res) => {
  try {
    var id = 0
    id = await simulador.inserir(req.body)
    var retorno = await simulador.select(id.toString());
    
    if (id > 0) {
      sendEmail.cadastro(retorno.rows).catch(console.error);
      sendEmail.administrador(retorno.rows).catch(console.error);
    }
  
    return res.status(200).json({success:"true", rows: null, message: 'Obrigado pelo cadastro em breve entraremos em contato'})
  } catch (err) {
    return res.status(200).json({success:"false", rows: null, message: 'Tente novamente em instantes. Obrigado!'})
  }
})

router.post("/edit", async (req, res) => {
  try { 
    const usuario = await new Usuario.CtrlUsuario().select(req.body.E_MAIL, req.body.senhaWebAtual);

    if (usuario.rows.length > 0) {
      await simulador.update(req.body)
      if (req.body.senhaSistema.length > 0 && req.body.senhaWeb.length > 0){
        await new Usuario.CtrlUsuario().updateSenha(req.body.ID_USUARIO, req.body.senhaWeb, req.body.senhaSistema)
        .catch(async (err) => {
          err.message = 'Falha ao alterar a senha. '
          throw err
        });
      }
      const usuario = await new Usuario.CtrlUsuario().select(req.body.E_MAIL)
      .catch(async (err) => {
        err.message = 'Falha ao buscar o cliente por E-mail. '
        throw err
      });
      
      return res.status(200).json({success:"true", rows: usuario.rows[0], message: ''})
    } else {
      return res.status(200).json({success:"false", rows: null, message: 'Campo Senha atual não corresponde com sua senha de login!'})
    }
  } catch (err) {
    console.log(err.message);
    return res.status(200).json({success:"false", rows: null, message: err.message})
  }
})

module.exports = router;
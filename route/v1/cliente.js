const express = require("express")
const router = express.Router();
const simulador = require("../../service/Simulador")
const sendEmail = require("../../service/SendEmail")

router.post("/add", async (req, res) => {
  try {
    var id = 0
    id = await simulador.inserir(req.body)
    var retorno = await simulador.select(id);
    
    if (id > 0) {
      sendEmail.cadastro(retorno.rows).catch(console.error);
      sendEmail.administrador(retorno.rows).catch(console.error);
    }
  
    return res.status(200).json({success:"true", rows: retorno.rows})
  } catch (err) {
    return res.status(200).json({success:"false", rows: null})
  }
})

module.exports = router;
const express = require("express")
const router = express.Router();

const etapas = require("../../service/Etapas")

router.post("/show", async (req, res) => {

  var retorno = await etapas.select(req.body.id_empresa, req.body.dt_periodo);

  return res.status(200).json({success:"true", rows: retorno.rows})
})

module.exports = router;
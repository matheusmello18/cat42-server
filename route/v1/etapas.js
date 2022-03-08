const express = require("express")
const router = express.Router();

const etapas = require("../../service/Etapas")
const etapaStatus = require('../../service/EtapaStatus');

router.post("/show", async (req, res) => {
  var retorno = await etapas.select(req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo);

  for (let index = 0; index < retorno.rows.length; index++) {
    const etapa = retorno.rows[index];
    if (etapa.ID_SIMUL_STATUS !== null){
      var retStatus = await etapaStatus.select(req.body.id_empresa, req.body.id_usuario, etapa.ID_SIMUL_ETAPA);
      retorno.rows[index].STATUS = retStatus.rows;
    } else {
      retorno.rows[index].STATUS = [];
    }
  }

  return res.status(200).json({success:"true", rows: retorno.rows})
})

module.exports = router;
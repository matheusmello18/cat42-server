const express = require("express");

const router = express.Router();

const model = require('../../service/model');
const GeracaoCat = require('../../service/GeracaoCat');

router.post("/cat", async (req, res) => {
  var success;
  try {
    if (req.body.nm_method === 'GeraResultadoCat42') {
      await GeracaoCat.Cat42(req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.nm_procedure1, req.body.nm_procedure2);
    }
    await new model.EtapaStatus().insert(req.body.dt_periodo, 1, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, 'Dados importado com sucesso.');  
    success = 'true';
  } catch (error) {
    await new model.EtapaStatus().insert(req.body.dt_periodo, 2, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, error.message);  
    success = 'false';
  }

  let retorno = await new model.EtapaStatus().select(req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.id_simul_etapa);

  if (success === 'true')
    return res.status(200).json({success:"true", message: 'Importação finalizada.', row: retorno.rows[0]});
  else
    return res.status(200).json({success:"false", message: 'Importação não finalizada.', row: retorno.rows[0]}); 
});

module.exports = router;
const express = require("express")
const path = require("path")
const multer = require("multer")
const router = express.Router();

const etapas = require("../../service/Etapas")
const etapaStatus = require('../../service/EtapaStatus');
const Importacoes = require('../../service/Importacoes');

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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      cb(null, "uploads")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

// picture i.e. 1 MB. it is optional
const maxSize = 5 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
        // Set the filetypes, it is optional
        var filetypes = /x-xls|xlsx|xls|vnd.openxmlformats-officedocument.spreadsheetml.sheet|excel/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
// mypic is the name of file attribute
}).single("arquivo"); 

router.post("/upload", (req, res) => {  
    upload(req,res, async function(err) {
    if(err) {
        // ERROR occured (here it can be occured due
        // to uploading image of size greater than
        // 1MB or uploading different file type)
        return res.status(200).json({success:"false", message: err})
    }
    else {
        // SUCCESS, image successfully uploaded
        var retorno = await etapas.select(req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.id_simul_etapa);

        if (retorno.rows[0].NM_METHOD === 'ImportarArqExcel'){
          console.log('entrou');
          Importacoes.Excel(req.file.filename, req.file.path, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo);
        }

        retorno = await etapas.select(req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.id_simul_etapa);
        var retStatus = await etapaStatus.select(req.body.id_empresa, req.body.id_usuario, req.body.id_simul_etapa);
        retorno.rows[0].STATUS = retStatus.rows;
        return res.status(200).json({success:"true", row: retorno.rows[0]})
    }
  })
})

module.exports = router;
const express = require("express");
const path = require("path");
const multer = require("multer");
var fs = require('fs');
const router = express.Router();

const etapas = require("../../service/Etapas")
const etapaStatus = require('../../service/EtapaStatus');
const Importacoes = require('../../service/Importacoes');
const { Console } = require("console");

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
      if (!fs.existsSync(`uploads/${req.body.nr_cnpj}`))
        fs.mkdirSync(`uploads/${req.body.nr_cnpj}`, { recursive: true })
      cb(null, `uploads/${req.body.nr_cnpj}`)
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
        var filetypes;
        if (req.body.nm_method === 'ImportarArqExcel'){
          filetypes = /x-xls|xlsx|xls|vnd.openxmlformats-officedocument.spreadsheetml.sheet|excel/;
        }
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
        if (req.body.nm_method === 'ImportarArqExcel'){
          Importacoes.Excel(req.file.filename, req.file.path, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.nr_cnpj);
        }

        retorno = await etapas.select(req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.id_simul_etapa);
        var retStatus = await etapaStatus.select(req.body.id_empresa, req.body.id_usuario, req.body.id_simul_etapa);
        retorno.rows[0].STATUS = retStatus.rows;
        return res.status(200).json({success:"true", row: retorno.rows[0]})
    }
  })
})

router.get("/download", async (req, res) => {

  if (req.query.arquivo === 'ImportarArqExcel'){
    const file = `${process.env.INIT_CWD}\\download\\planilha\\modelo\\produto.xlsx`;
    res.download(file); 
  }
  
});

module.exports = router;
const express = require("express");
const path = require("path");
const multer = require("multer");
var fs = require('fs');
const router = express.Router();

const etapas = require("../../service/Etapas")
const etapaStatus = require('../../service/EtapaStatus');
const Importacoes = require('../../service/Importacoes');

router.post("/show", async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(200).json({success:"false", message: err.message, rows: null})
  }
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

      if (req.body.nm_method === 'ImportarArqExcel'){
        var filetypes = /x-xls|xlsx|xls|vnd.openxmlformats-officedocument.spreadsheetml.sheet|excel/;
      } else if (req.body.nm_method === 'ImportarArqTexto') {
        var filetypes = /text|txt|tex\/plain|plain/;
      } else if (req.body.nm_method === 'ImportarArqXML') {
        var filetypes = /xml|xhtml+xml/;
      } else {
        var filetypes = /||/;
      }

      var mimetype = filetypes.test(file.mimetype);

      var extname  = filetypes.test(path.extname(file.originalname).toLowerCase());
      
      if (mimetype && extname) {
          return cb(null, true);
      }
    
      if (req.body.nm_method === 'ImportarArqExcel'){
        cb("O upload do arquivo não é compativel com o esperado. Permitdo arquivo Excel");
      } else if (req.body.nm_method === 'ImportarArqTexto') {
        cb("O upload do arquivo não é compativel com o esperado. Permitdo arquivo Texto");
      } else if (req.body.nm_method === 'ImportarArqXML') {
        cb("O upload do arquivo não é compativel com o esperado. Permitdo arquivo XML");
      }
    } 
  
// mypic is the name of file attribute
}).single("arquivo"); 

router.post("/upload", async (req, res) => {
    await upload(req,res, async function(err) {
    if(err) {
      // ERROR occured (here it can be occured due
      // to uploading image of size greater than
      // 5MB or uploading different file type)
      return res.status(200).json({success:"false", message: err, row: null})
    } else {
      // SUCCESS, image successfully uploaded
      try {
        if (req.body.nm_method === 'ImportarArqExcel') {
          await Importacoes.Excel(req.file.filename, req.file.path, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.nm_procedure1, req.body.nm_procedure2);
        } else if (req.body.nm_method === 'ImportarArqTexto') {
          Importacoes.Text(req.file.filename, req.file.path, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.id_orgao);
        } else if (req.body.nm_method === 'ImportarArqXML') {
          Importacoes.Xml(req.file.filename, req.file.path, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo);
        }

        retorno = await etapas.select(req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.id_simul_etapa);
        var retStatus = await etapaStatus.select(req.body.id_empresa, req.body.id_usuario, req.body.id_simul_etapa);
        retorno.rows[0].STATUS = retStatus.rows;
        return res.status(200).json({success:"true", message: 'Importação finalizada.', row: retorno.rows[0]});

      } catch (error) {
        return res.status(200).json({success:"false", message: 'Importação não finalizada. ' + error.message, row: null});  
      }
    }
  })
})

router.get("/download", async (req, res) => {

  if (req.query.arquivo === 'ImportarArqExcel'){
    const file = `${process.env.INIT_CWD}\\download\\planilha\\modelo\\Cat42_Simulador_CadProdutos.xlsx`;
    res.download(file); 
  }
  
});

module.exports = router;
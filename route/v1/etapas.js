const express = require("express");
const path = require("path");
const multer = require("multer");
var fs = require('fs');
const router = express.Router();

const model = require('../../service/model');
const Importacoes = require('../../service/Importacoes');

router.post("/show", async (req, res) => {
  try {
    var retorno = await new model.EtapaStatus().select(req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo);
     
    return res.status(200).json({success:"true", rows: retorno.rows})
  } catch (err) {
    return res.status(200).json({success:"false", message: err.message, rows: null})
  }
})

var storage = multer.diskStorage({
  // @ts-ignore
  destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      if (!fs.existsSync(`uploads/${req.body.nr_cnpj}`))
        fs.mkdirSync(`uploads/${req.body.nr_cnpj}`, { recursive: true })
      cb(null, `uploads/${req.body.nr_cnpj}`)
  },
  // @ts-ignore
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
      } else if (req.body.nm_method === 'ImportarArqXMLSaida') {
        var filetypes = /xml|xhtml+xml|zip/; /*application/x-zip-compressed*/
      } else if (req.body.nm_method === 'ImportarArqXMLEntrada') {
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
        // @ts-ignore
        cb("O upload do arquivo não é compativel com o esperado. Permitdo arquivo Excel");
      } else if (req.body.nm_method === 'ImportarArqTexto') {
        // @ts-ignore
        cb("O upload do arquivo não é compativel com o esperado. Permitdo arquivo Texto");
      } else if (req.body.nm_method === 'ImportarArqXMLSaida') {
        // @ts-ignore
        cb("O upload do arquivo não é compativel com o esperado. Permitdo arquivo XML/ZIP");
      } else if (req.body.nm_method === 'ImportarArqXMLEntrada') {
        // @ts-ignore
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

      var success;
      try {
        if (req.body.nm_method === 'ImportarArqExcel') {
          await Importacoes.Excel(req.file.filename, req.file.path, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.nm_procedure1, req.body.nm_procedure2);
        } else if (req.body.nm_method === 'ImportarArqTexto') {
          await Importacoes.Text(req.file.filename, req.file.path, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo, req.body.nm_procedure1, req.body.nm_procedure2, req.body.id_modulo, req.body.id_projeto);
        } else if (req.body.nm_method === 'ImportarArqXMLSaida') {
          await Importacoes.XmlSaida(req.file.filename, req.file.path, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo);
        } else if (req.body.nm_method === 'ImportarArqXMLEntrada') {
          await Importacoes.XmlEntrada(req.file.filename, req.file.path, req.body.id_simul_etapa, req.body.id_empresa, req.body.id_usuario, req.body.dt_periodo);
        }        
        
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
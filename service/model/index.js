/**
 * Modulo Model
 * 
 * @module model
 * @example
 * const model = require('./model');
 */

const Ac331 = require('./Ac331');
const Ac413 = require('./Ac413').Ac413;
const Ac431 = require('./Ac431').Ac431;
const Ac432 = require('./Ac432').Ac432;
const Ac0450 = require('./Ac0450').Ac0450;
const Sf0190 = require('./Sf0190').Sf0190;
const CtrlEmpresa = require('./CtrlEmpresa').CtrlEmpresa;
const CtrlUsuario = require('./CtrlUsuario').CtrlUsuario;
const EtapaStatus = require('./EtapaStatus').EtapaStatus;
const ModeloDocumento = require('./ModeloDocumento').ModeloDocumento;
const Cfop = require('./Cfop').CFOP;
const Pessoa = require('./Pessoa').Pessoa;
const Produto = require('./Produto').Produto;
const NotaFiscal = require('./NotaFiscalProduto');
const Sf433 = require('./Sf433').Sf433;
const Sf434 = require('./Sf434').Sf434;
const Sf453 = require('./Sf453').Sf453;
const SfCest = require('./SfCest').SfCest;
const Sf0460 = require('./Sf0460').Sf0460;
const SfC800 = require('./SfC800').SfC800;

const ProdutoSimulador = require('./ProdutoSimulador').ProdutoSimulador;
const Sf_Importa_Arquivo = require('./Sf_Importa_Arquivo').SFImportaArquivo;

module.exports = {
  Ac331, Ac0450, Ac413, Ac431, Ac432, SfCest,
  ProdutoSimulador, Sf_Importa_Arquivo, 
  CtrlEmpresa, CtrlUsuario, 
  EtapaStatus, ModeloDocumento, Cfop,
  Pessoa, Produto, NotaFiscal, 
  Sf433, Sf434, Sf453, Sf0460, SfC800,
  Sf0190
}
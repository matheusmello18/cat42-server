/**
 * Modulo Model
 * 
 * @module model
 */

const Ac331 = require('./Ac331');
const AcC700 = require('./AcC700');
const Ac413 = require('./Ac413').Ac413;
const Ac431 = require('./Ac431').Ac431;
const Ac0450 = require('./Ac0450').Ac0450;
const Sf0190 = require('./Sf0190');
const CtrlEmpresa = require('./CtrlEmpresa');
const CtrlUsuario = require('./CtrlUsuario');
const Etapas = require('./Etapas');
const EtapaStatus = require('./EtapaStatus');
const ModeloDocumento = require('./ModeloDocumento');
const Cfop = require('./Cfop');
const Pessoa = require('./Pessoa');
const Produto = require('./Produto');
//const Unidade = require('./Unidade');
const NotaFiscal = require('./NotaFiscalProduto');
const Sf433 = require('./Sf433');
const Sf434 = require('./Sf434');
const Sf453 = require('./Sf453');
const Sf0460 = require('./Sf0460');
const SfC800 = require('./SfC800');

const ProdutoSimulador = require('./ProdutoSimulador');
const Sf_Importa_Arquivo = require('./Sf_Importa_Arquivo');

module.exports = {
  Ac331, Ac0450, Ac413, Ac431, AcC700,
  ProdutoSimulador, Sf_Importa_Arquivo, 
  CtrlEmpresa, CtrlUsuario, Etapas, 
  EtapaStatus, ModeloDocumento, Cfop,
  Pessoa, Produto, NotaFiscal, 
  Sf433, Sf434, Sf453, Sf0460, SfC800,
  Sf0190
}
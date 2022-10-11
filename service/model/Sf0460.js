/**
 * Modulo Sf0460
 * 
 * @module model/Sf0460
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de Sf0460
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const Sf0460 = new model.Sf0460();
  */
 var Sf0460 = function(){
   if(!(this instanceof Sf0460))
     return new Sf0460();
 };
  
/**
 * Função buscar os dados do Sf0460 por observação
 * 
 * @param {string} ds_obs
 * @param {number} id_empresa
 * @returns {Promise} Promise
 * @example
 * const rows = (await Sf0460.selectByCodigo('DOCUMENTO INTEGRADO AUTOMATICAMENTE VIA INTEGRACAO GKO RETORNO', 1)).rows;
 * 
 * ou
 *
 * const rows = await Sf0460.selectByCodigo('DOCUMENTO INTEGRADO AUTOMATICAMENTE VIA INTEGRACAO GKO RETORNO', 1).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw err
 * })
 */
  
Sf0460.prototype.selectByCodigo = async (ds_obs, id_empresa) => {
  let sql = `select id_0460, cd_obs, id_empresa, dt_inicial, dt_movimento, id_usuario, ds_obs 
                from sf_0460
              where ds_obs = :ds_obs
                and id_empresa = :id_empresa
                and rownum = 1`;
  try {
    return await Oracle.select(sql, {ds_obs: ds_obs, id_empresa: id_empresa})
  } catch (err) {
    throw err
  }
}

/**
 * Função inserir os dados do Sf0460
 * 
 * @param {dataSf0460} dataSf0460
 * @returns {Promise} Promise
 * @example
 * var dataSf0460 = {
 *   id_empresa: 1,
 *   dt_inicial: '',
 *   dt_movimento: '',
 *   id_usuario: 1,
 *   ds_ob: ''s
 * }
 * await Sf0460.insert(dataSf0460);
 * 
 * ou
 *
 * const data = await Sf0460.insert(dataSf0460).then((e) => {
 *    return e;
 * }).catch((err) => {
 *    throw new Error('Erro ao inserir o registro.');
 * })
 */
Sf0460.prototype.insert = async (dataSf0460) => {
  const nProx_Codigo = await Oracle.proxCod("SF_0460");
  dataSf0460.cd_obs = (parseInt(nProx_Codigo) + 1).toString();

	let sql = `insert into SF_0460 (cd_obs, id_empresa, dt_inicial, dt_movimento, id_usuario, ds_obs) 
                 values (:cd_obs, :id_empresa, TO_DATE(:dt_inicial,'DD/MM/YYYY'), TO_DATE(:dt_movimento,'DD/MM/YYYY'), :id_usuario, :ds_obs)
						`;
	try {
		return await Oracle.insert(sql, dataSf0460).then(async (e) => {
      return await Oracle.select('select id_0460, cd_obs, id_empresa, dt_inicial, dt_movimento, id_usuario, ds_obs from sf_0460 where rowid = :id', {id: e.lastRowid})
      .then((e) => {
        return e.rows[0];
      })
    });
    
	} catch (err) {
		throw err
	}
}

module.exports.Sf0460 = Sf0460;

/**
 * Campos Chave Sf0460
 * 
 * @typedef {Object} dataSf0460
 * @property {String|null} cd_obs Pessoa Remetente
 * @property {String} dt_inicial Número do Documento
 * @property {String} dt_movimento Série e Subserie
 * @property {String} ds_obs Série e Subserie
 * @property {Number} id_usuario Data da emissão do documento
 * @property {Number} id_empresa Identificação da Empresa
 * @global
 */

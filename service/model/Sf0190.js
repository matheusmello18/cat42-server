/**
 * Modulo Sf0190
 * 
 * @module model/Sf0190
 */

 const Oracle = require('../Oracle');

 /**
  * Classe de Sf0190
  * 
  * @constructor
  * @example
  * const model = require('./model');
  * const Sf0190 = new model.Sf0190();
  */
 var Sf0190 = function(){
   if(!(this instanceof Sf0190))
     return new Sf0190();
 };
  
/**
 * Função buscar os dados do Sf0190 por unidade medida
 * 
 * @param {string} ds_unidade
 * @param {number} id_empresa
 * @param {string} dt_inicial
 * @returns {Promise} Promise
 * @example
 * const rows = (await Sf0190.selectByDsUnidade('UNIDAD', 1, '01/08/2013')).rows;
 * 
 * ou
 *
 * const rows = await Sf0190.selectByDsUnidade('UNIDAD', 1, '01/08/2013').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
Sf0190.prototype.selectByDsUnidade = async (ds_unidade, id_empresa, dt_inicial) => {
  let sql = `select id_0190, ds_unidade, ds_descricao, id_empresa, id_usuario, dt_inicial, dt_movimento, dm_tipo_unidade 
               from sf_0190 
              where id_empresa = :id_empresa 
                and upper(ds_unidade) = upper(:ds_unidade) 
                and (dt_inicial = (select max(sf.dt_inicial) 
                                     from sf_0190 sf 
                                    where sf.ds_unidade = sf_0190.ds_unidade 
                                      and sf.id_empresa = sf_0190.id_empresa 
                                      and sf.dt_inicial <= to_date(:dt_inicial,'dd/mm/yyyy'))
                 or dt_inicial is null)`;
  try {
    
    return await Oracle.select(sql, {ds_unidade: ds_unidade, id_empresa: id_empresa, dt_inicial: dt_inicial})
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Função buscar os dados do Sf0190 por unidade medida e cnpj
 * 
 * @param {string} ds_unidade_entrada
 * @param {string} cnpj_principal
 * @param {number} id_empresa
 * @returns {Promise} Promise
 * @example
 * const rows = (await Sf0190.selectDePara('PC', '04665945000183', 1)).rows;
 * 
 * ou
 *
 * const rows = await Sf0190.selectDePara('PC', '04665945000183' ,1).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw new Error(err.message)
 * })
 */
Sf0190.prototype.selectDePara = async (ds_unidade_entrada, cnpj_principal, id_empresa) => {
  let sql = `select ds_unidade_saida, ds_descricao_saida, 
                    ds_unidade_entrada, cnpj_principal, id_empresa 
               from comp_unidadee_unidades 
              where ds_unidade_entrada = :ds_unidade_entrada
                and cnpj_principal     = :cnpj_principal
                and id_empresa         = :id_empresa`;
  try {
    return await Oracle.select(sql, {ds_unidade_entrada: ds_unidade_entrada, cnpj_principal: cnpj_principal, id_empresa: id_empresa})
  } catch (err) {
    throw new Error(err);
  }
}

 /**
	* Função inserir os dados do Sf0190
	* 
	* @param {dataSf0190} dataSf0190 
	* @returns {Promise} Promise
  * @example
  * var dataSf0190 = {
  *   ds_unidade: '',
  *   ds_descricao: '',
  *   dt_inicial: '',
  *   dt_movimento: '',
  *   id_empresa: 1,
  *   id_usuario: 1
  * };
  * 
  * await Sf0190.insert(dataSf0190);
  * 
  * ou
  *
  * const data = await Sf0190.insert(dataSf0190).then((e) => {
  *    return e;
  * }).catch((err) => {
  *    throw new Error('Erro ao inserir o registro.')
  * })
	*/

Sf0190.prototype.insert = async (dataSf0190) => {
  let sql = `insert into sf_0190 
            ( ds_unidade, ds_descricao, dt_inicial, dt_movimento, id_empresa, id_usuario) 
            values 
            ( :ds_unidade, :ds_descricao, to_date(:dt_inicial, 'dd/mm/yyyy'), to_date(:dt_movimento, 'dd/mm/yyyy'), :id_empresa, :id_usuario)
            `;
  try {
    return await Oracle.insert(sql, dataSf0190)
  } catch (err) {
    // fazer tratamento se houver retorno do banco 20211, se houver este código ignorar
    throw new Error(err);
  }
}

 /**
	* Função inserir os dados do Sf0190
	* 
  * @param {number} id_empresa
  * @param {string} cnpj_principal
  * @param {string} ds_unidade_entrada
	* @returns {Promise} Promise
  * @example
  * 
  * await Sf0190.insertDePara('PC', '04665945000183', 1);
  * 
  * ou
  *
  * const data = await Sf0190.insertDePara('PC', '04665945000183', 1).then((e) => {
  *    return e;
  * }).catch((err) => {
  *    throw new Error('Erro ao inserir o registro Unidade Medida De Para.')
  * })
	*/
Sf0190.prototype.insertDePara = async (id_empresa, cnpj_principal, ds_unidade_entrada) => {
  let sql = `insert into comp_unidadee_unidades 
            ( id_empresa, cnpj_principal, ds_unidade_entrada) 
            values 
            ( :id_empresa, :cnpj_principal, :ds_unidade_entrada)
            `;
  try {
    return await Oracle.insert(sql, {
      id_empresa: id_empresa,
      cnpj_principal: cnpj_principal,
      ds_unidade_entrada: ds_unidade_entrada
    })
  } catch (err) {
    // fazer tratamento se houver retorno do banco 20211, se houver este código ignorar
    throw new Error(err);
  }
}

module.exports.Sf0190 = Sf0190;

/**
 * Campos Chave Sf0190
 * 
 * @typedef {Object} dataSf0190
 * @property {String} ds_unidade
 * @property {String} ds_descricao
 * @property {String} dt_inicial 
 * @property {String} dt_movimento
 * @property {Number} id_usuario Data da emissão do documento
 * @property {Number} id_empresa Identificação da Empresa
 * @global
 */

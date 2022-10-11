/**
 * Modulo Ac331
 * 
 * @module model/Ac331
 */

const Oracle = require('../Oracle');

/**
 * Classe de Municipio
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const municipio = new model.Ac331.Municipio();
 */
var Municipio = function(){
  if(!(this instanceof Municipio))
    return new Municipio();
};

/**
 * Função busca os dados do Município através do código do municipio
 * 
 * @param {string} cd_municipio Código do Municipio
 * @returns {Promise} Promise
 * @example
 * const rows = (await municipio.select('3534302')).rows;
 * 
 * ou
 *
 * const rows = await municipio.select('3534302').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw err
 * })
 */
Municipio.prototype.select = async (cd_municipio) => {
  try {
    return await Oracle.select(
      `SELECT ID_REF_331_MUNICIPIO,
              DS_MUNICIPIO,
              UF_MUNICIPIO,
              CD_MUNICIPIO
        FROM AC_331_MUNICIPIO
        WHERE CD_MUNICIPIO = :param1`,
        {param1: parseInt(cd_municipio)}
      );
  
  } catch (err) {
    throw err
  }
}
module.exports.Municipio = Municipio;

/**
 * Classe de Pais
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const pais = new model.Ac331.Pais();
 */
 var Pais = function(){
  if (!(this instanceof Pais))
    return new Pais();
};

/**
 * Função busca os dados do País através do código do país
 * 
 * @param {string} cd_pais Código do País
 * @return {Promise} Promise
 * 
 * @example
 * const rows = (await pais.select('01058')).rows;
 * 
 * ou
 *
 * const rows = await pais.select('01058').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw err
 * })
 */

Pais.prototype.select = async (cd_pais) => {
  try {
    return await Oracle.select(
      `SELECT ID_REF_331_PAIS,
              CD_PAIS,
              DS_PAIS
        FROM AC_331_PAIS
       WHERE TO_NUMBER(CD_PAIS) = TO_NUMBER(:param1)`,
      {param1: cd_pais});
  } catch (err) {
    throw err
  }
}
module.exports.Pais = Pais;


/**
 * Classe de Ncm
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const ncm = new model.Ac331.Ncm();
 */
 var Ncm = function(){
  if (!(this instanceof Ncm))
    return new Ncm();
};

/**
 * Função busca os dados do NCM através do código
 * 
 * @param {string} cd_ncm Código do NCM
 * @param {string} dt_movimento
 * @return {Promise} Promise
 * 
 * @example
 * const rows = (await ncm.select('01058')).rows;
 * 
 * ou
 *
 * const rows = await ncm.select('01058').then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw err
 * })
 */

Ncm.prototype.select = async (cd_ncm, dt_movimento) => {
  try {
    return await Oracle.select(
      `select id_ref_331_ncm, cd_ncm, ds_ncm 
         from ac_331_ncm
        where dt_inicial = (select max(ac.dt_inicial)
                             from ac_331_ncm ac
                            where ac.dt_inicial <= to_date(:dt_movimento, 'dd/mm/yyyy')
                              and ac.cd_ncm      = ac_331_ncm.cd_ncm)
          and cd_ncm = :cd_ncm
      `,
      {cd_ncm: cd_ncm, dt_movimento: dt_movimento});
  } catch (err) {
    throw err
  }
}

module.exports.Ncm = Ncm;

/**
 * Classe de ExIPI
 * 
 * @constructor
 * @example
 * const model = require('./model');
 * const exipi = new model.Ac331.ExIPI();
 */
 var ExIPI = function(){
  if (!(this instanceof ExIPI))
    return new ExIPI();
};

/**
 * Função busca os dados do Ex Ipi através do código
 * 
 * @param {string} cd_exipi Código do ExIpi
 * @param {number} id_ref_331_ncm 
 * @return {Promise} Promise
 * 
 * @example
 * const rows = (await exipi.select('01058', 15)).rows;
 * 
 * ou
 *
 * const rows = await exipi.select('01058', 15).then((e) => {
 *    return e.rows;
 * }).catch((err) => {
 *    throw err
 * })
 */

ExIPI.prototype.select = async (cd_exipi, id_ref_331_ncm) => {
  try {
    return await Oracle.select(
      `select id_ref_331_ex_ipi, nr_ex_ipi, ds_ex_ipi
        from ac_331_ex_ipi
       where id_ref_331_ncm = :id_ref_331_ncm
         and nr_ex_ipi = :nr_ex_ipi`,
      {nr_ex_ipi: cd_exipi, id_ref_331_ncm: id_ref_331_ncm});
  } catch (err) {
    throw err
  }
}

module.exports.ExIPI = ExIPI;
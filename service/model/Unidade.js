const Oracle = require('../Oracle');

module.exports.insert = async (Sf0190 = {}) => {
	let sql = `insert into sf_0190 
						( ds_unidade, ds_descricao, dt_inicial, dt_movimento, id_empresa, id_usuario) 
						values 
						( :ds_unidade, :ds_descricao, :dt_inicial, :dt_movimento, :id_empresa, :id_usuario)
						`;
	try {
		await Oracle.insert(sql, Sf0190)
	} catch (err) {
		throw new Error(err);
	}
}

/** require('./model').Unidade.insert
	Unidade.insert({
		ds_unidade:'',
		ds_descricao:'',
		dt_inicial:'',
		dt_movimento:'',
		id_empresa: id_empresa,
		id_usuario: id_usuario
	})
*/
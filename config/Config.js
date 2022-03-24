module.exports.appFrontEnd = {
  baseURL: "http://localhost:3000",
  origin: ['http://localhost:3000','http://192.168.0.131:3000']
}

module.exports.oracle = {
  libDir: `C:\\app\\mathe\\product\\11.2.0\\client_1`
}

module.exports.db = {
  user: "MF_PRODUCAO",
  password: "mf",
  connectString: "ORA_TESTE"
}

module.exports.email = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'matheus.mello@painelfiscal.com.br', // generated ethereal user
    pass: '#@!mello', // generated ethereal password
  },
}
module.exports.appFrontEnd = {
  baseURL: "http://localhost:3000"
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
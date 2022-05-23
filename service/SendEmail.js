// Precisa ativar no gmail para permitir o loginho do e-mail configurado fazer os envios dos e-mail segue a pagina que explica: https://nodemailer.com/usage/using-gmail/
const nodemailer = require("nodemailer");
const config = require('../config/Config');

module.exports.cadastro = async (rows) => {

  let transporter = nodemailer.createTransport(config.email);

  let info = await transporter.sendMail({
    from: `"Cadastro Simulador Cat42 👻" <${config.email.auth.user}>`, // sender address
    to: `${rows[0].DS_EMAIL}` , // list of receivers
    bcc: "ffcore.contato@gmail.com, matheus.gnu@gmail.com",
    subject: `${rows[0].NM_CONTATO} - Recebemos seu cadastro no Simulador Cat42 ✔`, // Subject line
    text: `Em breve entraremos em contato.`, // plain text body
    html: 
    `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Simulador Cat42</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      </head>
      <body>
          
        <div class="card text-center">
          <div class="card-header bg-white">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-5 align-self-center" style="max-width: 600px !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/painel-fiscal-horizontal-dark.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/bolsa-nacional-icms-horizontal.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/Painel-Contabil.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h2 class="card-title">Seja bem vindo ${rows[0].NM_CONTATO}.</h2>
            <p class="card-text">Agradecemos pela excelente escolha. Em breve entraremos em contato para maiores detalhamento.</p>
          </div>
        </div>

        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
      </body>
    </html>  
    `, // html body
    amp: 
    `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Simulador Cat42</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      </head>
      <body>
          
        <div class="card text-center">
          <div class="card-header bg-white">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-5 align-self-center" style="max-width: 600px !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/painel-fiscal-horizontal-dark.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/bolsa-nacional-icms-horizontal.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/Painel-Contabil.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h2 class="card-title">Seja bem vindo ${rows[0].NM_CONTATO}.</h2>
            <p class="card-text">Agradecemos pela excelente escolha. Em breve entraremos em contato para maiores detalhamento.</p>
          </div>
        </div>

        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
      </body>
    </html>  
    `,
  });

  /*console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));*/
}

/*
 * 
 * @param {rows: [
    {
      ID_SIMUL_CADASTRO: 24,
      DT_CADASTRO: 2021-09-15T15:47:42.000Z,
      NM_EMPRESA: 'ff-corexx',
      NR_CNPJ: '88888888888888',
      NM_CONTATO: 'MATHEUS DE MELLO IZABEL CRISTINA BUGNOLA DE MELLO',
      NR_TELEFONE: '55 169918385',
      DS_EMAIL: 'matheusnarciso@hotmail.com,
    }
  ]} rows 
 */
module.exports.administrador = async (rows) => {

  let transporter = nodemailer.createTransport(config.email);

  let info = await transporter.sendMail({
    from: `"Admin Simulador Cat42 👻" <${config.email.auth.user}>`, // sender address
    to: config.email.auth.user, // list of receivers
    bcc: "ffcore.contato@gmail.com, matheus.gnu@gmail.com",
    subject: `Recebemos um novo cadastro do ${rows[0].NM_EMPRESA} ✔`, // Subject line
    text: `Novo cadastro - ${rows[0].NM_EMPRESA}.`, // plain text body
    html: 
    `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Simulador Cat42</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      </head>
      <body>
          
        <div class="container mt-5">
          <div class="row text-center">
            <h2>Cadastro do Cliente</h2>
            <hr />
          </div>
          <div class="row">
            <form id="myForm" >
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Identificador</label>
                <input value="${rows[0].ID_SIMUL_CADASTRO}" type="text" placeholder="Nome do Contato" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Nome do Contato</label>
                <input value="${rows[0].NM_CONTATO}" type="text" placeholder="Nome do Contato" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Nome da Empresa</label>
                <input value="${rows[0].NM_EMPRESA}" type="text" placeholder="Nome da Empresa" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">CNPJ</label>
                <input value="${rows[0].NR_CNPJ}" type="text" placeholder="CNPJ" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">E-mail</label>
                <input value="${rows[0].DS_EMAIL}" type="email" placeholder="E-mail" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Telefone</label>
                <input value="${rows[0].NR_TELEFONE}" type="text" placeholder="Telefone" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
      </body>
    </html>  
    `,  // html body
    amp: 
    `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Simulador Cat42</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      </head>
      <body>
          
        <div class="container mt-5">
          <div class="row text-center">
            <h2>Cadastro do Cliente</h2>
            <hr />
          </div>
          <div class="row">
            <form id="myForm" >
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Identificador</label>
                <input value="${rows[0].ID_SIMUL_CADASTRO}" type="text" placeholder="Nome do Contato" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Nome do Contato</label>
                <input value="${rows[0].NM_CONTATO}" type="text" placeholder="Nome do Contato" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Nome da Empresa</label>
                <input value="${rows[0].NM_EMPRESA}" type="text" placeholder="Nome da Empresa" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">CNPJ</label>
                <input value="${rows[0].NR_CNPJ}" type="text" placeholder="CNPJ" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">E-mail</label>
                <input value="${rows[0].DS_EMAIL}" type="email" placeholder="E-mail" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Telefone</label>
                <input value="${rows[0].NR_TELEFONE}" type="text" placeholder="Telefone" class="form-control" id="exampleFormControlInput1" disabled>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
      </body>
    </html>  
    `, 
    list: {
      // List-Help: <mailto:admin@example.com?subject=help>
      help: `${config.email.auth.user}?subject=help`,

      // List-Unsubscribe: <http://example.com> (Comment)
      unsubscribe: [
          {
              url: 'http://example.com/unsubscribe',
              comment: 'A short note about this url'
          },
          'unsubscribe@painelfiscal.com.br'
      ],

      // List-ID: "comment" <example.com>
      id: {
          url: 'mylist.painelfiscal.com.br',
          comment: 'This is my awesome list'
      }
    },
  });
}

/*
 * 
 * @param usuario: { 
    DM_ATIVO: "S"
    E_MAIL: "MATHEUS.MELLO@PAINELFISCAL.COM.BR"
    HASH_RECOVERY: "f84997f7804666f0118af5578d2ee4e2"
    ID_USUARIO: 176
    NM_COMPLETO: "MATHEUS DE MELLO"
    NM_USUARIO: "MATHEUS"
  }
 */

module.exports.recuperarSenha = async (usuario, hash) => {

  let transporter = nodemailer.createTransport(config.email);

  let info = await transporter.sendMail({
    from: `"Recuperar Senha 👻" <${config.email.auth.user}>`, // sender address
    to: `${usuario.E_MAIL}` , // list of receivers
    bcc: "ffcore.contato@gmail.com, matheus.gnu@gmail.com",
    subject: `${usuario.NM_COMPLETO} - Segue as instruções para recuperar sua senha ✔`, // Subject line
    text: `Instruções para recuperar a senha.`, // plain text body
    html: 
    `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Simulador Cat42</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      </head>
      <body>
          
        <div class="card text-center">
          <div class="card-header bg-white">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-5 align-self-center" style="max-width: 600px !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/painel-fiscal-horizontal-dark.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/bolsa-nacional-icms-horizontal.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/Painel-Contabil.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h2 class="card-title">${usuario.NM_COMPLETO}. Iremos recuperar sua senha.</h2>
            <p class="card-text">Click no link para ser direcionado a recuperação de senha. <a href="${config.appFrontEnd.baseURL}/recovery/${hash}"> Recuperar Senha</a></p>
          </div>
        </div>

        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
      </body>
    </html>  
    `, // html body
    amp: 
    `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Simulador Cat42</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      </head>
      <body>
          
        <div class="card text-center">
          <div class="card-header bg-white">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-5 align-self-center" style="max-width: 600px !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/painel-fiscal-horizontal-dark.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/bolsa-nacional-icms-horizontal.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                  <img src="http://painelfiscal.com.br/Assets/images/Painel-Contabil.png" class="img-thumbnail" alt="..." style="width: 30% !important;">
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
          <h2 class="card-title">${usuario.NM_COMPLETO}. Iremos recuperar sua senha.</h2>
          <p class="card-text">Click no link para ser direcionado a recuperação de senha. <a href="${config.appFrontEnd.baseURL}/recovery/${usuario.HASH_RECOVERY}"> Recuperar Senha</a></p>
          </div>
        </div>

        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
      </body>
    </html>  
    `,
  });

  /*console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));*/
}
const Oracle = require('./Oracle');
const model = require('./model');
const utils = require('../utils');
const parseString = require('xml2js').parseString;
const fs = require("fs");
const { municipio } = require('./model/Ac331');


//deletar se existe o registro e importar novamnete;
//tomar atenção para este procedimento em outras importação se isso será necessário
//importar o cupom fiscal c800 e c850
//criar verificação que aceita somente modelo 55 e cupom fiscal (procurar seu modelo)
module.exports.XmlSaida = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

  fs.readFile(path, "utf8", async (err, xml) => {
    if (err){
      /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
      await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message);
      throw new Error(err.message);
    }
    parseString(xml, async function (err, result) {
      if (err){
        /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
        await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message);
        throw new Error(err.message);
      }

			const Empresa = (await model.CtrlEmpresa.select(id_empresa)).rows[0];

			if(Empresa.CNPJ_EMPRESA !== result.nfeProc?.NFe[0]?.infNFe[0]?.emit[0].CNPJ[0]) { //então saida
				await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Nota fiscal informada não é uma nota fiscal de saída.');
        throw new Error(err.message);
			}

      console.log(result.nfeProc?.$.versao)
      console.dir(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.cUF[0]);
      
      if (result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.cUF)
        console.log(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.cUF)
      
      if (result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.ver !== undefined)
        console.dir(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.ver)
  
      if (result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.ver)
        console.log(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.ver)


			
			var inParametro = (await Oracle.select(
				`SELECT DM_IMPORTAXML_DEPARA, /*para nfe entrada*/
								NVL(DM_APURACAO_DTEMISSAO, 'N') DM_APURACAO_DTEMISSAO, 
								NVL(DM_IMPXML_CNPJ_PROD, 'N') DM_IMPXML_CNPJ_PROD, 
								NVL(DM_PESQ_AC_0450, 'S') DM_PESQ_AC_0450
					FROM IN_PARAMETRO_EMPRESA 
					WHERE ID_EMPRESA = :ID_EMPRESA`, 
				{ID_EMPRESA: id_empresa}
			)).rows[0];

      //result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.UF[0]
			//result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.CNPJ ou result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.CPF
			//result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.UF[0]? EX : 
      const dhEmi = utils.FormatarData.DateXmlToDateOracleString(utils.Validar.ifelse(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dhEmi, result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dEmi)[0]);
      const dSaiEnt = inParametro.DM_APURACAO_DTEMISSAO === 'N' ? utils.FormatarData.DateXmlToDateOracleString(utils.Validar.ifelse(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dhSaiEnt, result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dSaiEnt)[0]) : dhEmi;
      const cd_modelo_documento = utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.mod, 0, "");
      const cpfOrCnpj = utils.Validar.ifelse(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.CNPJ, result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.CPF)[0];
      const Pais = (await model.Ac331.pais.select(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.cPais[0])).rows[0];
      const Municipio = (await model.Ac331.municipio.select(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.cMun[0])).rows[0];

      let cd_pessoa = '';

      if (result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.UF[0] == 'EX') {
        const PessoaMestre = (await model.Pessoa.Mestre.selectByRazaoSocial(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.xNome[0], id_empresa)).rows[0];
        if (PessoaMestre === undefined){
          let id_pessoa = await Oracle.proxCod("IN_PESSOA_MESTRE");
          cd_pessoa = id_pessoa + '-EX';
          await model.Pessoa.Mestre.insert({
            id_pessoa: id_pessoa,
            cd_pessoa: cd_pessoa,
            id_empresa: id_empresa, 
            id_usuario: id_usuario
          })
        } else {
          cd_pessoa = PessoaMestre.CD_PESSOA;
        }
      } else {      
        const PessoaMestre = (await model.Pessoa.Mestre.selectByCpfOrCpnj(cpfOrCnpj,dhEmi,id_empresa)).rows[0];

        if (PessoaMestre !== undefined){
          cd_pessoa = PessoaMestre.CD_PESSOA;
        }
      }

      if (result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.UF[0] == 'EX') {
        if (cd_pessoa.endsWith('-EX')){
          //importo
        }
      } else if (cd_pessoa.length == 0) {
        cd_pessoa = cpfOrCnpj;
        //importo
      }

      //dt_inicial pegar data da nota se for menor que a data do cadastro simul
      //0150
      await model.Pessoa.insert({
        dt_inicial: utils.FormatarData.RetornarMenorDataEmOracle(dhEmi, dt_periodo),
        cd_pessoa: cd_pessoa,
        nm_razao_social: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.xNome, 0),
        ds_endereco: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.xLgr, 0),
        ds_bairro: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.xBairro, 0),
        id_ref_331_municipio: Municipio.ID_REF_331_MUNICIPIO,
        uf: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.UF, 0),
        id_ref_331_pais: Pais.ID_REF_331_PAIS,
        nr_cep: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.CEP, 0),
        nr_cnpj_cpf: cpfOrCnpj,
        nr_inscricao_estadual: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.IE, 0),
        dt_movimento: dhEmi,
        nr_numero: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.nro, 0),
        ds_complemento: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.xCpl, 0),
        nr_fone: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderdest[0]?.Fone, 0),
        dm_contribuinte: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.indIEDest, 0),
        nr_id_estrangeiro: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.IdEstrangeiro, 0),
        id_empresa: id_empresa,
        id_usuario: id_usuario
      });

      // melhorar esta chamada com o then e catch
      await model.Pessoa.sp_gera_pessoa_mestre_item();

      let dm_entrada_saida = utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.tpNF, 0, "") == "1" ? "S" : "E"
      
      const PessoaDestinatario = (await model.Pessoa.Mestre.selectByCdPessoa(cd_pessoa, id_empresa)).rows[0];
      const ModeloDocumento = (await model.ModeloDocumento.selectByCdModeloDocumento(cd_modelo_documento)).rows[0].ID_MODELO_DOCUMENTO;
      const Ac413 = (await model.Ac413.selectByCodigo('00')).rows[0];
      const serie_subserie_documento = utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.serie, 0)
      const nr_documento =  utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.nNF, 0)
      
      let vl_outras_despesas = parseFloat(utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.det[0].ICMSTot[0]?.vOutro, 0, "0").replace('.',','))
      
      const Cfop = (await model.Cfop.selectByCdCfop(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0])).rows[0];
      if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
        if (Cfop.DM_ICMS_VL_CONTABIL === 'S'){
          vl_outras_despesas = vl_outras_despesas + 
            parseFloat(utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vOutro, 0).replace('.',','));
        }
        if (Cfop.DM_VLCONTABIL_PISCOFINS === 'S'){
          vl_outras_despesas = vl_outras_despesas + 
            parseFloat(utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vPIS, 0).replace('.',',')) +
            parseFloat(utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vCOFINS, 0).vCOFINS('.',','));
        }
        if (Cfop.DM_VLCONTABIL_II === 'S'){
          vl_outras_despesas = vl_outras_despesas + 
            parseFloat(utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vII, 0).vCOFINS('.',','));
        }
      }

      //C100
      await model.NotaFiscal.Saida.Produto.insert({
        dm_entrada_saida: dm_entrada_saida,
        id_pessoa_destinatario: PessoaDestinatario.ID_PESSOA,
        id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
        serie_subserie_documento: serie_subserie_documento,
        nr_documento: nr_documento,
        dm_tipo_fatura: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.indPag, 0, "0"),
        dt_emissao_documento: dhEmi,
        dt_entrada_saida: dSaiEnt,
        vl_total_nota_fiscal: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vNF, 0).replace('.',','),
        vl_desconto: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vDesc, 0, "0").replace('.',','),
        vl_icms_substituicao: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vST, 0, "0").replace('.',','),
        vl_outras_despesas: vl_outras_despesas,
        vl_total_mercadoria: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vProd, 0, "0").replace('.',','),
        vl_frete: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vFrete, 0, "0").replace('.',','),
        vl_ipi: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vIPI, 0, "0").replace('.',','),
        vl_seguro: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vSeg, 0, "0").replace('.',','),
        dm_modalidade_frete: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.transp[0].modFrete, 0, "0").replace('.',','),
        id_ref_413: Ac413.ID_REF_413,
        vl_icms_desonerado: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMSDeson, 0, "0").replace('.',','),
        dm_cancelamento: 'N',
        dm_gare: 'N',
        dm_gnre: 'N',
        nr_chave_nf_eletronica: result.nfeProc?.NFe[0]?.infNFe[0]?.$.Id.toUpperCase().replace('NFE'),
        id_pessoa_remetente_cte: '', //VAZIO
        vl_icms_fcp: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vFCPUFDest, 0, "0").replace('.',','),
        vl_icms_uf_dest: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMSUFDest, 0, "0").replace('.',','),
        vl_icms_uf_remet: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMSUFRemet, 0, "0").replace('.',','),
        nr_chave_nf_eletron_ref_cat83: result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.NFref === undefined ? "" : utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.NFref[0].refNFe, 0, "0").replace('.',','),
        vl_fcp_st: utils.Validar.getValueArray(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vFCPST, 0, "0").replace('.',','),
        id_ref_331_munic_orig: '',
        id_ref_331_munic_dest: '',
        dm_tipo_cte: '',
        dm_finalidade: '',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      });

      if (result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic !== undefined){

        if (result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infCpl !== undefined){
          let ac0450 = (await model.Ac0450.select(
            result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infCpl[0],
            id_empresa,
            dhEmi
          )).rows[0];

          var id_ref_0450
          if (ac0450 == undefined){
            id_ref_0450 = (await model.Ac0450.insert(
              result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infCpl[0],
              id_empresa,
              dhEmi
            ))
          } else {
            id_ref_0450 = ac0450.ID_REF_0450
          }
          //C110
          await model.NotaFiscal.Saida.Produto.SfC110.insert({
            id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
            dm_entrada_saida: dm_entrada_saida,
            serie_subserie_documento: serie_subserie_documento,
            nr_documento: nr_documento,
            dt_emissao_documento: dhEmi,
            nr_item_imp: "1",
            id_ref_0450: id_ref_0450,
            ds_complementar: result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infCpl[0].substring(1,3980),
            id_empresa: id_empresa,
            id_usuario: id_usuario
          })
        }

        if (result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco !== undefined){
          var ac0450 = (await model.Ac0450.select(
            result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco[0],
            id_empresa,
            dhEmi
          )).rows[0];

          let id_ref_0450
          if (ac0450 == undefined){
            id_ref_0450 = (await model.Ac0450.insert(
              result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco[0],
              id_empresa,
              dhEmi
            ))
          } else {
            id_ref_0450 = ac0450.ID_REF_0450
          }
          //C110
          await model.NotaFiscal.Saida.Produto.SfC110.insert({
            dm_entrada_saida: dm_entrada_saida,
            id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
            serie_subserie_documento: serie_subserie_documento,
            nr_documento: nr_documento,
            dt_emissao_documento: dhEmi,
            nr_item_imp: "1",
            id_ref_0450: id_ref_0450,
            ds_complementar: result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco[0],
            id_empresa: id_empresa,
            id_usuario: id_usuario
          })
        }
      }

      for (let i = 0; i < result.nfeProc?.NFe[0]?.infNFe[0]?.det.length; i++) {

        const det = result.nfeProc?.NFe[0]?.infNFe[0]?.det[i];

        const chaveC100 = {
          dm_entrada_saida: dm_entrada_saida,
          id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
          serie_subserie_documento: serie_subserie_documento,
          nr_documento: nr_documento,
          dt_emissao_documento: dhEmi,
          nr_sequencia: det.$.nItem, //sItem_Seq
          nr_item: det.$.nItem,
        };
        
        const prod = await model.Produto.Mestre.selectByCodigo(det.prod[0]?.cProd[0], id_empresa);
        let id_produto_servico;

        if (prod.rows.length === 0){

        }

        if (inParametro.DM_APURACAO_DTEMISSAO === 'S'){

        }

        let ds_unidade = utils.Validar.getValueArray(det.prod[0]?.uCom, 0, "XX");


        let unidade = await model.Sf0190.selectByDsUnidade(ds_unidade, id_empresa, dhEmi).rows[0];

        if (unidade === undefined){
          //0190
          await model.Unidade.insert({
            ds_unidade: ds_unidade,
            ds_descricao: ds_unidade,
            dt_inicial: dhEmi,
            dt_movimento: dhEmi,
            id_empresa: id_empresa,
            id_usuario: id_usuario
          });
        } else {
          ds_unidade = unidade.DS_UNIDADE;
        }

        let cd_produto_servico = utils.FormatarString.removeCaracteresEspeciais(det.prod[0]?.cProd[0])
        let produto = (await model.Produto.Item.selectByCodigo(cd_produto_servico, id_empresa, dhEmi)).rows[0];
        
        await model.Produto.insert({
          cd_produto_servico: cd_produto_servico,
          cd_barra: det.prod[0]?.cEANTrib[0],
          ds_produto_servico: det.prod[0]?.xProd[0],
          id_ref_331_ncm: det.prod[0]?.NCM[0],
          id_ref_331_ex_ipi: det.prod[0]?.EXTIPI[0],
          dm_tipo_item: produto === undefined ? '99' : produto.DM_TIPO_ITEM,
          unidade: ds_unidade,
          id_0190: ds_unidade,
          dt_inicial: dhEmi,
          dt_movimento: dhEmi,
          id_cest: utils.Validar.getValueArray(det.prod[0]?.CEST, 0, ""),
          id_empresa: id_empresa,
          id_usuario: id_usuario
        })

        await model.Produto.sp_gera_produto_mestre_item();

        await model.Produto.Item.selectByCodigo(cd_produto_servico, id_empresa, dhEmi);

        const paramC170 = {
          /**
           * @param {integer} id_produto_servico
           */
          id_produto_servico: id_produto_servico,
          /**
           * @param {string} ds_unidade
           */
          id_0190: ds_unidade,
          /**
           * @param {number} det.prod[0]?.vUnCom
           */
          vl_unitario: utils.Validar.getValueArray(det.prod[0]?.vUnCom, 0, "0").replace('.',','),
          /**
           * @param {number} det.prod[0]?.vProd
           */
          vl_total_item: utils.Validar.getValueArray(det.prod[0]?.vProd, 0, "0").replace('.',','),
          /**
           * @param {number} det.prod[0]?.vDesc
           */
          vl_desconto_item: utils.Validar.getValueArray(det.prod[0]?.vDesc, 0, "0").replace('.',','),
          /**
           * @param {string} 'S'
           */
          dm_movimentacao_fisica: 'S',
          /**
           * @param {string} det.prod[0]?.CFOP[0]
           */
          cd_fiscal_operacao: det.prod[0]?.CFOP[0],
          /**
           * @param {string} det.prod[0]?.nFCI
           */
          nr_fci: utils.Validar.getValueArray(det.prod[0]?.nFCI, 0, ""),
          /**
           * @param {string} sCST_ICMS
           */
          id_ref_431:'', //sCST_ICMS
          /**
           * @param {number} sVl_Bc_ICMS
           */
          vl_base_calculo_icms: 0, //sVl_Bc_ICMS
          /**
           * @param {number} sVl_ICMS
           */
          vl_icms: 0, //sVl_ICMS
          /**
           * @param {number} sVl_Bc_ICMS_ST
           */
          vl_base_calculo_icms_subst: 0, //sVl_Bc_ICMS_ST
          /**
           * @param {number} sAliq_ICMS_ST
           */
          aliq_icms_subs: 0, //sAliq_ICMS_ST
          /**
           * @param {number} sVl_ICMS_ST
           */
          vl_icms_substituicao: 0, //sVl_ICMS_ST
          /**
           * @param {number} sAliq_ICMS
           */
          aliq_icms: 0, //sAliq_ICMS
          /**
           * @param {number} sVl_Red_ICMS
           */
          vl_reducao_bc_icms: 0, //sVl_Red_ICMS
          /**
           * @param {number} sAliq_Red_ICMS
           */
          vl_perc_red_icms: 0, // sAliq_Red_ICMS
          /**
           * @param {number} sAliq_Red_ICMS_ST
           */
          vl_perc_red_icms_st: 0, //sAliq_Red_ICMS_ST
          /**
           * @param {string} sModBC
           */
          dm_mod_bc_icms:'', //sModBC
          /**
           * @param {string} sModBC_ST
           */
          dm_mod_bc_icms_st:'', //sModBC_ST
          /**
           * @param {string} '5'
           */
          dm_tributacao_icms: '5', //esta fixo no fonte
          /**
           * @param {string} sCST_IPI
           */
          id_ref_432:'', //sCST_IPI
          /**
           * @param {number} sVl_Bc_IPI
           */
          vl_base_calculo_ipi: 0, //sVl_Bc_IPI
          /**
           * @param {number} sVl_IPI
           */
          vl_ipi: 0, //sVl_IPI
          /**
           * @param {number} sAliq_IPI
           */
          aliq_ipi: 0, //sAliq_IPI
          /**
           * @param {number} qQtde
           */
          qtde: 0, //qQtde
          /**
           * @param {string} qUnid
           */
          unidade:'', // qUnid
          /**
           * @param {string} '5'
           */
          dm_tributacao_ipi: '5', // esta fixo no fonte
          /**
           * @param {number} nVl_Icms_Outro
           */
          vl_outras_despesas: 0, //nVl_Icms_Outro
          /**
           * @param {number} svFrete
           */
          vl_frete: 0, //svFrete
          /**
           * @param {number} svSeg
           */
          vl_seguro: 0, //svSeg
          /**
           * @param {string} sDs_Prod
           */
          ds_complementar: det.prod[0]?.xProd[0], //sDs_Prod
          /**
           * @param {string} sMotDesoner
           */
          dm_mot_desc_icms:'', //sMotDesoner
          /**
           * @param {number} sVl_Desoner
           */
          vl_icms_desonerado: 0, //sVl_Desoner
          /**
           * @param {number} sVl_Bc_II
           */
          vl_bc_ii: 0, //sVl_Bc_II
          /**
           * @param {number} sVl_Desp_Adu
           */
          vl_desp_adu: 0, //sVl_Desp_Adu
          /**
           * @param {number} sVl_II
           */
          vl_ii: 0, //sVl_II
          /**
           * @param {number} sVl_IOF
           */
          vl_iof: 0, //sVl_IOF
          /**
           * @param {number} nBc_ICMS_Difal
           */
          vl_bc_icms_uf_dest: 0, //nBc_ICMS_Difal
          /**
           * @param {number} nPerc_FCP
           */
          perc_icms_fcp: 0, //nPerc_FCP
          /**
           * @param {number} nAliq_UF_Dest
           */
          aliq_icms_uf_dest: 0, //nAliq_UF_Dest
          /**
           * @param {number} nAliq_Interest
           */
          aliq_icms_interestadual: 0, //nAliq_Interest
          /**
           * @param {number} nPerc_Partilha
           */
          perc_icms_partilha: 0, //nPerc_Partilha
          /**
           * @param {number} nVlICMS_FCP
           */
          vl_icms_fcp: 0, //nVlICMS_FCP
          /**
           * @param {number} nVlICMS_UF_Dest
           */
          vl_icms_uf_dest: 0, //nVlICMS_UF_Dest
          /**
           * @param {number} nVlICMS_UF_Remet
           */
          vl_icms_uf_remet: 0, //nVlICMS_UF_Remet
          /**
           * @param {string} sEnquadra
           */
          id_ref_453: '', //sEnquadra
          /**
           * @param {number} sBC_FCP_OP
           */
          vl_bc_fcp_op: 0, //sBC_FCP_OP
          /**
           * @param {number} sAliq_FCP_OP
           */
          aliq_fcp_op: 0, //sAliq_FCP_OP
          /**
           * @param {number} sFCP_OP
           */
          vl_fcp_op: 0, //sFCP_OP
          /**
           * @param {number} sBC_FCP_ST
           */
          vl_bc_fcp_st: 0, //sBC_FCP_ST
          /**
           * @param {number} sAliq_FCP_ST
           */
          aliq_fcp_st: 0, //sAliq_FCP_ST
          /**
           * @param {number} sFCP_ST
           */
          vl_fcp_st: 0, //sFCP_ST
          /**
           * @param {number} sVl_Bc_ICMS_ST_OBS
           */
          vl_bc_icms_st_obs: 0, //sVl_Bc_ICMS_ST_OBS
          /**
           * @param {number} sVl_ICMS_ST_OBS
           */
          vl_icms_st_obs: 0, 
          /**
           * @param {integer} sQtdeTrib
           */
          qtde_tributada: 0, //sQtdeTrib
        };

        let impostoICMS;
        
        if (det.imposto[0]?.ICMS[0]?.ICMS00 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS00[0];

          paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace('.',',')); //sVl_Bc_ICMS
          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace('.',',')); //sAliq_ICMS
          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',',')); //sVl_ICMS

          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; //nVl_Icms_Outro
          }

          paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, ""); //sModBC
          paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace('.',',')); //sAliq_FCP_OP
          paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace('.',',')); //sFCP_OP
          
          if (paramC170.vl_fcp_op > 0)
            paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "").replace('.',',')); //sFCP_OP

        }else if (det.imposto[0]?.ICMS[0]?.ICMS10 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS10[0];

          paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace('.',',')); 
          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace('.',',')); 
          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',',')); 

          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; 
          }

          paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace('.',',')); 
          paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace('.',',')); 
          paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace('.',',')); 
          
          paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace('.',',')); 

          paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, "");
          paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

          paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace('.',','));
          paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace('.',',')); 
          
          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace('.',',')); 

        }else if (det.imposto[0]?.ICMS[0]?.ICMS20 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS20[0];

          paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace('.',',')); 
          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace('.',',')); 
          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',',')); 

          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; 
          }

          if (impostoICMS.motDesICMS !== undefined){
            paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
            paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace('.',',')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',','));
          }

          paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',',')) / 100) / 100); 
          paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',','));
          paramC170.dm_mod_bc_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.modBC, 0, "")); 

          paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace('.',','));
          paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace('.',','));         

        }else if (det.imposto[0]?.ICMS[0]?.ICMS30 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS30[0];

          paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace('.',',')); 
          paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace('.',',')); 
          paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace('.',',')); 
          
          paramC170.vl_perc_red_icms_st = utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace('.',',');
          paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

          if (impostoICMS.motDesICMS !== undefined){
            paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
            paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace('.',',')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',','));
          }

          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace('.',',')); 

        }else if (det.imposto[0]?.ICMS[0]?.ICMS40 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS40[0];
          
          if (impostoICMS.motDesICMS !== undefined){
            paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
            paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace('.',',')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',','));
          }

        }else if (det.imposto[0]?.ICMS[0]?.ICMS51 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS51[0];
          paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace('.',',')); 
          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace('.',',')); 
          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',',')); 

          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; 
          }

          paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',',')) / 100) / 100); 
          paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',','));
          paramC170.dm_mod_bc_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.modBC, 0, "")); 

          paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace('.',','));
          paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace('.',','));   
          
        }else if (det.imposto[0]?.ICMS[0]?.ICMS60 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS60[0];

          paramC170.vl_bc_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTRet, 0, "0").replace('.',',')); 
          paramC170.vl_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSSTRet, 0, "0").replace('.',',')); 

          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPSTRet, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPSTRet, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPSTRet, 0, "0").replace('.',','));   

        }else if (det.imposto[0]?.ICMS[0]?.ICMS70 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS70[0];

          paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace('.',',')); 
          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace('.',',')); 
          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',',')); 

          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; 
          }

          paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace('.',',')); 
          paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace('.',',')); 
          paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace('.',',')); 

          paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',',')) / 100) / 100); 
          paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',','));
          paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace('.',','));
          
          paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, ""); 
          paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

          if (impostoICMS.motDesICMS !== undefined){
            paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
            paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace('.',',')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',','));
          }

          paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace('.',','));
          paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace('.',',')); 
          
          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace('.',','));
          
        }else if (det.imposto[0]?.ICMS[0]?.ICMS90 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS90[0];

          paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace('.',',')); 
          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace('.',',')); 
          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',',')); 
          
          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; 
          }

          paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace('.',',')); 
          paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace('.',',')); 
          paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace('.',',')); 

          paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',',')) / 100) / 100); 
          paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',','));
          paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace('.',','));
          
          paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, "");
          paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

          if (impostoICMS.motDesICMS !== undefined){
            paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
            paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace('.',',')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',','));
          }

          paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace('.',','));
          paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace('.',',')); 
          
          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace('.',','));

        }else if (det.imposto[0]?.ICMS[0]?.ICMSPart !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSPart[0];

          paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace('.',',')); 
          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace('.',',')); 
          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',',')); 
          
          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; 
          }

          paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace('.',',')); 
          paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace('.',',')); 
          paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace('.',',')); 

          paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',',')) / 100) / 100); 
          paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',','));
          paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace('.',','));
          
          paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, "");
          paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

        }else if (det.imposto[0]?.ICMS[0]?.ICMSST !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSST[0];

          paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTDest, 0, "0").replace('.',','));
          paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTDest, 0, "0").replace('.',','));

        }else if (det.imposto[0]?.ICMS[0]?.ICMSSN101 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN101[0];

          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vCredICMSSN, 0, "0").replace('.',','));
          
          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; 
          }

          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pCredSN, 0, "0").replace('.',',')); 

        }else if (det.imposto[0]?.ICMS[0]?.ICMSSN102 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN102[0]; // não tem valores
        }else if (det.imposto[0]?.ICMS[0]?.ICMSSN201 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN201[0];

          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vCredICMSSN, 0, "0").replace('.',','));
          
          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; 
          }

          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pCredSN, 0, "0").replace('.',',')); 

          paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace('.',',')); 
          paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace('.',',')); 
          paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace('.',',')); 

          paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace('.',','));
          
          paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace('.',','));

        }else if (det.imposto[0]?.ICMS[0]?.ICMSSN202 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN202[0];

          paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace('.',',')); 
          paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace('.',',')); 
          paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace('.',',')); 
          
          paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace('.',','));
          
          paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace('.',','));

          paramC170.vl_bc_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTRet, 0, "0").replace('.',',')); 
          paramC170.vl_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSSTRet, 0, "0").replace('.',',')); 

          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPSTRet, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPSTRet, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPSTRet, 0, "0").replace('.',','));   

        }else if (det.imposto[0]?.ICMS[0]?.ICMSSN500 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN500[0];
          
          paramC170.vl_bc_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTRet, 0, "0").replace('.',',')); 
          paramC170.vl_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSSTRet, 0, "0").replace('.',',')); 

          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPSTRet, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPSTRet, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPSTRet, 0, "0").replace('.',','));   

        }else if (det.imposto[0]?.ICMS[0]?.ICMSSN900 !== undefined){
          impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN900[0];

          paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace('.',',')); 
          paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace('.',',')); 
          paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace('.',',')); 

          if (['3', '7'].includes(result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.prod[0]?.CFOP[0][0])){
            if (Cfop.DM_ICMS_VL_CONTABIL === 'S')
              paramC170.vl_outras_despesas = vl_outras_despesas + paramC170.vl_icms; 
          }

          paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace('.',',')); 
          paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace('.',',')); 
          paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace('.',',')); 

          paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',',')) / 100) / 100); 
          paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace('.',','));
          paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace('.',',')); 

          paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, "");
          paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

          paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace('.',','));
          paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace('.',',')); 
          paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace('.',',')); 
        }

        if (['ICMS00', 'ICMS10', 'ICMS20', 'ICMS30', 'ICMS40', 'ICMS51',
             'ICMS60', 'ICMS70', 'ICMS90', 'ICMSPart', 'ICMSST'].some((value) => { 
          return value == Object.keys(det.imposto[0]?.ICMS[0])[0];
        })) {
          impostoICMS.codAc431 = utils.Validar.getValueArray(impostoICMS.orig, 0, "") + utils.Validar.getValueArray(impostoICMS.CST, 0, "")
        } else if (['ICMSSN101', 'ICMSSN102', 'ICMSSN201', 
                    'ICMSSN202', 'ICMSSN500', 'ICMSSN900'].some((value) => { 
          return value == Object.keys(det.imposto[0]?.ICMS[0])[0];
        })){
          impostoICMS.codAc431 = utils.Validar.getValueArray(impostoICMS.CSOSN, 0, "")
        } else {
          impostoICMS.codAc431 = '';
        }

        await model.Ac431.selectByCodigo(
          impostoICMS.codAc431
        ).then(async (result) => {
          const ac431 = result.rows[0];

          if (ac431 === undefined)
            await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Código CST Inválido.');
          else
            paramC170.id_ref_431 = ac431.ID_REF_431; //sCST_ICMS

        }).catch(async (err) => {
          await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err);
        });

        if(impostoICMS.codAc431.length == 2)
          impostoICMS.codAc431 = '0' + impostoICMS.codAc431;

        if(impostoICMS.codAc431.length == 0)
          impostoICMS.codAc431 = '090';

        if(impostoICMS.codAc431.length == 2)
          impostoICMS.codAc431 = '0' + impostoICMS.codAc431;
          
        const Sf453 = (await model.Sf453.selectByCodigo(utils.Validar.getValueArray(det.imposto[0]?.IPI[0]?.cEnq, 0, ""))).rows[0];
        paramC170.id_ref_453 = Sf453 === undefined ? Sf453.ID_REF_453 : "";

        if (det.imposto[0]?.IPI[0]?.IPITrib !== undefined){

        }

        //paramC170.id_ref_432
        
        //C170
        await model.NotaFiscal.Saida.Produto.Item.insert({
          ...chaveC100,
          ...paramC170,
          id_empresa: id_empresa,
          id_usuario: id_usuario
        })

        await model.NotaFiscal.Saida.Produto.Item.AcC050.insert({
          ...chaveC100,
          id_ref_433:'',
          aliq_pis:'',
          vl_bc_pis:'',
          vl_pis:'',
          vl_aliq_pis:'',
          vl_pis_st:'',
          qtde_bc_pis:'',
          id_ref_434:'',
          aliq_cofins:'',
          vl_bc_cofins:'',
          vl_cofins:'',
          vl_aliq_cofins:'',
          vl_cofins_st:'',
          qtde_bc_cofins:'',
          id_nota_fiscal_saida:'',
          id_empresa: id_empresa,
          id_usuario: id_usuario
        })

        await model.NotaFiscal.Saida.Produto.SfC195.insert({
          ...chaveC100,
          id_0460:'',
          ds_complementar:'',
          id_nota_fiscal_saida:'',
          id_empresa: id_empresa,
          id_usuario: id_usuario
        })
      }
    })
  });
  
  //Oracle.execProcedure(nm_procedure1, id_empresa, id_usuario);
  //Oracle.execProcedure(nm_procedure2, id_empresa, id_usuario);
  
  await model.EtapaStatus.insert(dt_periodo, 1, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Dados importado com sucesso.');
}


module.exports.XmlEntrada = async (filename, path, id_simul_etapa, id_empresa, id_usuario, dt_periodo, nm_procedure1, nm_procedure2) => {

  fs.readFile(path, "utf8", async (err, xml) => {
    if (err){
      /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
      await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message);
      throw new Error(err.message);
    }
    parseString(xml, async function (err, result) {
      if (err){
        /* id_simul_tp_status: 1 - SUCESSO / 2 - ERRO / 3 - PENDENCIA */
        await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), err.message);
        throw new Error(err.message);
      }

			const Empresa = (await model.CtrlEmpresa.select(id_empresa)).rows[0];

			if(Empresa.CNPJ_EMPRESA !== result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.CNPJ[0]){ //então entrada
				await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Nota fiscal informada não é uma nota fiscal de entrada.');
        throw new Error(err.message);
			}

      console.log(result.nfeProc?.$.versao)
      console.dir(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.cUF[0]);
      
      if (result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.cUF)
        console.log(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.cUF)
      
      if (result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.ver !== undefined)
        console.dir(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.ver)
  
      if (result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.ver)
        console.log(result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.ver)


      await model.Pessoa.insert({
        dt_inicial:'',
        cd_pessoa:'',
        nm_razao_social:'',
        ds_endereco:'',
        ds_bairro:'',
        id_ref_331_municipio:'',
        uf:'',
        id_ref_331_pais:'',
        nr_cep:'',
        nr_cnpj_cpf:'',
        nr_inscricao_estadual:'',
        dt_movimento:'',
        nr_numero:'',
        ds_complemento:'',
        nr_fone:'',
        dm_contribuinte:'',
        nr_id_estrangeiro:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      });

			await model.Unidade.insert({
				ds_unidade:'',
				ds_descricao:'',
				dt_inicial:'',
				dt_movimento:'',
				id_empresa: id_empresa,
				id_usuario: id_usuario
			})

      await model.Produto.insert({
        cd_produto_servico:'',
        cd_barra:'',
        ds_produto_servico:'',
        id_ref_331_ncm:'',
        id_ref_331_ex_ipi:'',
        dm_tipo_item:'',
        unidade:'',
        id_0190:'',
        dt_inicial:'',
        dt_movimento:'',
        id_cest:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      })

			// não será insert e sim update, pois a nota veio da importação texto
      // entrada

      await model.NotaFiscal.Entrada.Produto.insert({
				id_pessoa_remetente:'',
				id_modelo_documento:'',
				serie_subserie_documento:'',
				nr_documento:'',
				dm_tipo_fatura:'',
				dt_emissao_documento:'',
				dt_entrada:'',
				vl_total_nota_fiscal:'',
				vl_desconto:'',
				vl_icms_substituicao:'',
				vl_outras_despesas:'',
				vl_total_mercadoria:'',
				vl_frete:'',
				vl_seguro:'',
				vl_ipi:'',
				dm_modalidade_frete:'',
				id_ref_413:'',
				vl_icms_desonerado:'',
				nr_chave_nf_eletronica:'',
				vl_icms_fcp:'',
				vl_icms_uf_dest:'',
				vl_icms_uf_remet:'',
				nr_chave_nf_eletron_ref_cat83:'',
				vl_fcp_st:'',
				id_ref_331_munic_orig:'',
				id_ref_331_munic_dest:'',
				dm_tipo_cte:'',
				dm_finalidade:'',
				id_empresa: id_empresa,
				id_usuario: id_usuario
			})

      await model.NotaFiscal.Entrada.Produto.SfC110.insert({
        serie_subserie_documento:'',
        nr_documento:'',
        dt_emissao_documento:'',
        id_pessoa_remetente:'',
        nr_item_imp:'',
        id_ref_0450:'',
        ds_complementar:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario,
        id_modelo_documento:''
      })
      
      await model.NotaFiscal.Entrada.Produto.AcC060.insert({
        dm_importacao:'',
        nr_di:'',
        dt_registro:'',
        dt_desembaraco:'',
        vl_pis:'',
        vl_cofins:'',
        id_nota_fiscal_entrada:'',
        id_pessoa_remetente:'',
        dt_emissao_documento:'',
        nr_documento:'',
        nr_item:'',
        nr_sequencia:'',
        serie_subserie_documento:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario,
        id_modelo_documento:''
      })

      await model.NotaFiscal.Entrada.Produto.Item.insert({
        id_modelo_documento:'',
        serie_subserie_documento:'',
        nr_documento:'',
        dt_emissao_documento:'',
        id_pessoa_remetente:'',
        nr_sequencia:'',
        id_produto_servico:'',
        id_0190:'',
        vl_unitario:'',
        vl_total_item:'',
        vl_desconto_item:'',
        dm_movimentacao_fisica:'',
        cd_fiscal_operacao:'',
        nr_fci:'',
        id_ref_431:'',
        vl_base_calculo_icms:'',
        vl_icms:'',
        vl_base_calculo_icms_subst:'',
        aliq_icms_subst:'',
        vl_icms_substituicao:'',
        aliq_icms:'',
        vl_reducao_bc_icms:'',
        dm_tributacao_icms:'',
        id_ref_432:'',
        vl_base_calculo_ipi:'',
        vl_ipi:'',
        aliq_ipi:'',
        qtde:'',
        unidade:'',
        dm_tributacao_ipi:'',
        vl_outras_despesas:'',
        vl_frete:'',
        vl_seguro:'',
        nr_item:'',
        ds_complementar:'',
        dm_mot_desc_icms:'',
        vl_icms_desonerado:'',
        vl_bc_ii:'',
        vl_desp_adu:'',
        vl_ii:'',
        vl_iof:'',
        vl_bc_icms_uf_dest:'',
        perc_icms_fcp:'',
        aliq_icms_uf_dest:'',
        aliq_icms_interestadual:'',
        perc_icms_partilha:'',
        vl_icms_fcp:'',
        vl_icms_uf_dest:'',
        vl_icms_uf_remet:'',
        id_ref_453:'',
        vl_bc_fcp_op:'',
        aliq_fcp_op:'',
        vl_fcp_op:'',
        vl_bc_fcp_st:'',
        aliq_fcp_st:'',
        vl_fcp_st:'',
        vl_bc_icms_st_obs:'',
        vl_icms_st_obs:'',
        cd_classificacao_fiscal_merc:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      })


      await model.NotaFiscal.Entrada.Produto.Item.AcC050.insert({
        id_ref_433:'',
        aliq_pis:'',
        vl_bc_pis:'',
        vl_pis:'',
        vl_aliq_pis:'',
        vl_pis_st:'',
        qtde_bc_pis:'',
        id_ref_434:'',
        aliq_cofins:'',
        vl_bc_cofins:'',
        vl_cofins:'',
        vl_aliq_cofins:'',
        vl_cofins_st:'',
        qtde_bc_cofins:'',
        id_nota_fiscal_entrada:'',
        dt_emissao_documento:'',
        id_pessoa_remetente:'',
        nr_documento:'',
        nr_item:'',
        nr_sequencia:'',
        serie_suserie_documento:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario,
        id_modelo_documento:''
      })


      await model.SfC195.Entrada.insert({
        id_0460:'',
        ds_complementar:'',
        id_nota_fiscal_entrada:'',
        serie_subserie_documento:'',
        nr_documento:'',
        dt_emissao_documento:'',
        id_pessoa_remetente:'',
        nr_sequencia:'',
        nr_item:'',
        id_empresa: id_empresa,
        id_usuario: id_usuario,
        id_modelo_documento:''
      })

    })
  });
  
  //Oracle.execProcedure(nm_procedure1, id_empresa, id_usuario);
  //Oracle.execProcedure(nm_procedure2, id_empresa, id_usuario);
  
  await model.EtapaStatus.insert(dt_periodo, 1, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Dados importado com sucesso.');
}
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

			if(Empresa.CNPJ_EMPRESA !== result.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0]) { //então saida
				await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Nota fiscal informada não é uma nota fiscal de saída.');
        throw new Error(err.message);
			}

      console.log(result.nfeProc.$.versao)
      console.dir(result.nfeProc.NFe[0].infNFe[0].ide[0].cUF[0]);
      
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].cUF)
        console.log(result.nfeProc.NFe[0].infNFe[0].ide[0].cUF)
      
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].ver !== undefined)
        console.dir(result.nfeProc.NFe[0].infNFe[0].ide[0].ver)
  
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].ver)
        console.log(result.nfeProc.NFe[0].infNFe[0].ide[0].ver)


			
			var inParametro = (await Oracle.select(
				`SELECT DM_IMPORTAXML_DEPARA, /*para nfe entrada*/
								NVL(DM_APURACAO_DTEMISSAO, 'N') DM_APURACAO_DTEMISSAO, 
								NVL(DM_IMPXML_CNPJ_PROD, 'N') DM_IMPXML_CNPJ_PROD, 
								NVL(DM_PESQ_AC_0450, 'S') DM_PESQ_AC_0450
					FROM IN_PARAMETRO_EMPRESA 
					WHERE ID_EMPRESA = :ID_EMPRESA`, 
				{ID_EMPRESA: id_empresa}
			)).rows[0];

      //result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].UF[0]
			//result.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ ou result.nfeProc.NFe[0].infNFe[0].dest[0].CPF
			//result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].UF[0]? EX : 
      const dhEmi = utils.FormatarData.DateXmlToDateOracleString(utils.Validar.ifelse(result.nfeProc.NFe[0].infNFe[0].ide[0].dhEmi, result.nfeProc.NFe[0].infNFe[0].ide[0].dEmi)[0]);
      const dSaiEnt = inParametro.DM_APURACAO_DTEMISSAO === 'N' ? utils.FormatarData.DateXmlToDateOracleString(utils.Validar.ifelse(result.nfeProc.NFe[0].infNFe[0].ide[0].dhSaiEnt, result.nfeProc.NFe[0].infNFe[0].ide[0].dSaiEnt)[0]) : dhEmi;
      const cd_modelo_documento = utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].ide[0].mod, 0, "");
      const cpfOrCnpj = utils.Validar.ifelse(result.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ, result.nfeProc.NFe[0].infNFe[0].dest[0].CPF)[0];
      const Pais = (await model.Ac331.pais.select(result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].cPais[0])).rows[0];
      const Municipio = (await model.Ac331.municipio.select(result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].cMun[0])).rows[0];

      let cd_pessoa = '';

      if (result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].UF[0] == 'EX') {
        const PessoaMestre = (await model.Pessoa.Mestre.selectByRazaoSocial(result.nfeProc.NFe[0].infNFe[0].dest[0].xNome[0], id_empresa)).rows[0];
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

      if (result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].UF[0] == 'EX') {
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
        nm_razao_social: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].xNome, 0),
        ds_endereco: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].xLgr, 0),
        ds_bairro: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].xBairro, 0),
        id_ref_331_municipio: Municipio.ID_REF_331_MUNICIPIO,
        uf: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].UF, 0),
        id_ref_331_pais: Pais.ID_REF_331_PAIS,
        nr_cep: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].CEP, 0),
        nr_cnpj_cpf: cpfOrCnpj,
        nr_inscricao_estadual: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].IE, 0),
        dt_movimento: dhEmi,
        nr_numero: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].nro, 0),
        ds_complemento: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].xCpl, 0),
        nr_fone: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].Fone, 0),
        dm_contribuinte: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].indIEDest, 0),
        nr_id_estrangeiro: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].dest[0].IdEstrangeiro, 0),
        id_empresa: id_empresa,
        id_usuario: id_usuario
      });

      let dm_entrada_saida = utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].ide[0].tpNF, 0, "") == "1" ? "S" : "E"
      
      const PessoaDestinatario = (await model.Pessoa.Mestre.selectByCdPessoa(cd_pessoa, id_empresa)).rows[0];
      const ModeloDocumento = (await model.ModeloDocumento.selectByCdModeloDocumento(cd_modelo_documento)).rows[0].ID_MODELO_DOCUMENTO;
      const Ac413 = (await model.Ac413.selectByCodigo('00')).rows[0];
      const serie_subserie_documento = utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].ide[0].serie, 0)
      const nr_documento =  utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].ide[0].nNF, 0)
      
      let vl_outras_despesas = parseFloat(utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].det[0].ICMSTot[0].vOutro, 0, "0").replace('.',','))
      
      const Cfop = (await model.Cfop.selectByCdCfop(result.nfeProc.NFe[0].infNFe[0].total[0].prod[0].CFOP[0])).rows[0];
      if (['3', '7'].includes(result.nfeProc.NFe[0].infNFe[0].total[0].prod[0].CFOP[0][0])){
        if (Cfop.DM_ICMS_VL_CONTABIL === 'S'){
          vl_outras_despesas = vl_outras_despesas + 
            parseFloat(utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vOutro, 0).replace('.',','));
        }
        if (Cfop.DM_VLCONTABIL_PISCOFINS === 'S'){
          vl_outras_despesas = vl_outras_despesas + 
            parseFloat(utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vPIS, 0).replace('.',',')) +
            parseFloat(utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vCOFINS, 0).vCOFINS('.',','));
        }
        if (Cfop.DM_VLCONTABIL_II === 'S'){
          vl_outras_despesas = vl_outras_despesas + 
            parseFloat(utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vII, 0).vCOFINS('.',','));
        }
      }

      //C100
      await model.NotaFiscal.Saida.Produto.insert({
        dm_entrada_saida: dm_entrada_saida,
        id_pessoa_destinatario: PessoaDestinatario.ID_PESSOA,
        id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
        serie_subserie_documento: serie_subserie_documento,
        nr_documento: nr_documento,
        dm_tipo_fatura: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].ide[0].indPag, 0, "0"),
        dt_emissao_documento: dhEmi,
        dt_entrada_saida: dSaiEnt,
        vl_total_nota_fiscal: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vNF, 0).replace('.',','),
        vl_desconto: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vDesc, 0, "0").replace('.',','),
        vl_icms_substituicao: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vST, 0, "0").replace('.',','),
        vl_outras_despesas: vl_outras_despesas,
        vl_total_mercadoria: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vProd, 0, "0").replace('.',','),
        vl_frete: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vFrete, 0, "0").replace('.',','),
        vl_ipi: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vIPI, 0, "0").replace('.',','),
        vl_seguro: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vSeg, 0, "0").replace('.',','),
        dm_modalidade_frete: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].transp[0].modFrete, 0, "0").replace('.',','),
        id_ref_413: Ac413.ID_REF_413,
        vl_icms_desonerado: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vICMSDeson, 0, "0").replace('.',','),
        dm_cancelamento: 'N',
        dm_gare: 'N',
        dm_gnre: 'N',
        nr_chave_nf_eletronica: result.nfeProc.NFe[0].infNFe[0].$.Id.toUpperCase().replace('NFE'),
        id_pessoa_remetente_cte: '', //VAZIO
        vl_icms_fcp: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vFCPUFDest, 0, "0").replace('.',','),
        vl_icms_uf_dest: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vICMSUFDest, 0, "0").replace('.',','),
        vl_icms_uf_remet: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vICMSUFRemet, 0, "0").replace('.',','),
        nr_chave_nf_eletron_ref_cat83: result.nfeProc.NFe[0].infNFe[0].ide[0].NFref === undefined ? "" : utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].ide[0].NFref[0].refNFe, 0, "0").replace('.',','),
        vl_fcp_st: utils.Validar.getValueArray(result.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vFCPST, 0, "0").replace('.',','),
        id_ref_331_munic_orig: '',
        id_ref_331_munic_dest: '',
        dm_tipo_cte: '',
        dm_finalidade: '',
        id_empresa: id_empresa,
        id_usuario: id_usuario
      });

      if (result.nfeProc.NFe[0].infNFe[0].ide[0].infAdic !== undefined){

        if (result.nfeProc.NFe[0].infNFe[0].ide[0].infAdic[0].infCpl !== undefined){
          let ac0450 = (await model.Ac0450.select(
            result.nfeProc.NFe[0].infNFe[0].ide[0].infAdic[0].infCpl[0],
            id_empresa,
            dhEmi
          )).rows[0];

          var id_ref_0450
          if (ac0450 == undefined){
            id_ref_0450 = (await model.Ac0450.insert(
              result.nfeProc.NFe[0].infNFe[0].ide[0].infAdic[0].infCpl[0],
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
            ds_complementar: result.nfeProc.NFe[0].infNFe[0].ide[0].infAdic[0].infCpl[0].substring(1,3980),
            id_empresa: id_empresa,
            id_usuario: id_usuario
          })
        }

        if (result.nfeProc.NFe[0].infNFe[0].ide[0].infAdic[0].infAdFisco !== undefined){
          var ac0450 = (await model.Ac0450.select(
            result.nfeProc.NFe[0].infNFe[0].ide[0].infAdic[0].infAdFisco[0],
            id_empresa,
            dhEmi
          )).rows[0];

          let id_ref_0450
          if (ac0450 == undefined){
            id_ref_0450 = (await model.Ac0450.insert(
              result.nfeProc.NFe[0].infNFe[0].ide[0].infAdic[0].infAdFisco[0],
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
            ds_complementar: result.nfeProc.NFe[0].infNFe[0].ide[0].infAdic[0].infAdFisco[0],
            id_empresa: id_empresa,
            id_usuario: id_usuario
          })
        }
      }

      for (let i = 0; i < result.nfeProc.NFe[0].infNFe[0].det.length; i++) {
        const det = result.nfeProc.NFe[0].infNFe[0].det[i];
        const prod = await model.Produto.Mestre.selectByCodigo(det.prod[0].cProd[0], id_empresa);
        let id_produto_servico;

        if (prod.rows.length === 0){

        }

        if (inParametro.DM_APURACAO_DTEMISSAO === 'S'){

        }

        let ds_unidade = utils.Validar.getValueArray(det.prod[0].uCom, 0, "XX");


        let unidade = await model.Sf0190.selectByDsUnidade(ds_unidade, id_empresa, dhEmi).rows[0];

        if (unidade.length === 0){
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
          ds_unidade = unidade[0].DS_UNIDADE;
        }

        let cd_produto_servico = utils.FormatarString.removeCaracteresEspeciais(det.prod[0].cProd[0])
        let produto = (await model.Produto.Item.selectByCodigo(cd_produto_servico, id_empresa, dhEmi)).rows[0];
        
        await model.Produto.insert({
          cd_produto_servico: cd_produto_servico,
          cd_barra: det.prod[0].cEANTrib[0],
          ds_produto_servico: det.prod[0].xProd[0],
          id_ref_331_ncm: det.prod[0].NCM[0],
          id_ref_331_ex_ipi: det.prod[0].EXTIPI[0],
          dm_tipo_item: produto.length === 0 ? '99' : produto.DM_TIPO_ITEM,
          unidade: ds_unidade,
          id_0190: ds_unidade,
          dt_inicial: dhEmi,
          dt_movimento: dhEmi,
          id_cest: utils.Validar.getValueArray(det.prod[0].CEST, 0, ""),
          id_empresa: id_empresa,
          id_usuario: id_usuario
        })

        await model.Produto.sp_gera_produto_mestre_item();

        await model.Produto.Item.selectByCodigo(cd_produto_servico, id_empresa, dhEmi);

        //C170
        await model.NotaFiscal.Saida.Produto.Item.insert({
          dm_entrada_saida: dm_entrada_saida,
          id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
          serie_subserie_documento: serie_subserie_documento,
          nr_documento: nr_documento,
          dt_emissao_documento: dhEmi,
          nr_sequencia: det.$.nItem,
          id_produto_servico: id_produto_servico,
          id_0190: ds_unidade,
          vl_unitario: utils.Validar.getValueArray(det.prod[0].vUnCom, 0, "0").replace('.',','),
          vl_total_item: utils.Validar.getValueArray(det.prod[0].vProd, 0, "0").replace('.',','),
          vl_desconto_item: utils.Validar.getValueArray(det.prod[0].vDesc, 0, "0").replace('.',','),
          dm_movimentacao_fisica: 'S',
          cd_fiscal_operacao: det.prod[0].CFOP[0],
          nr_fci:'',
          id_ref_431:'',
          vl_base_calculo_icms:'',
          vl_icms:'',
          vl_base_calculo_icms_subst:'',
          aliq_icms_subs:'',
          vl_icms_substituicao:'',
          aliq_icms:'',
          vl_reducao_bc_icms:'',
          vl_perc_red_icms:'',
          vl_perc_red_icms_st:'',
          dm_mod_bc_icms:'',
          dm_mod_bc_icms_st:'',
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
          qtde_tributada:'',
          id_empresa: id_empresa,
          id_usuario: id_usuario
        })

        await model.NotaFiscal.Saida.Produto.Item.AcC050.insert({
          dm_entrada_saida:'',
          id_modelo_documento:'',
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
          dt_emissao_documento:'',
          nr_documento:'',
          nr_item:'',
          nr_sequencia:'',
          serie_subserie_documento:'',
          id_empresa: id_empresa,
          id_usuario: id_usuario
        })

        await model.NotaFiscal.Saida.Produto.SfC195.insert({
          dm_entrada_saida:'',
          id_0460:'',
          ds_complementar:'',
          id_nota_fiscal_saida:'',
          nr_item:'',
          id_modelo_documento:'',
          serie_subserie_documento:'',
          nr_documento:'',
          dt_emissao_documento:'',
          nr_sequencia:'',
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

			if(Empresa.CNPJ_EMPRESA !== result.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ[0]){ //então entrada
				await model.EtapaStatus.insert(dt_periodo, 2, parseInt(id_simul_etapa), parseInt(id_empresa), parseInt(id_usuario), 'Nota fiscal informada não é uma nota fiscal de entrada.');
        throw new Error(err.message);
			}

      console.log(result.nfeProc.$.versao)
      console.dir(result.nfeProc.NFe[0].infNFe[0].ide[0].cUF[0]);
      
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].cUF)
        console.log(result.nfeProc.NFe[0].infNFe[0].ide[0].cUF)
      
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].ver !== undefined)
        console.dir(result.nfeProc.NFe[0].infNFe[0].ide[0].ver)
  
      if (result.nfeProc.NFe[0].infNFe[0].ide[0].ver)
        console.log(result.nfeProc.NFe[0].infNFe[0].ide[0].ver)



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
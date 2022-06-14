const Oracle = require('./Oracle');
const model = require('./model');
const utils = require('../utils');


//deletar se existe o registro e importar novamnete;
//tomar atenção para este procedimento em outras importação se isso será necessário
//importar o cupom fiscal c800 e c850
//criar verificação que aceita somente modelo 55 e cupom fiscal (procurar seu modelo)
/**
 * 
 * @param {any} xmlObj
 * @param {number} id_simul_etapa 
 * @param {number} id_empresa 
 * @param {number} id_usuario 
 * @param {String} dt_periodo
 */
module.exports.Nfe = async (xmlObj, id_simul_etapa, id_empresa, id_usuario, dt_periodo) => {

  //#region Configurações iniciais
  const dhEmi = utils.FormatarData.DateXmlToDateOracleString(utils.Validar.ifelse(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dhEmi, xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dEmi)[0]);
  const dSaiEnt = utils.FormatarData.DateXmlToDateOracleString(utils.Validar.ifelse(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dhSaiEnt, xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dSaiEnt)[0]);
  const cpfOrCnpj = utils.Validar.ifelse(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.CNPJ, xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.CPF)[0];
  //#endregion

  //#region Empresa
  const Empresa = await new model.CtrlEmpresa().select(id_empresa)
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    throw new Error('Falha na busca pela empresa cadastrada. Erro: ' + err.message);
  });

  if(Empresa.CNPJ_EMPRESA !== xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.CNPJ[0]) { //então entrada
    throw new Error('Nota fiscal informada não é uma nota fiscal de entrada.');
  } else if(Empresa.CNPJ_EMPRESA !== cpfOrCnpj) {
    throw new Error('Nota fiscal informada não pertence a empresa cadastrada.');
  }

  var inParametro = await Oracle.select(
    `SELECT DM_IMPORTAXML_DEPARA, /*para nfe entrada*/
            NVL(DM_APURACAO_DTEMISSAO, 'N') DM_APURACAO_DTEMISSAO, 
            NVL(DM_IMPXML_CNPJ_PROD, 'N') DM_IMPXML_CNPJ_PROD, 
            NVL(DM_PESQ_AC_0450, 'S') DM_PESQ_AC_0450
      FROM IN_PARAMETRO_EMPRESA 
      WHERE ID_EMPRESA = :ID_EMPRESA`, 
    {ID_EMPRESA: id_empresa}
  )
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    throw new Error('Falha na busca pelo o parametro empresa cadastrada. Erro: ' + err.message);
  });
  //#endregion Empresa  

  //#region Pais
  const Pais = await new model.Ac331.Pais().select(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.enderEmit[0]?.cPais[0])
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    throw new Error('Falha na busca pelo o país cadastrado. Erro: ' + err.message);
  });
  //#endregion Pais

  //#region Municipio
  const Municipio = await new model.Ac331.Municipio().select(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.enderEmit[0]?.cMun[0])
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    throw new Error('Falha na busca pelo o municipio cadastrado. Erro: ' + err.message);
  });
  //#endregion Municipio

  //#region Pessoa
  let cd_pessoa = '';
  let PessoaMestre

  PessoaMestre = await new model.Pessoa().Mestre.selectByCpfOrCpnj(cpfOrCnpj,dhEmi,id_empresa)
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    throw new Error('Falha na busca pela a pessoa cadastrada pelo CNPJ ou CPF. Erro: ' + err.message);
  });

  if (PessoaMestre !== undefined) {
    cd_pessoa = PessoaMestre.CD_PESSOA;
  } else {
    cd_pessoa = cpfOrCnpj;
  }
  
  if (PessoaMestre === undefined) {
    //0150
    await new model.Pessoa().insert({
      dt_inicial: utils.FormatarData.RetornarMenorDataEmOracle(dhEmi, dt_periodo),
      cd_pessoa: cd_pessoa,
      nm_razao_social: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.xNome, 0),
      ds_endereco: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.enderEmit[0]?.xLgr, 0),
      ds_bairro: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.enderEmit[0]?.xBairro, 0),
      id_ref_331_municipio: Municipio.ID_REF_331_MUNICIPIO,
      uf: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.enderEmit[0]?.UF, 0),
      id_ref_331_pais: Pais.ID_REF_331_PAIS,
      nr_cep: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.enderEmit[0]?.CEP, 0),
      nr_cnpj_cpf: cpfOrCnpj,
      nr_inscricao_estadual: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.IE, 0),
      dt_movimento: dhEmi,
      nr_numero: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.enderEmit[0]?.nro, 0),
      ds_complemento: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.enderEmit[0]?.xCpl, 0),
      nr_fone: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.enderEmit[0]?.Fone, 0),
      dm_contribuinte: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.indIEDest, 0, "1"),
      nr_id_estrangeiro: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.IdEstrangeiro, 0, ""),
      id_empresa: id_empresa,
      id_usuario: id_usuario
    }).then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error('Falha ao inserir a pessoa no cadastrado. Erro: ' + err.message);
    });
  }

  await new model.Pessoa().sp_gera_pessoa_mestre_item()
  .catch(async (err) => {
    throw new Error('Falha na geração Mestre Item da Pessoa. Erro: ' + err.message);
  });
  //#endregion Pessoa

  //#region Pessoa Emitente
  const PessoaEmitente = await new model.Pessoa().Mestre.selectByCdPessoa(cd_pessoa, id_empresa)
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    throw new Error('Falha na busca pela a pessoa cadastrada pelo código. Erro: ' + err.message);
  });
  //#endregion Pessoa Emitente

  //#region ModeloDocumento
  const ModeloDocumento = await new model.ModeloDocumento().selectByCdModeloDocumento(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.mod, 0, ""))
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    throw new Error('Falha na busca pelo o model documento cadastrado. Erro: ' + err.message);
  });
  //#endregion ModeloDocumento

  //#region Ac413
  const Ac413 = await new model.Ac413().selectByCodigo('00')
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    throw new Error('Falha na busca pelo o Ac433 cadastrado. Erro: ' + err.message);
  });
  //#endregion Ac413

  //#region CFOP
  const Cfop = await new model.Cfop().selectByCdCfop(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.det[0]?.prod[0]?.CFOP[0])
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    throw new Error('Falha na busca pelo o CFOP cadastrado. Erro: ' + err.message);
  });
  //#endregion CFOP
  
  let vl_outras_despesas = parseFloat(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0].ICMSTot[0]?.vOutro, 0, "0").replace('.',','))

  if (['3', '7'].includes(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.det[0]?.prod[0]?.CFOP[0][0])) {
    if (Cfop.DM_ICMS_VL_CONTABIL === 'S') {
      vl_outras_despesas = vl_outras_despesas + 
        parseFloat(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMS, 0).replace('.',','));
    }
    if (Cfop.DM_VLCONTABIL_PISCOFINS === 'S') {
      vl_outras_despesas = vl_outras_despesas + 
        parseFloat(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vPIS, 0).replace('.',',')) +
        parseFloat(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vCOFINS, 0).vCOFINS('.',','));
    }
    if (Cfop.DM_VLCONTABIL_II === 'S') {
      vl_outras_despesas = vl_outras_despesas + 
        parseFloat(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vII, 0).vCOFINS('.',','));
    }
  }

  if (utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vIPIDevol, 0, "X") !== "X"){
    vl_outras_despesas = vl_outras_despesas + 
    parseFloat(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vIPIDevol, 0).vCOFINS('.',','));
  }

  //#region C100
  const chaveC100 = {
    /**
     * @param {Number} id_pessoa_remetente
     */
    id_pessoa_remetente: PessoaEmitente.ID_PESSOA,
    /**
     * @param {String} nr_documento
     */
    nr_documento: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.nNF, 0, ""),
    /**
     * @param {String} serie_subserie_documento
     */
    serie_subserie_documento: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.serie, 0, ""),
    /**
     * @param {String} dt_emissao_documento
     */
    dt_emissao_documento: dhEmi,
    /**
     * @param {Number} id_empresa
     */
    id_empresa: id_empresa
  };

  await new model.NotaFiscal.Entrada().SfC110.delete({
    ...chaveC100,
  });
  /*await new model.NotaFiscal.Saida().Item.delete({
    ...chaveC100,
  })
  await new model.NotaFiscal.Saida().Item.AcC050.delete({
    ...chaveC100,
  })
  await new model.NotaFiscal.Saida().SfC195.delete({
    ...chaveC100,
  })
  await new model.NotaFiscal.Saida().delete({
    ...chaveC100,
  })
  tem um outro registro tbm verificar nas classes nf e nfi
  */

  //C100
  await new model.NotaFiscal.Entrada().insert({
    ...chaveC100,
    id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
    dm_tipo_fatura: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.indPag, 0, "0"),
    dt_emissao_documento: dhEmi,
    dt_entrada: dSaiEnt,
    vl_total_nota_fiscal: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vNF, 0).replace('.',','),
    vl_desconto: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vDesc, 0, "0").replace('.',','),
    vl_icms_substituicao: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vST, 0, "0").replace('.',','),
    vl_outras_despesas: vl_outras_despesas,
    vl_total_mercadoria: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vProd, 0, "0").replace('.',','),
    vl_frete: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vFrete, 0, "0").replace('.',','),
    vl_ipi: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vIPI, 0, "0").replace('.',','),
    vl_seguro: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vSeg, 0, "0").replace('.',','),
    dm_modalidade_frete: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.transp[0].modFrete, 0, "0").replace('.',','),
    id_ref_413: Ac413.ID_REF_413,
    vl_icms_desonerado: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMSDeson, 0, "0").replace('.',','),
    nr_chave_nf_eletronica: xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.$.Id.toUpperCase().replace('NFE'),
    vl_icms_fcp: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vFCPUFDest, 0, "0").replace('.',','),
    vl_icms_uf_dest: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMSUFDest, 0, "0").replace('.',','),
    vl_icms_uf_remet: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMSUFRemet, 0, "0").replace('.',','),
    nr_chave_nf_eletron_ref_cat83: xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.NFref === undefined ? "" : utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.NFref[0].refNFe, 0, "0").replace('.',','),
    vl_fcp_st: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vFCPST, 0, "0").replace('.',','),
    id_ref_331_munic_orig: NaN,
    id_ref_331_munic_dest: NaN,
    dm_tipo_cte: '',
    dm_finalidade: '',
    id_usuario: id_usuario
  })
  .then((data) => {
    return data;
  })
  .catch((err) => {
    throw new Error('Falha ao inserir a nota fiscal de saida no cadastrado. Erro: ' + err.message);
  });
  //#endregion C100

  //#region C110
  if (xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic !== undefined) {

    if (xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infCpl !== undefined) {
      let ac0450 = await new model.Ac0450().select(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infCpl[0], id_empresa, dhEmi)
      .then((data) => {
        return data.rows[0]
      })
      .catch((err) => {
        throw new Error('Falha na busca pelo o Ac0450 cadastrado. Erro: ' + err.message);
      });

      var id_ref_0450
      if (ac0450 == undefined) {
        id_ref_0450 = await new model.Ac0450().insert(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infCpl[0], id_empresa, dhEmi)
        .then((data) => {
          return data;
        })
        .catch((err) => {
          throw new Error('Falha ao inserir o Ac0450 no cadastrado. Erro: ' + err.message);
        });

      } else {
        id_ref_0450 = ac0450.ID_REF_0450
      }
      //C110
      const SfC110Saida = {
        chaveC100Saida: chaveC100,
        camposC110Saida: {
          id_modelo_documento: parseInt(ModeloDocumento.ID_MODELO_DOCUMENTO),
          nr_item_imp: "1",
          id_ref_0450: parseInt(id_ref_0450),
          ds_complementar: xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infCpl[0].substring(1,3980),
          id_usuario: id_usuario
        }
      }
      await new model.NotaFiscal.Saida().SfC110.insert(SfC110Saida).then((data) => {
        return data;
      })
      .catch((err) => {
        throw new Error('Falha ao inserir o C110 no cadastrado. Erro: ' + err.message);
      });
    }

    if (xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco !== undefined) {
      var ac0450 = await new model.Ac0450().select(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco[0], id_empresa, dhEmi)
      .then((data) => {
        return data.rows[0]
      })
      .catch((err) => {
        throw new Error('Falha na busca pelo Ac0450 cadastrado. Erro: ' + err.message);
      });

      let id_ref_0450
      if (ac0450 == undefined) {
        id_ref_0450 = await new model.Ac0450().insert(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco[0], id_empresa, dhEmi)
        .then((data) => {
          return data;
        })
        .catch((err) => {
          throw new Error('Falha ao inserir o Ac0450 no cadastrado. Erro: ' + err.message);
        });
        
      } else {
        id_ref_0450 = ac0450.ID_REF_0450
      }
      //C110
      await new model.NotaFiscal.Saida().SfC110.insert({
        chaveC100Saida: chaveC100,
        camposC110Saida : {
          id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
          nr_item_imp: "1",
          id_ref_0450: id_ref_0450,
          ds_complementar: xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco[0],
          id_usuario: id_usuario
        }
      }).then((data) => {
        return data;
      })
      .catch((err) => {
        throw new Error('Falha ao inserir o C110 no cadastrado. Erro: ' + err.message);
      });
    }
  }
  //#endregion C110


  /*
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
*/

}

/**
 * 
 * @param {any} xmlObj
 * @param {number} id_simul_etapa 
 * @param {number} id_empresa 
 * @param {number} id_usuario 
 * @param {String} dt_periodo 
 */
module.exports.Cfe = async (xmlObj, id_simul_etapa, id_empresa, id_usuario, dt_periodo) => {
}
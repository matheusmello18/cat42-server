const Oracle = require('./Oracle');
const model = require('./model');
const utils = require('../utils');

//deletar se existe o registro e importar novamnete;
//tomar atenção para este procedimento em outras importação se isso será necessário

//importar o cupom fiscal c800 e c850 - feito
//criar verificação que aceita somente modelo 55 e cupom fiscal (procurar seu modelo) - feito
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
  const cpfOrCnpj = utils.Validar.ifelse(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.CNPJ, xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.CPF)[0];
  const dm_entrada_saida = utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.tpNF, 0, "") == "1" ? "S" : "E"
  //#endregion

  //#region Empresa
  const Empresa = await new model.CtrlEmpresa().select(id_empresa)
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    err.message = 'Falha na busca pela empresa cadastrada. '
    throw err;
  });

  if(Empresa.CNPJ_EMPRESA === xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0].CNPJ[0].trim()) { //senão saida
    throw new Error('Nota fiscal informada não é uma nota fiscal de saída.');
  } else if(Empresa.CNPJ_EMPRESA !== xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]?.CNPJ[0].trim()) {
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
    err.message = 'Falha na busca pelo o parametro empresa cadastrada. '
    throw err;
  });
  //#endregion Empresa
  
  let dSaiEnt;
  if (utils.Validar.ifelse(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dhSaiEnt, xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dSaiEnt) !== "")
    dSaiEnt = utils.FormatarData.DateXmlToDateOracleString(utils.Validar.ifelse(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dhSaiEnt, xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.dSaiEnt)[0]);
  else
    dSaiEnt = dhEmi;

  //#region Pais
  let Pais
  if (xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.cPais !== undefined){
    Pais = await new model.Ac331.Pais().select(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.cPais[0])
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o país cadastrado. '
      
      throw err;
    });
  }
  //#endregion Pais

  //#region Municipio
  const Municipio = await new model.Ac331.Municipio().select(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.cMun[0])
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    err.message = 'Falha na busca pelo o municipio cadastrado. '
    throw err;
  });
  //#endregion Municipio

  //#region Pessoa
  let cd_pessoa = '';
  let PessoaMestre

  if (xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.UF[0] == 'EX') {

    PessoaMestre = await new model.Pessoa().Mestre.selectByRazaoSocial(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.xNome[0], id_empresa)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pela a pessoa cadastrada. '
      throw err;
    });

    if (PessoaMestre !== undefined) {
      cd_pessoa = PessoaMestre.CD_PESSOA;
    } else {
      cd_pessoa = xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.IdEstrangeiro[0] + '-EX';
    }
  } else {   

    PessoaMestre = await new model.Pessoa().Mestre.selectByCpfOrCpnj(cpfOrCnpj,dhEmi,id_empresa)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pela a pessoa cadastrada pelo CNPJ ou CPF. '
      throw err;
    });

    if (PessoaMestre !== undefined) {
      cd_pessoa = PessoaMestre.CD_PESSOA;
    } else {
      cd_pessoa = cpfOrCnpj;
    }
  }

  if (PessoaMestre === undefined) {
    //0150
    await new model.Pessoa().insert({
      dt_inicial: utils.FormatarData.RetornarMenorDataEmOracle(dhEmi, dt_periodo),
      cd_pessoa: cd_pessoa,
      nm_razao_social: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.xNome, 0),
      ds_endereco: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.xLgr, 0),
      ds_bairro: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.xBairro, 0),
      id_ref_331_municipio: Municipio.ID_REF_331_MUNICIPIO,
      uf: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.UF, 0),
      id_ref_331_pais: Pais !== undefined ? Pais.ID_REF_331_PAIS : '',
      nr_cep: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.CEP, 0),
      nr_cnpj_cpf: cpfOrCnpj,
      nr_inscricao_estadual: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.IE, 0),
      dt_movimento: dhEmi,
      nr_numero: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.nro, 0),
      ds_complemento: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.xCpl, 0),
      nr_fone: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.enderDest[0]?.Fone, 0),
      dm_contribuinte: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.indIEDest, 0, "1"),
      nr_id_estrangeiro: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.dest[0]?.IdEstrangeiro, 0, ""),
      id_empresa: id_empresa,
      id_usuario: id_usuario
    }).then((data) => {
      return data;
    })
    .catch((err) => {
      err.message = 'Falha ao inserir a pessoa no cadastrado. '
      throw err;
    });
  }


  await new model.Pessoa().sp_gera_pessoa_mestre_item()
  .catch(async (err) => {
    err.message = 'Falha na geração Mestre Item da Pessoa. '
    throw err;
  });
  //#endregion Pessoa
  
  //#region Pessoa Destinatario
  const PessoaDestinatario = await new model.Pessoa().Mestre.selectByCdPessoa(cd_pessoa, id_empresa)
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    err.message = 'Falha na busca pela a pessoa cadastrada pelo código. '
    throw err;
  });
  //#endregion Pessoa Destinatario

  //#region ModeloDocumento
  const ModeloDocumento = await new model.ModeloDocumento().selectByCdModeloDocumento(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.mod, 0, ""))
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    err.message = 'Falha na busca pelo o model documento cadastrado. ';
    throw err
  });
  //#endregion ModeloDocumento

  //#region Ac413
  const Ac413 = await new model.Ac413().selectByCodigo('00')
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    err.message = 'Falha na busca pelo o Ac433 cadastrado. ';
    throw err
  });
  //#endregion Ac413
  
  //#region CFOP
  const Cfop = await new model.Cfop().selectByCdCfop(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.det[0]?.prod[0]?.CFOP[0])
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    err.message = 'Falha na busca pelo o CFOP cadastrado. ';
    throw err
  });
  //#endregion CFOP


  //#region C100
  const chaveC100 = {
    /**
     * @param {String} dm_entrada_saida
     */
    dm_entrada_saida: dm_entrada_saida,
    /**
     * @param {Number} nr_documento
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
  
  await new model.NotaFiscal.Saida().Item.AcC050.delete(chaveC100)
  .then((data) => {
    return data;
  })
  .catch((err) => {
    err.message = 'Falha ao deletar o registro AcC050 Saída. ';
    throw err;
  })

  await new model.NotaFiscal.Saida().Item.delete(chaveC100)
  .then((data) => {
    return data;
  })
  .catch((err) => {
    err.message = 'Falha ao deletar o registro item da nota fiscal de saída. ';
    throw err
  })

  await new model.NotaFiscal.Saida().SfC110.delete(chaveC100)
  .then((data) => {
    return data;
  })
  .catch((err) => {
    err.message = 'Falha ao deletar o registro C110 Saída. ';
    throw err
  })

  await new model.NotaFiscal.Saida().AcC700.delete(chaveC100)
  .then((data) => {
    return data;
  })
  .catch((err) => {
    err.message = 'Falha ao deletar o registro C700 Saída. ';
    throw err
  })

  await new model.NotaFiscal.Saida().SfC195.delete(chaveC100)
  .then((data) => {
    return data;
  })
  .catch((err) => {
    err.message = 'Falha ao deletar o registro C195 Saída. ';
    throw err
  })

  await new model.NotaFiscal.Saida().delete(chaveC100)
  .then((data) => {
    return data;
  })
  .catch((err) => {
    err.message = 'Falha ao deletar o registro da nota fiscal saída. '
    throw err
  })

  //C100
  await new model.NotaFiscal.Saida().insert({
    ...chaveC100,
    id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
    dt_entrada_saida: dSaiEnt,
    id_pessoa_destinatario: PessoaDestinatario.ID_PESSOA,
    dm_tipo_fatura: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.indPag, 0, "0"),
    vl_total_nota_fiscal: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vNF, 0).replace(',','.'),
    vl_desconto: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vDesc, 0, "0").replace(',','.'),
    vl_icms_substituicao: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vST, 0, "0").replace(',','.'),
    vl_outras_despesas: parseFloat(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0].ICMSTot[0]?.vOutro, 0, "0").replace(',','.')),
    vl_total_mercadoria: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vProd, 0, "0").replace(',','.'),
    vl_frete: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vFrete, 0, "0").replace(',','.'),
    vl_ipi: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vIPI, 0, "0").replace(',','.'),
    vl_seguro: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vSeg, 0, "0").replace(',','.'),
    dm_modalidade_frete: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.transp[0].modFrete, 0, "0").replace(',','.'),
    id_ref_413: Ac413.ID_REF_413,
    vl_icms_desonerado: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMSDeson, 0, "0").replace(',','.'),
    dm_cancelamento: 'N',
    dm_gare: 'N',
    dm_gnre: 'N',
    nr_chave_nf_eletronica: xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.$.Id.toUpperCase().replace('NFE',''),
    id_pessoa_remetente_cte: null, //VAZIO
    vl_icms_fcp: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vFCPUFDest, 0, "0").replace(',','.'),
    vl_icms_uf_dest: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMSUFDest, 0, "0").replace(',','.'),
    vl_icms_uf_remet: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vICMSUFRemet, 0, "0").replace(',','.'),
    nr_chave_nf_eletron_ref_cat83: xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.NFref === undefined ? "" : utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.NFref[0].refNFe, 0, "0").replace(',','.'),
    vl_fcp_st: utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0]?.vFCPST, 0, "0").replace(',','.'),
    id_ref_331_munic_orig: null,
    id_ref_331_munic_dest: null,
    dm_tipo_cte: '',
    dm_finalidade: '',
    id_usuario: id_usuario
  })
  .then((data) => {
    return data;
  })
  .catch((err) => {
    err.message = 'Falha ao inserir a nota fiscal de saida no cadastrado. '
    throw err
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
        err.message = 'Falha na busca pelo o Ac0450 cadastrado. '
        throw err
      });

      var id_ref_0450
      if (ac0450 == undefined) {
        id_ref_0450 = await new model.Ac0450().insert(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infCpl[0], id_empresa, dhEmi)
        .then((data) => {
          return data;
        })
        .catch((err) => {
          err.message = 'Falha ao inserir o Ac0450 no cadastrado. '
          throw err
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
        err.message = 'Falha ao inserir o C110 no cadastrado. '
        throw err
      });
    }

    if (xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco !== undefined) {
      var ac0450 = await new model.Ac0450().select(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco[0], id_empresa, dhEmi)
      .then((data) => {
        return data.rows[0]
      })
      .catch((err) => {
        err.message = 'Falha na busca pelo Ac0450 cadastrado. '
        throw err
      });

      let id_ref_0450
      if (ac0450 == undefined) {
        id_ref_0450 = await new model.Ac0450().insert(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.ide[0]?.infAdic[0]?.infAdFisco[0], id_empresa, dhEmi)
        .then((data) => {
          return data;
        })
        .catch((err) => {
          err.message = 'Falha ao inserir o Ac0450 no cadastrado. '
          throw err
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
        err.message = 'Falha ao inserir o C110 no cadastrado. '
        throw err
      });
    }
  }
  //#endregion C110

  for (let i = 0; i < xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.det.length; i++) {

    const det = xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.det[i];

    const chaveC170 = {
      ...chaveC100,
      id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
      nr_sequencia: parseInt(det.$.nItem), //sItem_Seq
      nr_item: parseInt(det.$.nItem),
    };
    
    //#region 0190
    let ds_unidade = utils.Validar.getValueArray(det.prod[0]?.uCom, 0, "XX");
    let Unidade = await new model.Sf0190().selectByDsUnidade(ds_unidade, id_empresa, dhEmi)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pela a unidade cadastrada. '
      throw err
    });

    if (Unidade === undefined) {
      //0190
      await new model.Sf0190().insert({
        ds_unidade: ds_unidade,
        ds_descricao: ds_unidade,
        dt_inicial: dhEmi,
        dt_movimento: dhEmi,
        id_empresa: id_empresa,
        id_usuario: id_usuario
      });

      Unidade = await new model.Sf0190().selectByDsUnidade(ds_unidade, id_empresa, dhEmi)
      .then((data) => {
        return data.rows[0]
      })
      .catch((err) => {
        err.message = 'Falha na busca pela a unidade cadastrada. '
        throw err
      });
    } else {
      ds_unidade = Unidade.DS_UNIDADE;
    }
    //#endregion 0190

    //#region 0200
    let cd_produto_servico = utils.FormatarString.removeCaracteresEspeciais(det.prod[0]?.cProd[0])
    let produto = await new model.Produto().Mestre.Item.selectByCodigo(cd_produto_servico, id_empresa, dhEmi)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o produto cadastrada. '
      throw err
    });
    
    if(produto == undefined){

      var NCM = await new model.Ac331.Ncm().select(
        det.prod[0]?.NCM[0],
        dhEmi
      ).then((data) => {
        return data.rows[0]
      }).catch((err) => {
        err.message = "Falha na busca pelo NCM. "
        throw err
      })

      var ExIpi
      if (NCM !== undefined) {
        if (det.prod[0]?.EXTIPI !== undefined) {
          ExIpi = await new model.Ac331.ExIPI().select(
            det.prod[0]?.EXTIPI[0],
            NCM.ID_REF_331_NCM
          ).then((data) => {
            return data.rows[0]
          }).catch((err) => {
            err.message = "Falha na busca pelo ExIpi. "
            throw err
          })
        }
      }

      var CEST = await new model.SfCest().selectByCodigo(
        utils.Validar.getValueArray(det.prod[0]?.CEST, 0, ""),
        dhEmi
      ).then((data) => {
        return data.rows[0];
      }).catch((err) => {
        err.message = 'Falha na busca pelo Cest. '
        throw err
      })

      await new model.Produto().insert({
        cd_produto_servico: cd_produto_servico,
        cd_barra: det.prod[0]?.cEANTrib[0],
        ds_produto_servico: det.prod[0]?.xProd[0],
        id_ref_331_ncm: NCM === undefined ? null : NCM.ID_REF_331_NCM,
        id_ref_331_ex_ipi: ExIpi === undefined ? null : ExIpi.ID_REF_331_EX_IPI,
        dm_tipo_item: produto === undefined ? '99' : produto.DM_TIPO_ITEM,
        unidade: ds_unidade,
        id_0190: Unidade.ID_0190,
        dt_inicial: dhEmi,
        dt_movimento: dhEmi,
        id_cest: CEST === undefined ? null : CEST.ID_CEST,
        id_empresa: id_empresa,
        id_usuario: id_usuario
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        err.message = 'Falha ao inserir o produto no cadastrado. '
        throw err
      });

      await new model.Produto().sp_gera_produto_mestre_item()
      .catch(async (err) => {
        err.message = 'Falha na geração Mestre Item do Produto. '
        throw err
      });
    }

    const prod = await new model.Produto().Mestre.Item.selectByCodigo(cd_produto_servico, id_empresa, dhEmi)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o produto cadastrada. '
      throw err
    });
    //#endregion 0200

    //#region CFOP
    const Cfop = await new model.Cfop().selectByCdCfop(det?.prod[0]?.CFOP[0])
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o CFOP cadastrado. '
      throw err
    });
    //#endregion CFOP

    const paramC170 = {
      /**
       * @param {integer} id_produto_servico
       */
      id_produto_servico: prod.ID_PRODUTO_SERVICO,
      /**
       * @param {string} ds_unidade
       */
      id_0190: Unidade.ID_0190,
      /**
       * @param {number} nVl_Uni det.prod[0]?.vUnCom
       */
      vl_unitario: parseFloat(utils.Validar.getValueArray(det.prod[0]?.vUnCom, 0, "0").replace(',','.')),
      /**
       * @param {number} vl_total_item det.prod[0]?.vProd
       */
      vl_total_item: parseFloat(utils.Validar.getValueArray(det.prod[0]?.vProd, 0, "0").replace(',','.')),
      /**
       * @param {number} sVl_Desc det.prod[0]?.vDesc 
       */
      vl_desconto_item: parseFloat(utils.Validar.getValueArray(det.prod[0]?.vDesc, 0, "0").replace(',','.')),
      /**
       * @param {string} dm_movimentacao_fisica 'S'
       */
      dm_movimentacao_fisica: 'S',
      /**
       * @param {string} cd_fiscal_operacao det.prod[0]?.CFOP[0]
       */
      cd_fiscal_operacao: det.prod[0]?.CFOP[0],
      /**
       * @param {string} nr_fci det.prod[0]?.nFCI
       */
      nr_fci: utils.Validar.getValueArray(det.prod[0]?.nFCI, 0, ""),
      /**
       * @param {number} sCST_ICMS
       */
      id_ref_431: null, //sCST_ICMS
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
       * @param {string} dm_tributacao_icms '5'
       */
      dm_tributacao_icms: '5', //esta fixo no fonte
      /**
       * @param {number} sCST_IPI
       */
      id_ref_432: null, //sCST_IPI
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
      qtde: parseFloat(utils.Validar.getValueArray(det.prod[0].qCom, 0, "0").replace(',','.')), //qQtde
      /**
       * @param {string} qUnid
       */
      unidade: ds_unidade, // qUnid
      /**
       * @param {string} dm_tributacao_ipi '5'
       */
      dm_tributacao_ipi: '5', // esta fixo no fonte
      /**
       * @param {number} nVl_Icms_Outro
       */
      vl_outras_despesas: parseFloat(utils.Validar.getValueArray(det.prod[0]?.vOutro, 0, "0").replace(',','.')), //nVl_Icms_Outro
      /**
       * @param {number} svFrete
       */
      vl_frete: parseFloat(utils.Validar.getValueArray(det.prod[0].vFrete, 0, "0").replace(',','.')), //svFrete
      /**
       * @param {number} svSeg
       */
      vl_seguro: parseFloat(utils.Validar.getValueArray(det.prod[0].vSeg, 0, "0").replace(',','.')), //svSeg
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
       * @param {number} sEnquadra
       */
      id_ref_453: null, //sEnquadra
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

    const paramC050 = {
      /**
       * @param {BigInt} sCST_PIS
       */
      id_ref_433: 0,
        /**
       * @param {number} sAliq_PIS
       */
      aliq_pis: 0,
      /**
       * @param {number}  sVl_Bc_PIS
       */
      vl_bc_pis: 0,
      /**
       * @param {number}  sVl_PIS
       */
      vl_pis: 0,
      /**
       * @param {number} sAliq_PIS_R
       */
      vl_aliq_pis: 0,
      /**
       * @param {number} default = 0
       */
      vl_pis_st: 0,
      /**
       * @param {number} sQTD_PIS
       */
      qtde_bc_pis: 0,
      /**
       * @param {number} sCST_COF
       */
      id_ref_434: 0,
      /**
       * @param {number} sAliq_COF
       */
      aliq_cofins: 0,
      /**
       * @param {number} sVl_Bc_COF
       */
      vl_bc_cofins: 0,
      /**
       * @param {number} sVl_COF
       */
      vl_cofins: 0,
      /**
       * @param {number} sAliq_COF_R
       */
      vl_aliq_cofins: 0,
      /**
       * @param {number} default = 0
       */
      vl_cofins_st: 0,
      /**
       * @param {number}  sQTD_COF
       */
      qtde_bc_cofins: 0,
      /**
       * @param {number} id_nota_fiscal_saida nulo
       */
      id_nota_fiscal_saida: null,
    }

    //#region ICMS
    let impostoICMS = {};
    let calcReBC = false
    
    if (det.imposto[0]?.ICMS[0]?.ICMS00 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS00[0];

      paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace(',','.')); //sVl_Bc_ICMS
      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); //sAliq_ICMS
      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); //sVl_ICMS

      paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, ""); //sModBC
      paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace(',','.')); //sAliq_FCP_OP
      paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace(',','.')); //sFCP_OP
      
      if (paramC170.vl_fcp_op > 0)
        paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace(',','.')); //sFCP_OP

    } else if (det.imposto[0]?.ICMS[0]?.ICMS10 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS10[0];

      paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace(',','.')); 
      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); 
      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); 

      paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace(',','.')); 
      paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace(',','.')); 
      paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace(',','.')); 
      
      paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace(',','.')); 

      paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, "");
      paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

      paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace(',','.')); 
      
      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace(',','.')); 

    } else if (det.imposto[0]?.ICMS[0]?.ICMS20 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS20[0];
      calcReBC = true;

      paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace(',','.')); 
      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); 
      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); 


      if (impostoICMS.motDesICMS !== undefined) {
        paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
        paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace(',','.')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.'));
      }

      paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.')) / 100) / 100); 
      paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.'));
      paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, ""); 

      paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace(',','.'));         

    } else if (det.imposto[0]?.ICMS[0]?.ICMS30 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS30[0];

      paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace(',','.')); 
      paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace(',','.')); 
      paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace(',','.')); 
      
      paramC170.vl_perc_red_icms_st = utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace(',','.');
      paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

      if (impostoICMS.motDesICMS !== undefined) {
        paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
        paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace(',','.')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.'));
      }

      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace(',','.')); 

    } else if (det.imposto[0]?.ICMS[0]?.ICMS40 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS40[0];
      
      if (impostoICMS.motDesICMS !== undefined) {
        paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
        paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace(',','.')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.'));
      }

    } else if (det.imposto[0]?.ICMS[0]?.ICMS51 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS51[0];
      calcReBC = true;

      paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace(',','.')); 
      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); 
      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); 


      paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.')) / 100) / 100); 
      paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.'));
      paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, ""); 

      paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace(',','.'));   
      
    } else if (det.imposto[0]?.ICMS[0]?.ICMS60 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS60[0];

      paramC170.vl_bc_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTRet, 0, "0").replace(',','.')); 
      paramC170.vl_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSSTRet, 0, "0").replace(',','.')); 

      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPSTRet, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPSTRet, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPSTRet, 0, "0").replace(',','.'));   

    } else if (det.imposto[0]?.ICMS[0]?.ICMS70 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS70[0];
      calcReBC = true;

      paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace(',','.')); 
      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); 
      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); 

      paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace(',','.')); 
      paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace(',','.')); 
      paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace(',','.')); 

      paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.')) / 100) / 100); 
      paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.'));
      paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace(',','.'));
      
      paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, ""); 
      paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

      if (impostoICMS.motDesICMS !== undefined) {
        paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
        paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace(',','.')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.'));
      }

      paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace(',','.')); 
      
      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace(',','.'));
      
    } else if (det.imposto[0]?.ICMS[0]?.ICMS90 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS90[0];
      calcReBC = true;

      paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace(',','.')); 
      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); 
      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); 

      paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace(',','.')); 
      paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace(',','.')); 
      paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace(',','.')); 

      paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.')) / 100) / 100); 
      paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.'));
      paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace(',','.'));
      
      paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, "");
      paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

      if (impostoICMS.motDesICMS !== undefined) {
        paramC170.dm_mot_desc_icms = utils.Validar.getValueArray(impostoICMS.motDesICMS, 0, "").padStart(2, '0');
        paramC170.vl_icms_desonerado = impostoICMS.vICMSDeson !== undefined ? parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSDeson, 0, "0").replace(',','.')) : parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.'));
      }

      paramC170.vl_bc_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCP, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCP, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_op = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCP, 0, "0").replace(',','.')); 
      
      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.ICMS[0]?.ICMSPart !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSPart[0];
      calcReBC = true;

      paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace(',','.')); 
      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); 
      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); 

      paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace(',','.')); 
      paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace(',','.')); 
      paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace(',','.')); 

      paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.')) / 100) / 100); 
      paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.'));
      paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace(',','.'));
      
      paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, "");
      paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

    } else if (det.imposto[0]?.ICMS[0]?.ICMSST !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSST[0];

      paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTDest, 0, "0").replace(',','.'));
      paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTDest, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.ICMS[0]?.ICMSSN101 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN101[0];

      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vCredICMSSN, 0, "0").replace(',','.'));

      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pCredSN, 0, "0").replace(',','.')); 

    } else if (det.imposto[0]?.ICMS[0]?.ICMSSN102 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN102[0]; // não tem valores
    } else if (det.imposto[0]?.ICMS[0]?.ICMSSN201 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN201[0];

      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vCredICMSSN, 0, "0").replace(',','.'));

      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pCredSN, 0, "0").replace(',','.')); 

      paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace(',','.')); 
      paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace(',','.')); 
      paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace(',','.')); 

      paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace(',','.'));
      
      paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.ICMS[0]?.ICMSSN202 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN202[0];

      paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace(',','.')); 
      paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace(',','.')); 
      paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace(',','.')); 
      
      paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace(',','.'));
      
      paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace(',','.'));

      paramC170.vl_bc_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTRet, 0, "0").replace(',','.')); 
      paramC170.vl_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSSTRet, 0, "0").replace(',','.')); 

      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPSTRet, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPSTRet, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPSTRet, 0, "0").replace(',','.'));   

    } else if (det.imposto[0]?.ICMS[0]?.ICMSSN500 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN500[0];
      
      paramC170.vl_bc_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCSTRet, 0, "0").replace(',','.')); 
      paramC170.vl_icms_st_obs = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSSTRet, 0, "0").replace(',','.')); 

      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPSTRet, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPSTRet, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPSTRet, 0, "0").replace(',','.'));   

    } else if (det.imposto[0]?.ICMS[0]?.ICMSSN900 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN900[0];

      paramC170.vl_base_calculo_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vBC, 0, "0").replace(',','.')); 
      paramC170.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); 
      paramC170.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); 

      paramC170.vl_base_calculo_icms_subst = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCST, 0, "0").replace(',','.')); 
      paramC170.vl_icms_substituicao = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMSST, 0, "0").replace(',','.')); 
      paramC170.aliq_icms_subs = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMSST, 0, "0").replace(',','.')); 

      paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * ((parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.')) / 100) / 100); 
      paramC170.vl_perc_red_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.'));
      paramC170.vl_perc_red_icms_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBCST, 0, "0").replace(',','.')); 

      paramC170.dm_mod_bc_icms = utils.Validar.getValueArray(impostoICMS.modBC, 0, "");
      paramC170.dm_mod_bc_icms_st = utils.Validar.getValueArray(impostoICMS.modBCST, 0, "");

      paramC170.vl_bc_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vBCFCPST, 0, "0").replace(',','.'));
      paramC170.aliq_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.pFCPST, 0, "0").replace(',','.')); 
      paramC170.vl_fcp_st = parseFloat(utils.Validar.getValueArray(impostoICMS.vFCPST, 0, "0").replace(',','.')); 
    }

    if (['ICMS00', 'ICMS10', 'ICMS20', 'ICMS30', 'ICMS40', 'ICMS51',
          'ICMS60', 'ICMS70', 'ICMS90', 'ICMSPart', 'ICMSST'].some((value) => { 
      return value == Object.keys(det.imposto[0]?.ICMS[0])[0];
    })) {
      impostoICMS.codAc431 = utils.Validar.getValueArray(impostoICMS.orig, 0, "") + utils.Validar.getValueArray(impostoICMS.CST, 0, "")
    } else if (['ICMSSN101', 'ICMSSN102', 'ICMSSN201', 
                'ICMSSN202', 'ICMSSN500', 'ICMSSN900'].some((value) => { 
      return value == Object.keys(det.imposto[0]?.ICMS[0])[0];
    })) {
      impostoICMS.codAc431 = utils.Validar.getValueArray(impostoICMS.CSOSN, 0, "")
    } else {
      impostoICMS.codAc431 = '';
    }

    const ac431 = await new model.Ac431().selectByCodigo(impostoICMS.codAc431)
    .then(async (data) => {
       return data.rows[0];
    }).catch(async (err) => {
      err.message = 'Falha na busca pelo o Ac431 cadastrada. '
      throw err
    });
    
    if (ac431 !== undefined) paramC170.id_ref_431 = ac431.ID_REF_431; //sCST_ICMS

      
    if(impostoICMS.codAc431.length == 2)
      impostoICMS.codAc431 = '0' + impostoICMS.codAc431;

    if(impostoICMS.codAc431.length == 0)
      impostoICMS.codAc431 = '090';

    //#endregion ICMS
      
    //#region IPI
    if (det.imposto[0]?.IPI !== undefined){
      const Sf453 = await new model.Sf453().selectByCodigo(utils.Validar.getValueArray(det.imposto[0]?.IPI[0]?.cEnq, 0, ""))
      .then((data) => {
        return data.rows[0]
      })
      .catch((err) => {
        err.message = 'Falha na busca pelo o SF453 cadastrada. '
        throw err
      });

      if (Sf453 !== undefined) paramC170.id_ref_453 = Sf453.ID_REF_453;

      if (det.imposto[0]?.IPI[0]?.IPITrib !== undefined) {
        paramC170.id_ref_432 = utils.Validar.getValueArray(det.imposto[0]?.IPI[0]?.IPITrib[0]?.CST, 0, "");
        paramC170.vl_base_calculo_ipi = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.IPI[0]?.IPITrib[0]?.vBC, 0, "0").replace(',','.'));
        paramC170.vl_ipi = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.IPI[0]?.IPITrib[0]?.vIPI, 0, "0").replace(',','.'));
        paramC170.aliq_ipi = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.IPI[0]?.IPITrib[0]?.pIPI, 0, "0").replace(',','.'));
        
        if (paramC170.vl_base_calculo_ipi === null && 
            paramC170.vl_ipi === null &&
            det.imposto[0]?.IPI[0]?.IPITrib[0]?.qUnid !== undefined &&
            det.imposto[0]?.IPI[0]?.IPITrib[0]?.vUnid !== undefined) {
          paramC170.id_ref_432 = 99;
        }
      } else if (det.imposto[0]?.IPI[0]?.IPINT !== undefined) {
        paramC170.id_ref_432 = utils.Validar.getValueArray(det.imposto[0]?.IPI[0]?.IPINT[0]?.CST, 0, "");
      }
    
      const Ac432 = await new model.Ac432().selectByCodigo(paramC170.id_ref_432.toString())
      .then((data) => {
        return data.rows[0]
      })
      .catch((err) => {
        err.message = 'Falha na busca pelo o Ac432 cadastrada. '
        throw err
      });

      if(Ac432 !== undefined) paramC170.id_ref_432 = Ac432.ID_REF_432;
    }
    //#endregion IPI

    //#region II
    if (det.imposto[0]?.II !== undefined) {
      paramC170.vl_bc_ii = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.II[0]?.vBC, 0, "0").replace(',','.'));
      paramC170.vl_desp_adu = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.II[0]?.vDespAdu, 0, "0").replace(',','.'));
      paramC170.vl_ii = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.II[0]?.vII, 0, "0").replace(',','.'));
      paramC170.vl_iof = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.II[0]?.vIOF, 0, "0").replace(',','.'));

    }
    //#endregion II

    //#region PIS
    if (det.imposto[0]?.PIS[0]?.PISAliq !== undefined) {
      paramC050.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISAliq[0]?.CST, 0, "");
      paramC050.vl_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISAliq[0]?.vBC, 0, "0").replace(',','.'));
      paramC050.aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISAliq[0]?.pPIS, 0, "0").replace(',','.'));
      paramC050.vl_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISAliq[0]?.vPIS, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.PIS[0]?.PISQtde !== undefined) {
      paramC050.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISQtde[0]?.CST, 0, "");
      paramC050.vl_aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISQtde[0]?.vAliqProd, 0, "0").replace(',','.'));
      paramC050.vl_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISQtde[0]?.vPIS, 0, "0").replace(',','.'));
      paramC050.qtde_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISQtde[0]?.qBCProd, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.PIS[0]?.PISNT !== undefined) {
      paramC050.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISNT[0]?.CST, 0, "");
    } else if (det.imposto[0]?.PIS[0]?.PISOutr !== undefined) {
      paramC050.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.CST, 0, "");
      paramC050.vl_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.vBC, 0, "0").replace(',','.'));
      paramC050.aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.pPIS, 0, "0").replace(',','.'));
      paramC050.vl_aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.vAliqProd, 0, "0").replace(',','.'));
      paramC050.vl_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.vPIS, 0, "0").replace(',','.'));
      paramC050.qtde_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.qBCProd, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.PIS[0]?.PISST !== undefined) {
      paramC050.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.CST, 0, "");
      paramC050.vl_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.vBC, 0, "0").replace(',','.'));
      paramC050.aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.pPIS, 0, "0").replace(',','.'));
      paramC050.vl_aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.vAliqProd, 0, "0").replace(',','.'));
      paramC050.vl_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.vPIS, 0, "0").replace(',','.'));
      paramC050.qtde_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.qBCProd, 0, "0").replace(',','.'));

    }

    const Sf433 = await new model.Sf433().selectByCodigo(paramC050.id_ref_433.toString())
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o SF433 cadastrada. '
      throw err
    });

    if(Sf433 !== undefined) paramC050.id_ref_433 = Sf433.ID_REF_433;
    //#endregion PIS

    //#region COFINS
    if (det.imposto[0]?.COFINS[0]?.COFINSAliq !== undefined) {
      paramC050.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSAliq[0]?.CST, 0, "");
      paramC050.vl_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSAliq[0]?.vBC, 0, "0").replace(',','.'));
      paramC050.aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSAliq[0]?.pCOFINS, 0, "0").replace(',','.'));          
      paramC050.vl_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSAliq[0]?.vCOFINS, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.COFINS[0]?.COFINSQtde !== undefined) {
      paramC050.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSQtde[0]?.CST, 0, "");
      paramC050.vl_aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSQtde[0]?.vAliqProd, 0, "0").replace(',','.'));
      paramC050.vl_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSQtde[0]?.vCOFINS, 0, "0").replace(',','.'));
      paramC050.qtde_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSQtde[0]?.qBCProd, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.COFINS[0]?.COFINSNT !== undefined) {
      paramC050.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSNT[0]?.CST, 0, "");
    } else if (det.imposto[0]?.COFINS[0]?.COFINSOutr !== undefined) { 
      paramC050.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSOutr[0]?.CST, 0, "");
      paramC050.vl_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSOutr[0]?.vBC, 0, "0").replace(',','.'));
      paramC050.aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSOutr[0]?.pCOFINS, 0, "0").replace(',','.'));
      paramC050.vl_aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSOutr[0]?.vAliqProd, 0, "0").replace(',','.'));
      paramC050.vl_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSOutr[0]?.vCOFINS, 0, "0").replace(',','.'));
      paramC050.qtde_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSOutr[0]?.qBCProd, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.COFINS[0]?.COFINSST !== undefined) {
      paramC050.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSST[0]?.CST, 0, "");
      paramC050.vl_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSST[0]?.vBC, 0, "0").replace(',','.'));
      paramC050.aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSST[0]?.pCOFINS, 0, "0").replace(',','.'));
      paramC050.vl_aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSST[0]?.vAliqProd, 0, "0").replace(',','.'));
      paramC050.vl_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSST[0]?.vCOFINS, 0, "0").replace(',','.'));
      paramC050.qtde_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSST[0]?.qBCProd, 0, "0").replace(',','.'));

    }

    const Sf434 = await new model.Sf434().selectByCodigo(paramC050.id_ref_434.toString())
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o SF433 cadastrada. '
      throw err
    });

    if(Sf434 !== undefined) paramC050.id_ref_434 = Sf434.ID_REF_434;
    //#endregion COFINS

    //#region Imposto
    if (det.imposto[0]?.ICMSUFDest !== undefined) {
      paramC170.vl_bc_icms_uf_dest = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.ICMSUFDest[0]?.vBCUFDest, 0, "0").replace(',','.'));
      paramC170.perc_icms_fcp = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.ICMSUFDest[0]?.pFCPUFDest, 0, "0").replace(',','.'));
      paramC170.aliq_icms_uf_dest = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.ICMSUFDest[0]?.pICMSUFDest, 0, "0").replace(',','.'));
      paramC170.aliq_icms_interestadual = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.ICMSUFDest[0]?.pICMSInter, 0, "0").replace(',','.'));
      paramC170.perc_icms_partilha = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.ICMSUFDest[0]?.pICMSInterPart, 0, "0").replace(',','.'));
      paramC170.vl_icms_fcp = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.ICMSUFDest[0]?.vFCPUFDest, 0, "0").replace(',','.'));
      paramC170.vl_icms_uf_dest = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.ICMSUFDest[0]?.vICMSUFDest, 0, "0").replace(',','.'));
      paramC170.vl_icms_uf_remet = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.ICMSUFDest[0]?.vICMSUFRemet, 0, "0").replace(',','.'));
    }
    //#endregion Imposto

    //#region Calculo BC
    if (calcReBC) {
      let somatoria = 0;
      if (Cfop.DM_ICMS_VL_CONTABIL == 'S') {
        somatoria = somatoria + paramC170.vl_icms_substituicao; //sVl_ICMS
      }

      if (Cfop.DM_VLCONTABIL_PISCOFINS == 'S') {
        somatoria = somatoria + paramC170.vl_pis; //sVl_PIS
        somatoria = somatoria + paramC170.vl_cofins; //sVl_COF  
      }

      if (Cfop.DM_VLCONTABIL_II == 'S') {
        somatoria = somatoria + paramC170.vl_ii; //sVl_II
      }

      if (Cfop.DM_VLCONTABIL_ICMSDESCON == 'S') {
        somatoria = somatoria - paramC170.vl_icms_desonerado; //sVl_Desoner
      }
      
      somatoria = somatoria + (paramC170.qtde * paramC170.vl_unitario) + parseFloat(utils.Validar.getValueArray(xmlObj.nfeProc?.NFe[0]?.infNFe[0]?.total[0].ICMSTot[0]?.vOutro, 0, "0").replace(',','.')) +
        paramC170.vl_frete + paramC170.vl_seguro + paramC170.vl_ipi + paramC170.vl_icms + paramC170.cd_fiscal_operacao - paramC170.vl_desconto_item;

      paramC170.vl_reducao_bc_icms = somatoria * (paramC170.vl_perc_red_icms / 100);
      
    } else {
      let nRedBC = (parseFloat(utils.Validar.getValueArray(impostoICMS.pRedBC, 0, "0").replace(',','.')) / 100)
      paramC170.vl_reducao_bc_icms = paramC170.vl_total_item * (nRedBC / 100);
    }

    //#endregion Calculo BC
    
    //#region C170
    await new model.NotaFiscal.Saida().Item.insert({
      ...chaveC170,
      ...paramC170,
      id_usuario: id_usuario
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      err.message = 'Falha ao inserir o item da nota fiscal de saida no cadastrado. '
      throw err
    });
    //#endregion C170

    //#region ACC050
    const AcC050Saida = {
      ...chaveC170,
      ...paramC050,
      id_usuario: id_usuario
    }

    await new model.NotaFiscal.Saida().Item.AcC050.insert(AcC050Saida)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      err.message = 'Falha ao inserir o AcC050 no cadastrado. '
      throw err
    });
    //#endregion ACC050

    //#region SFC195
    if (det?.infAdProd !== undefined){
      let ds0460 = det?.infAdProd[0];
      if (ds0460.length > 4000){
        ds0460 = ds0460.slice(0,4000);
      }
      
      let Sf0460 = await new model.Sf0460().selectByCodigo(ds0460, id_empresa)
      .then((data) => {
        return data.rows[0]
      })
      .catch((err) => {
        err.message = 'Falha na busca pelo o Sf0460 cadastrado. '
        throw err
      });

      if (Sf0460 === undefined){
        Sf0460 = await new model.Sf0460().insert({
          cd_obs: null,
          dt_inicial: dhEmi, 
          dt_movimento: dhEmi, 
          ds_obs: ds0460,
          id_empresa: id_empresa, 
          id_usuario: id_usuario
        })
        .then((data) => {
          return data;
        })
        .catch((err) => {
          err.message = 'Falha ao inserir o Sf046 no cadastrado. '
          throw err
        });
      }

      await new model.NotaFiscal.Saida().SfC195.insert({
        ...chaveC170,
        id_0460: Sf0460.ID_0460,
        ds_complementar: Sf0460.DS_OBS,
        id_nota_fiscal_saida: null,
        id_usuario: id_usuario
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        err.message = 'Falha ao inserir o SfC195 no cadastrado. '
        throw err
      });
    }
    //#endregion SFC195
  }
  
  var dt_periodo1 = new Date(dt_periodo);

  var paramProcedures = {
    pId_Usuario: id_usuario,
    pId_Empresa: id_empresa,
    pDt_Inicial: {type: Oracle.oracledb.DATE, val: utils.FormatarData.DateToPrimeiroDia(utils.FormatarData.DateNodeToDateOracleString(dt_periodo1))},
    pDt_Final: {type: Oracle.oracledb.DATE, val: utils.FormatarData.DateToUltimoDia(utils.FormatarData.DateNodeToDateOracleString(dt_periodo1))}
  }

  await Oracle.execProcedure("SP_ATUAL_MAPA_CIPI_ENTRADA", paramProcedures)
  .catch((err) => {
    err.message = 'Falha ao Atualizar Mapa Entrada. '
    throw err
  });
  await Oracle.execProcedure("SP_ATUAL_MAPA_CIPI_SAIDA", paramProcedures)
  .catch((err) => {
    err.message = 'Falha ao Atualizar Mapa Saída. '
    throw err
  });
  await Oracle.execProcedure("SP_SF_ATUALIZA_NF_XML", paramProcedures)
  .catch((err) => {
    err.message = 'Falha ao Atualizar NF XML. '
    throw err
  });

  
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

  //#region Empresa
  const Empresa = await new model.CtrlEmpresa().select(id_empresa)
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    err.message = 'Falha na busca pela empresa cadastrada. '
    throw err
  });
  

  if(Empresa.CNPJ_EMPRESA !== xmlObj.CFe?.infCFe[0]?.emit[0].CNPJ[0]) { //senão saida
    throw new Error('Cupom fiscal informada não pertence a empresa.');
  }
  //#endregion Empresa

  //#region ModeloDocumento
  const ModeloDocumento = await new model.ModeloDocumento().selectByCdModeloDocumento(xmlObj.CFe?.infCFe[0]?.ide[0]?.mod[0])
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    err.message = 'Falha na busca pelo o model documento cadastrado. '
    throw err
  });
  //#endregion ModeloDocumento

  //#region Ac413
  const Ac413 = await new model.Ac413().selectByCodigo('00')
  .then((data) => {
    return data.rows[0]
  })
  .catch((err) => {
    err.message = 'Falha na busca pelo o Ac433 cadastrado. '
    throw err
  });
  //#endregion Ac413

  //#region SfC800
  const SfC800Chave = {
    /**
     * @param {number} id_ref_413 default 00
     */
    id_ref_413: Ac413.ID_REF_413,
    /**
     * @param {string} nr_serie_sat
     */
    nr_serie_sat: xmlObj.CFe?.infCFe[0]?.ide[0]?.nserieSAT[0],
    /**
     * @param {string} dhEmi
     */
    dt_documento: utils.FormatarData.DateXmlToDateOracleString(xmlObj.CFe?.infCFe[0]?.ide[0]?.dEmi[0]), 
    /**
     * @param {string} nr_cfe
     */
    nr_cfe: xmlObj.CFe?.infCFe[0]?.ide[0]?.nCFe[0]
  }

  const SfC800 = {
    ...SfC800Chave,
    /**
     * @param {string} chaveCFE
     */
    nr_chave_cfe: xmlObj.CFe[0].infCFe[0].$.Id.slice(3),
    /**
     * @param {number} id_modelo_documento
     */
    id_modelo_documento: ModeloDocumento.ID_MODELO_DOCUMENTO,
    /**
     * @param {string} cpfOrCnpj
     */
    nr_cnpj_cpf: utils.Validar.ifelse(xmlObj.CFe?.infCFe[0]?.dest[0]?.CNPJ, xmlObj.CFe?.infCFe[0]?.dest[0]?.CPF)[0],
    /**
     * @param {string} nr_caixa
     */
    nr_caixa: utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.ide[0]?.numeroCaixa, 0),
    /**
     * @param {string} sNomeDest
     */
    nm_destinatario: utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.dest[0]?.xNome, 0),
    /**
     * @param {number} sNomeDest
     */
    vl_desconto: parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.ICMSTot[0]?.vDesc, 0, "0").replace(',','.')) + parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.DescAcrEntr[0]?.vDescSubtot, 0, "0").replace(',','.')),
    /**
     * @param {number} sNomeDest
     */
    vl_mercadoria: parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.ICMSTot[0]?.vProd, 0, "0").replace(',','.')),
    /**
     * @param {number} sNomeDest
     */
    vl_outras_desp: parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.ICMSTot[0]?.vOutro, 0, "0").replace(',','.')) + parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.DescAcrEntr[0]?.vAcresSubtot, 0, "0").replace(',','.')),
    /**
     * @param {number} sNomeDest
     */
    vl_icms: parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.ICMSTot[0]?.vICMS, 0, "0").replace(',','.')),
    /**
     * @param {number} sNomeDest
     */
    vl_pis: parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.ICMSTot[0]?.vPIS, 0, "0").replace(',','.')),
    /**
     * @param {number} sNomeDest
     */
    vl_pis_st: parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.ICMSTot[0]?.vPISST, 0, "0").replace(',','.')),
    /**
     * @param {number} sNomeDest
     */
    vl_cofins: parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.ICMSTot[0]?.vCOFINS, 0, "0").replace(',','.')),
    /**
     * @param {number} sNomeDest
     */
    vl_cofins_st: parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.ICMSTot[0]?.vCOFINSST, 0, "0").replace(',','.')),
    /**
     * @param {number} sNomeDest
     */
    vl_cfe: parseFloat(utils.Validar.getValueArray(xmlObj.CFe?.infCFe[0]?.total[0]?.vCFe, 0, "0").replace(',','.')),
    /**
     * @param {number} sNomeDest
     */
    id_empresa: id_empresa,
    /**
     * @param {number} id_usuario
     */
    id_usuario: id_usuario
  }

  await new model.SfC800().insert(SfC800)
  .then((data) => {
    return data
  })
  .catch((err) => {
    err.message = 'Falha ao inserir SFC800 no cadastro. '
    throw err
  })
  //#endregion SfC800

  for (let i = 0; i < xmlObj.CFe?.infCFe[0]?.det.length; i++) {
    const det = xmlObj.CFe?.infCFe[0]?.det[i];

    //#region 0190
    let ds_unidade = utils.Validar.getValueArray(det.prod[0]?.uCom, 0, "XX");

    let Unidade = await new model.Sf0190().selectByDsUnidade(ds_unidade, id_empresa, SfC800Chave.dt_documento)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pela a unidade cadastrada. '
      throw err
    });

    if (Unidade === undefined) {
      await new model.Sf0190().insert({
        ds_unidade: ds_unidade,
        ds_descricao: ds_unidade,
        dt_inicial: SfC800Chave.dt_documento,
        dt_movimento: SfC800Chave.dt_documento,
        id_empresa: id_empresa,
        id_usuario: id_usuario
      });
    } else {
      ds_unidade = Unidade.DS_UNIDADE;
    }
    //#endregion 0190

    //#region 0200
    let cd_produto_servico = utils.FormatarString.removeCaracteresEspeciais(det.prod[0]?.cProd[0])
    let produto = await new model.Produto().Mestre.Item.selectByCodigo(cd_produto_servico, id_empresa, SfC800Chave.dt_documento)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o produto cadastrada. '
      throw err
    });
    
    await new model.Produto().insert({
      cd_produto_servico: cd_produto_servico,
      cd_barra: det.prod[0]?.cEAN[0],
      ds_produto_servico: det.prod[0]?.xProd[0],
      id_ref_331_ncm: null,
      id_ref_331_ex_ipi: null,
      dm_tipo_item: produto === undefined ? '99' : produto.DM_TIPO_ITEM,
      unidade: ds_unidade,
      id_0190: ds_unidade,
      dt_inicial: SfC800Chave.dt_documento,
      dt_movimento: SfC800Chave.dt_documento,
      id_cest: utils.Validar.getValueArray(det.prod[0]?.CEST, 0, ""),
      id_empresa: id_empresa,
      id_usuario: id_usuario
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      err.message = 'Falha ao inserir o produto no cadastrado. '
      throw err
    });

    await new model.Produto().sp_gera_produto_mestre_item()
    .catch(async (err) => {
      err.message = 'Falha na geração Mestre Item do Produto. '
      throw err
    });

    const prod = await new model.Produto().Mestre.Item.selectByCodigo(cd_produto_servico, id_empresa, SfC800Chave.dt_documento)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o produto cadastrada. '
      throw err
    });
    //#endregion 0200

    //#region SF0460
    let Sf0460
    if (det?.infAdProd !== undefined) {
      let ds0460 = det?.infAdProd[0];
      if (ds0460.length > 4000){
        ds0460 = ds0460.slice(0,4000);
      }
      
      Sf0460 = await new model.Sf0460().selectByCodigo(ds0460, id_empresa)
      .then((data) => {
        return data.rows[0]
      })
      .catch((err) => {
        err.message = 'Falha na busca pelo o Sf0460 cadastrado. '
        throw err
      });

      if (Sf0460 === undefined){
        Sf0460 = await new model.Sf0460().insert({
          cd_obs: '',
          dt_inicial: SfC800Chave.dt_documento, 
          dt_movimento: SfC800Chave.dt_documento, 
          ds_obs: ds0460,
          id_empresa: id_empresa, 
          id_usuario: id_usuario
        })
        .then((data) => {
          return data;
        })
        .catch((err) => {
          err.message = 'Falha ao inserir o Sf046 no cadastrado. '
          throw err
        });
      }
    }
    //#endregion SF0460

    const SfC850 = {
      /**
       * @param {number} sItem_Seq
       */
      nr_item: parseInt(det.$.nItem),
      ...SfC800Chave,
      /**
       * @param {String} CFOP
       */
      cd_fiscal_operacao: utils.Validar.getValueArray(det.prod[0].CFOP, 0, "0"),
      /**
       * @param {number} ID_PRODUTO_SERVCO
       */
      id_produto_servico: prod.ID_PRODUTO_SERVCO,
      /**
       * @param {number} vItem
       */
      vl_total_item: parseFloat(utils.Validar.getValueArray(det.prod[0].vItem, 0, "0").replace(',','.')),
      /**
       * @param {number} sCd_0460
       */
      id_0460: Sf0460?.ID_0460 !== undefined ? Sf0460.ID_0460 : "",
      /**
       * @param {number|string} sCST_ICMS
       */
      id_ref_431: null,
      /**
       * @param {number} sAliq_ICMS
       */
      aliq_icms: 0,
      /**
       * @param {number} sVl_Bc_ICMS
       */
      vl_bc_icms: 0,
      /**
       * @param {number} sVl_ICMS
       */
      vl_icms: 0,
      /**
       * @param {number|string} sCST_PIS
       */
      id_ref_433: null,
      /**
       * @param {number} sAliq_PIS
       */
      aliq_pis: 0,
      /**
       * @param {number} sVl_Bc_PIS
       */
      vl_bc_pis: 0,
      /**
       * @param {number} sVl_PIS
       */
      vl_pis: 0,
      /**
       * @param {number} sVl_Aliq_Pis
       */
      vl_aliq_pis: 0,
      /**
       * @param {number} sVl_Qtde_Pis
       */
      vl_qtde_bc_pis: 0,
      /**
       * @param {number|string} sCST_COFINS
       */
      id_ref_434: null,
      /**
       * @param {number} sVl_Bc_COFINS
       */
      vl_bc_cofins: 0,
      /**
       * @param {number} sAliq_COFINS
       */
      aliq_cofins: 0,
      /**
       * @param {number} sVl_COFINS
       */
      vl_cofins: 0,
      /**
       * @param {number} sVl_Aliq_Cofins
       */
      vl_aliq_cofins: 0,
      /**
       * @param {number} sVl_Qtde_Cofins
       */
      vl_qtde_bc_cofins: 0,
      /**
       * @param {number} nDesc
       */
      vl_desconto: parseFloat(utils.Validar.getValueArray(det.prod[0].vRatDesc, 0, "0").replace(',','.')) + parseFloat(utils.Validar.getValueArray(det.prod[0].vDesc, 0, "0").replace(',','.')),
      /**
       * @param {number} nAcres
       */
      vl_outras_desp: parseFloat(utils.Validar.getValueArray(det.prod[0].vRatAcr, 0, "0").replace(',','.')),
      /**
       * @param {number} qCom
       */
      qtde: parseFloat(utils.Validar.getValueArray(det.prod[0].qCom, 0, "0").replace(',','.')), 
      /**
       * @param {number} vUnCom
       */
      vl_unitario: parseFloat(utils.Validar.getValueArray(det.prod[0].vUnCom, 0, "0").replace(',','.')),
      id_empresa: id_empresa,
      id_usuario:id_usuario
    } 

    let impostoICMS;

    //#region ICMS
    if (det.imposto[0]?.ICMS[0]?.ICMS00 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS00[0];

      SfC850.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); //sAliq_ICMS
      SfC850.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); //sVl_ICMS

      if (SfC850.aliq_icms > 0 && SfC850.vl_icms > 0)
        SfC850.vl_bc_icms = SfC850.vl_total_item;

    } else if (det.imposto[0]?.ICMS[0]?.ICMS40 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMS40[0];

    } else if (det.imposto[0]?.ICMS[0]?.ICMSSN102 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN102[0];

      SfC850.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); //sAliq_ICMS
      SfC850.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); //sVl_ICMS

      if (SfC850.aliq_icms > 0 && SfC850.vl_icms > 0)
        SfC850.vl_bc_icms = SfC850.vl_total_item;

    } else if (det.imposto[0]?.ICMS[0]?.ICMSSN900 !== undefined) {
      impostoICMS = det.imposto[0]?.ICMS[0]?.ICMSSN900[0];

      SfC850.aliq_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.pICMS, 0, "0").replace(',','.')); //sAliq_ICMS
      SfC850.vl_icms = parseFloat(utils.Validar.getValueArray(impostoICMS.vICMS, 0, "0").replace(',','.')); //sVl_ICMS

      if (SfC850.aliq_icms > 0 && SfC850.vl_icms > 0)
        SfC850.vl_bc_icms = SfC850.vl_total_item;
    }

    /* AC431 */
    if (['ICMS00', 'ICMS40'].some((value) => {
      return value == Object.keys(det.imposto[0]?.ICMS[0])[0];
    })) {
      impostoICMS.codAc431 = utils.Validar.getValueArray(impostoICMS.orig, 0, "") + utils.Validar.getValueArray(impostoICMS.CST, 0, "")
    } else if (['ICMSSN102', 'ICMSSN900'].some((value) => { 
      return value == Object.keys(det.imposto[0]?.ICMS[0])[0];
    })) {
      impostoICMS.codAc431 = utils.Validar.getValueArray(impostoICMS.CSOSN, 0, "")
    } else {
      impostoICMS.codAc431 = '';
    }

    const ac431 = await new model.Ac431().selectByCodigo(impostoICMS.codAc431)
    .then(async (data) => {
    return data.rows[0];
    }).catch(async (err) => {
      err.message = 'Falha na busca pelo o Ac431 cadastrada. '
      throw err
    });

    if (ac431 !== undefined) SfC850.id_ref_431 = ac431.ID_REF_431; //sCST_ICMS
    /* fim AC431 */

    //#endregion ICMS

    //#region PIS
    if (det.imposto[0]?.PIS[0]?.PISAliq !== undefined) {
      SfC850.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISAliq[0]?.CST, 0, "");
      SfC850.vl_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISAliq[0]?.vBC, 0, "0").replace(',','.'));
      SfC850.aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISAliq[0]?.pPIS, 0, "0").replace(',','.'));
      SfC850.vl_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISAliq[0]?.vPIS, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.PIS[0]?.PISQtde !== undefined) {
      SfC850.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISQtde[0]?.CST, 0, "");
      SfC850.vl_aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISQtde[0]?.vAliqProd, 0, "0").replace(',','.'));
      SfC850.vl_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISQtde[0]?.vPIS, 0, "0").replace(',','.'));
      SfC850.vl_qtde_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISQtde[0]?.qBCProd, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.PIS[0]?.PISNT !== undefined) {
      SfC850.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISNT[0]?.CST, 0, "");

    } else if (det.imposto[0]?.PIS[0]?.PISSN !== undefined) {
      SfC850.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISSN[0]?.CST, 0, "");
      
    } else if (det.imposto[0]?.PIS[0]?.PISOutr !== undefined) {
      SfC850.id_ref_433 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.CST, 0, "");
      SfC850.vl_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.vBC, 0, "0").replace(',','.'));
      SfC850.aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.pPIS, 0, "0").replace(',','.'));
      SfC850.vl_aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.vAliqProd, 0, "0").replace(',','.'));
      SfC850.vl_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.vPIS, 0, "0").replace(',','.'));
      SfC850.vl_qtde_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISOutr[0]?.qBCProd, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.PIS[0]?.PISST !== undefined) {
      SfC850.id_ref_433 = "05";
      SfC850.vl_bc_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.vBC, 0, "0").replace(',','.'));
      SfC850.aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.pPIS, 0, "0").replace(',','.'));
      SfC850.vl_aliq_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.vAliqProd, 0, "0").replace(',','.'));
      SfC850.vl_pis = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.vPIS, 0, "0").replace(',','.'));
      SfC850.vl_qtde_bc_pis  = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.PISST[0]?.qBCProd, 0, "0").replace(',','.'));

    }
   
    const Sf433 = await new model.Sf433().selectByCodigo(SfC850.id_ref_433)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o SF433 cadastrada. '
      throw err
    });

    if(Sf433 !== undefined) SfC850.id_ref_433 = Sf433.ID_REF_433;

    //#endregion PIS

    //#region COFINS
    if (det.imposto[0]?.COFINS[0]?.COFINSAliq !== undefined) {
      SfC850.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSAliq[0]?.CST, 0, "");
      SfC850.vl_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSAliq[0]?.vBC, 0, "0").replace(',','.'));
      SfC850.aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSAliq[0]?.pCOFINS, 0, "0").replace(',','.'));          
      SfC850.vl_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.COFINS[0]?.COFINSAliq[0]?.vCOFINS, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.COFINS[0]?.COFINSQtde !== undefined) {
      SfC850.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSQtde[0]?.CST, 0, "");
      SfC850.vl_aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSQtde[0]?.vAliqProd, 0, "0").replace(',','.'));
      SfC850.vl_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSQtde[0]?.vCOFINS, 0, "0").replace(',','.'));
      SfC850.vl_qtde_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSQtde[0]?.qBCProd, 0, "0").replace(',','.'));
    
    } else if (det.imposto[0]?.COFINS[0]?.COFINSNT !== undefined) {
      SfC850.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSNT[0]?.CST, 0, "");

    } else if (det.imposto[0]?.COFINS[0]?.COFINSSN !== undefined) {
      SfC850.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSSN[0]?.CST, 0, "");

    } else if (det.imposto[0]?.COFINS[0]?.COFINSOutr !== undefined) { 
      SfC850.id_ref_434 = utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSOutr[0]?.CST, 0, "");
      SfC850.vl_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSOutr[0]?.vBC, 0, "0").replace(',','.'));
      SfC850.aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSOutr[0]?.pCOFINS, 0, "0").replace(',','.'));
      SfC850.vl_aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSOutr[0]?.vAliqProd, 0, "0").replace(',','.'));
      SfC850.vl_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSOutr[0]?.vCOFINS, 0, "0").replace(',','.'));
      SfC850.vl_qtde_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSOutr[0]?.qBCProd, 0, "0").replace(',','.'));

    } else if (det.imposto[0]?.COFINS[0]?.COFINSST !== undefined) {
      SfC850.id_ref_434 = "05";
      SfC850.vl_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSST[0]?.vBC, 0, "0").replace(',','.'));
      SfC850.aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSST[0]?.pCOFINS, 0, "0").replace(',','.'));
      SfC850.vl_aliq_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSST[0]?.vAliqProd, 0, "0").replace(',','.'));
      SfC850.vl_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSST[0]?.vCOFINS, 0, "0").replace(',','.'));
      SfC850.vl_qtde_bc_cofins = parseFloat(utils.Validar.getValueArray(det.imposto[0]?.PIS[0]?.COFINSST[0]?.qBCProd, 0, "0").replace(',','.'));

    }

    const Sf434 = await new model.Sf434().selectByCodigo(SfC850.id_ref_434)
    .then((data) => {
      return data.rows[0]
    })
    .catch((err) => {
      err.message = 'Falha na busca pelo o SF433 cadastrada. '
      throw err
    });

    if(Sf434 !== undefined) SfC850.id_ref_434 = Sf434.ID_REF_4

    //#endregion COFINS

    //#region SFC850
    await new model.SfC800().SfC850.insert(SfC850)
    .then((data) => {
      return data
    })
    .catch((err) => {
      err.message = 'Falha ao inserir SFC800 no cadastro. '
      throw err
    })
    //#endregion SFC850
  }

  var dt_periodo1 = new Date(dt_periodo);

  var paramProcedures = {
    pId_Usuario: id_usuario,
    pId_Empresa: id_empresa,
    pDt_Inicial: {type: Oracle.oracledb.DATE, val: utils.FormatarData.DateToPrimeiroDia(utils.FormatarData.DateNodeToDateOracleString(dt_periodo1))},
    pDt_Final: {type: Oracle.oracledb.DATE, val: utils.FormatarData.DateToUltimoDia(utils.FormatarData.DateNodeToDateOracleString(dt_periodo1))}
  }
  
  await Oracle.execProcedure("SP_ATUAL_MAPA_CIPI_ENTRADA", paramProcedures)
  .catch((err) => {
    err.message = 'Falha ao Atualizar Mapa Entrada. '
    throw err
  });
  await Oracle.execProcedure("SP_ATUAL_MAPA_CIPI_SAIDA", paramProcedures)
  .catch((err) => {
    err.message = 'Falha ao Atualizar Mapa Saída. '
    throw err
  });
  await Oracle.execProcedure("SP_SF_ATUALIZA_NF_XML", paramProcedures)
  .catch((err) => {
    err.message = 'Falha ao Atualizar NF XML. '
    throw err
  });
}
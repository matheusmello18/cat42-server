CREATE OR REPLACE PROCEDURE SP_SF_IMPORTA_TEXTO_SIMUL (pDt_Inicial   IN DATE,
                                                       pDt_Final     IN DATE,
                                                       pId_Empresa   IN NUMBER,
                                                       pId_Usuario   IN NUMBER,
                                                       pId_Projeto   IN NUMBER,
                                                       pId_Modulo    IN NUMBER)
IS
BEGIN
  INSERT INTO IN_LOG_IMPORTACAO (ID_ARQUIVO,
                                  ID_EMPRESA,
                                  ID_USUARIO,
                                  DT_MOVIMENTO,
                                  DS_CAMPO,
                                  DS_CONTEUDO,
                                  DS_OCORRENCIA,
                                  NR_SEQUENCIA,
                                  DS_CONTEUDO_BANCO)
                          VALUES (541,
                                  15,
                                  pId_Usuario,
                                  SYSDATE,
                                  'MATHEUS',
                                  'COMECOU A PROCEDURE',
                                  '00',
                                  1,
                                  'IMP FROM CATWEB');
  BEGIN
    SP_SF_IMPORTA_TEXTO (pDt_Inicial,
                         pDt_Final,
                         pId_Empresa,
                         pId_Usuario,
                         pId_Projeto,
                         pId_Modulo,
                         1,
                         1,
                         1,
                         0);
  EXCEPTION
    WHEN OTHERS THEN
      UPDATE SIMUL_SEMAFORO SET DM_TERMINOU = '1' WHERE ID_USUARIO = pId_Usuario AND ID_EMPRESA = pId_Empresa AND DT_PERIODO = pDt_Inicial;
  END;

  UPDATE SIMUL_SEMAFORO SET DM_TERMINOU = '1' WHERE ID_USUARIO = pId_Usuario AND ID_EMPRESA = pId_Empresa AND DT_PERIODO = pDt_Inicial;
  COMMIT;

  INSERT INTO IN_LOG_IMPORTACAO (ID_ARQUIVO,
                                  ID_EMPRESA,
                                  ID_USUARIO,
                                  DT_MOVIMENTO,
                                  DS_CAMPO,
                                  DS_CONTEUDO,
                                  DS_OCORRENCIA,
                                  NR_SEQUENCIA,
                                  DS_CONTEUDO_BANCO)
                          VALUES (541,
                                  15,
                                  pId_Usuario,
                                  SYSDATE,
                                  'MATHEUS',
                                  'TERMINOU A PROCEDURE',
                                  '00',
                                  1,
                                  'IMP FROM CATWEB');
  COMMIT;
END;
/
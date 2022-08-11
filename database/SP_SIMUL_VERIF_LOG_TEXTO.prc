CREATE OR REPLACE PROCEDURE SP_SIMUL_VERIF_LOG_TEXTO (pId_Simul_Etapa IN NUMBER,
                                                      pId_Empresa     IN NUMBER,
                                                      pId_Usuario     IN NUMBER,
                                                      pDt_Inicial     IN DATE,
                                                      pDt_Final       IN DATE)
IS
  nID_SIMUL_STATUS NUMBER;
  nNR_ITEM         NUMBER;
BEGIN
  BEGIN
    SELECT ID_SIMUL_STATUS
      INTO nID_SIMUL_STATUS
      FROM SIMUL_ETAPA_STATUS
     WHERE ID_SIMUL_ETAPA = pId_Simul_Etapa
       AND ID_EMPRESA = pId_Empresa
       AND ID_USUARIO = pId_Usuario;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
       
  BEGIN
    SELECT MAX(NR_ITEM) 
      INTO nNR_ITEM
      FROM SIMUL_STATUS_LOG 
     WHERE ID_SIMUL_STATUS = nID_SIMUL_STATUS;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
  
  BEGIN
    INSERT INTO SIMUL_STATUS_LOG (ID_SIMUL_STATUS, NR_ITEM, DT_LOG, DS_TAREFA, ID_EMPRESA, ID_USUARIO )
    SELECT nID_SIMUL_STATUS, (ROWNUM + nNR_ITEM) NR_ITEM, DT_MOVIMENTO, DS_CONTEUDO, ID_EMPRESA, ID_USUARIO 
      FROM IN_LOG_IMPORTACAO 
     WHERE ID_EMPRESA = pId_Empresa 
       AND ID_USUARIO = pId_Usuario 
       AND DT_MOVIMENTO BETWEEN pDt_Inicial AND pDt_Final;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END; 
END;
/

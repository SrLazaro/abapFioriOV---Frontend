sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast) {
        "use strict";

        return Controller.extend("zov001.controller.View1", {
            onInit: function () {
            },

            onRequisicaoNormal() {
                this.executeRequests(false);
            },

            onRequisicaoBatch() {
                this.executeRequests(true);
            },

            executeRequests(bUseBatch) {
                var oModel = this.getOwnerComponent().getModel();
                // no "" > settings do manifest.json
                // "useBatch": true PODE UTILIZAR ESSE CAMPO PARA DEIXAR ATIVO OU INATIVO O BATCH
                // aqui server para ativar ou desativar o uso do batch
                oModel.setUseBatch(bUseBatch);
                
                console.log("Executando requisições");
                console.log("-------------------------------------------");

                // requisição 1
                oModel.read("/OVCabSet(1)",{
                    success: function(oData2, oResponse){
                        console.log("Leitura chave 1: OK");
                    },
                    error: function(oError){
                        console.log("Leitura chave 1: Erro");
                        console.log(oError);
                    }
                });

                // requisição 2
                oModel.read("/OVCabSet(2)",{
                    success: function(oData2, oResponse){
                        console.log("Leitura chave 2: OK");
                    },
                    error: function(oError){
                        console.log("Leitura chave 2: Erro");
                    }
                });

                // requisição 3
                oModel.remove("/OVCabSet(3)",{
                    success: function(oData2, oResponse){
                        console.log("Exclusão chave 3: OK");
                    },
                    error: function(oError){
                        console.log("Exclusão chave 3: Erro");
                    }
                });
            }
        });
    });
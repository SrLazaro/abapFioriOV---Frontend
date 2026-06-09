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
                var oView   = this.getView();
                var oFModel = new sap.ui.model.json.JSONModel();
    
                oFModel.setData({
                    "OrdemId": "",
                    "DataCriacao": "",
                    "CriadoPor": "",
                    "ClienteId": "",
                    "TotalItens": "",
                    "TotalFrete": "",
                    "TotalOrdem": "",
                    "Status": "",
                    "OrdenacaoCampo": "OrdemId",
                    "OrdenacaoTipo": "ASC"
                });
                oView.setModel(oFModel,"filter");
    
                this.onFilterSearch();
            },
            onAtualizarStatus: function(sStatus){
                var oTable   = this.getView().byId("table1");
                var oModel   = this.getOwnerComponent().getModel();
                var aIndex   = oTable.getSelectedIndices();
                var that     = this;

                if(aIndex.length == 0){
                    MessageToast.show("Selecione uma linha");
                    return;
                }

                if(aIndex.length != 1){
                    MessageToast.show("Selecione apenas uma linha");
                    return;
                }

                var oItem = oTable.getContextByIndex(aIndex[0]);
                var iOrdemId = oItem.getProperty("OrdemId");

                this.getView().setBusy(true);
                oModel.callFunction(
                    "/ZFI_ATUALIZA_STATUS",
                    {
                    method: "GET",
                    urlParameters: {
                        ID_ORDEMID: iOrdemId,
                        ID_STATUS: sStatus
                    },
                    success: function(oData, response) {
                        that.getView().setBusy(false);
                        MessageToast.show("Status atualizado com sucesso");
                        that.onFilterSearch();
                    },
                    error: function(oError) {
                        that.getView().setBusy(false);
                        MessageToast.show("Erro ao atualizar status");
                    }
                });
            },

            onFilterReset: function(){
    
            },
    
            onFilterSearch: function(oEvent){
                var oView   = this.getView();
                var oTable  = oView.byId("table1");
                var oFModel = oView.getModel("filter");
                var oFData  = oFModel.getData();
                var oFilter = null;
                var aParams = [];
    
                // aplicando filtros
                var aSorter  = [];
                var aFilters = [];
                
                if(oFData.OrdemId != ''){
                    oFilter = new sap.ui.model.Filter({
                        path: 'OrdemId',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oFData.OrdemId
                    });
                    aFilters.push(oFilter);
                }
    
                if(oFData.DataCriacao != ''){
                    oFilter = new sap.ui.model.Filter({
                        path: 'DataCriacao',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oFData.DataCriacao
                    });
                    aFilters.push(oFilter);
                }
    
                if(oFData.ClienteId != ''){
                    oFilter = new sap.ui.model.Filter({
                        path: 'ClienteId',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oFData.ClienteId
                    });
                    aFilters.push(oFilter);
                }
    
                var bDescending = false;
                if(oFData.OrdenacaoTipo == "DESC"){
                    bDescending = true;
                }
                var oSort = new sap.ui.model.Sorter(oFData.OrdenacaoCampo,bDescending);
                aSorter.push(oSort);
    
                // executando filtro
                oTable.bindRows({
                    path: '/OVCabSet',
                    sorter: aSorter,
                    filters: aFilters
                });
            }
        });
    });
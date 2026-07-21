sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "zov001/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,History,UIComponent) {
        "use strict";

        return Controller.extend("zov001.controller.OrdemForm", {
            onInit: function () {
            },

            /* deixei comentado para pegar da classe pai -> BaseController
            onProcessar: function () {
            alert("Processado com sucesso (OrdemForm)");
            },*/

            onPageBack: function(){
                var oHistory      = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    UIComponent.getRouterFor(this).navTo("RouteOrdemList");
                }
            }
        });
    });
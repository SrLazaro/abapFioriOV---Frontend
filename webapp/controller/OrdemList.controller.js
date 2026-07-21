sap.ui.define([
    "zov001/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
    "use strict";

    return Controller.extend("zov.controller.OrdemList", {

        onInit: function () {
        },

        onProcessar: function () {
            alert("Processado com sucesso (OrdemList)");
        },

        onFormulario: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteOrdemNew");
        }

    });
});

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
], (Controller, UIComponent, History) => {
    "use strict";

    return Controller.extend("zov001.controller.CustomerFormView", {

        onInit: function () {

            var oRouter = UIComponent.getRouterFor(this);

            oRouter.getRoute("RouteNewCustomer")
                .attachMatched(this._onRouteMatchedNew, this);

            oRouter.getRoute("RouteEditCustomer")
                .attachMatched(this._onRouteMatchedEdit, this);
        },

        onNavBack: function () {

            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.onView1();
            }
        },

        onView1: function () {

            var router = UIComponent.getRouterFor(this);
            router.navTo("RouteView1");
        },

        _onRouteMatchedNew: function () {

            alert("Modo de criação do cliente");
        },

        _onRouteMatchedEdit: function (oEvent) {

            var oArgs = oEvent.getParameter("arguments");
            var sCustomerId = oArgs.CustomerId;

            alert("Modo modificação do cliente " + sCustomerId);
        }
    });
});
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/base/strings/formatMessage",
    "sap/ui/core/UIComponent"
], (Controller, MessageToast, formatMessage, UIComponent) => {
    "use strict";

    return Controller.extend("zov001.controller.View1", {

        onInit: function () {

            var oView = this.getView();

            // Model de usuário
            var oUserModel = new sap.ui.model.json.JSONModel();

            var sNome = sap.ushell.Container
                .getService("UserInfo")
                .getUser()
                .getFullName();

            oUserModel.setData({
                usuario: {
                    nome: sNome
                }
            });

            oView.setModel(oUserModel, "user");
        },

        onNewCustomer: function (){

            var router = UIComponent.getRouterFor(this);
            router.navTo("RouteNewCustomer");

        },

        onEditCustomer1: function (){

            var router = UIComponent.getRouterFor(this);
            router.navTo("RouteEditCustomer", {CustomerId:1});

        }

    });

});
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/base/strings/formatMessage"
], (Controller, MessageToast, formatMessage) => {
    "use strict";

    return Controller.extend("zov001.controller.View1", {

        onInit() {

            var oView = this.getView();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({"usuario": {"nome": "ABAPer"}});
            oView.setModel(oModel);

        },

        formatWelcomeMessage: function (sMessage, sNome) {
            return formatMessage(sMessage, [sNome]);
        },

        onHelloWorldButtonPress: function () {
            MessageToast.show("Hello World");
        },
        
        onModelRefresh: function () {
            this.getView()
                .getModel()
                .refresh(true);

            /*var sMessageRefresh = this.getView()
                                      .getModel("i18n")
                                      .getResourceBundle()
                                      .getText("messageRefresh");
            
            MessageToast.show(sMessageRefresh);*/

            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var oData = this.getView().getModel().getData();

            var sMessageRefresh = oI18n.getText("messageRefresh",
                                                [oData.usuario.nome]
                                                );
            
            MessageToast.show(sMessageRefresh);

        }
    });
});
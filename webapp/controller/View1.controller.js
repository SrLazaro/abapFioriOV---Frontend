sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zov001.controller.View1", {
        onInit() {

        },

        onHelloWorldButtonPress: function () {
            MessageToast.show("Hello World");
        },
        
        onModelRefresh: function () {
            this.getView()
                .getModel()
                .refresh(true);

        }
    });
});
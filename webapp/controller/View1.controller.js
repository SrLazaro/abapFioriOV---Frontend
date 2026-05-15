sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/base/strings/formatMessage"
], (Controller, MessageToast, formatMessage) => {
    "use strict";

    return Controller.extend("zov001.controller.View1", {

        /*onInit() {

            var oView = this.getView();

            // Model padrão da View
            var oModel = new sap.ui.model.json.JSONModel();

            var sNome = sap.ushell.Container
                .getService("UserInfo")
                .getUser()
                .getFullName();

            oModel.setData({
                usuario: {
                    nome: sNome
                }
            });

            oView.setModel(oModel);

            // Model nomeado "dados"
            var oModelDados = new sap.ui.model.json.JSONModel();

            oModelDados.setData({
                usuario: {
                    nome: "bob marley"
                }
            });

            oView.setModel(oModelDados, "dados");

        }*/
       
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

        // Model "dados"
        var oDadosModel = new sap.ui.model.json.JSONModel();

        oDadosModel.setData({
            usuario: {
                nome: "bob marley"
            }
        });

        oView.setModel(oDadosModel, "dados");

        // Data Binding - OneWay

        var oModel1 = new sap.ui.model.json.JSONModel();
        oModel1.setData(
            {
                "funcionario": {
                    "nome": "Zero" 
                }
            }
        );
        oModel1.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

        // Data Binding - TwoWay

        var oModel2 = new sap.ui.model.json.JSONModel();
        oModel2.setData(
            {
                "funcionario": {
                    "nome": "Megaman"
                }
            }
        );
        oModel2.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

        // Data Binding - One Time

        var oModel3 = new sap.ui.model.json.JSONModel();
        oModel3.setData(
            {
                "funcionario": {
                    "nome": "Axl"
                }
            }
        );
        oModel3.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);


        oView.setModel(oModel1, "oneway");
        oView.setModel(oModel2, "twoway");
        oView.setModel(oModel3, "onetime");


    },

        onTestOneWay: function (){

            var oView = this.getView();
            var oModel = oView.getModel("oneway");
            var oData = oModel.getData();

            oData.funcionario.nome += "!";

            oModel.setData(oData);
            //oView.setModel(oModel, "oneway");
        },

        onTestTwoWay: function (){

            var oView = this.getView();
            var oModel = oView.getModel("twoway");
            var oData = oModel.getData();

            oData.funcionario.nome += "!";

            oModel.setData(oData);
            //oView.setModel(oModel, "twoway");

        },

        onTestOneTime: function (){

            var oView = this.getView();
            
            var oModel = oView.getModel("onetime");
            var oData = oModel.getData();

            debugger;

            oData.funcionario.nome += "?";
            oModel.setData(oData);
            //oView.setModel(oModel, "onetime");

        },

        onTestarDaMassa: function () {

            // =========================
            // MODEL I18N
            // =========================

            var oI18n = this.getView()
                .getModel("i18n")
                .getResourceBundle();

            var sText = oI18n.getText("testadaMarota");
            var sSeparador = oI18n.getText("separador");

            console.log("Texto i18n:");
            console.log(sText);

            console.log(sSeparador);

            // =========================
            // MODEL USUARIOS
            // =========================

            var oUsuariosModel = this.getOwnerComponent()
                .getModel("usuarios");

            var oUsuariosData = oUsuariosModel.getData();

            console.log("Model usuários:");
            console.log(oUsuariosData);

            console.log(sSeparador);

            // =========================
            // MODEL ODATA
            // =========================

            var oServiceModel = this.getOwnerComponent()
                .getModel();

            oServiceModel.read("/OVCabSet", {

                success: function (oData, oResponse) {

                    console.log("Dados retornados do serviço:");

                    console.log(oData);
                    console.log(oResponse);

                },

                error: function (oErro) {

                    console.log("Deu erro:");

                    console.log(oErro);

                }

            });

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

            var oI18n = this.getView()
                .getModel("i18n")
                .getResourceBundle();

            var oData = this.getView()
                .getModel()
                .getData();

            var sMessageRefresh = oI18n.getText(
                "messageRefresh",
                [oData.usuario.nome]
            );

            MessageToast.show(sMessageRefresh);

        }

    });

});
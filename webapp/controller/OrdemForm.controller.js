sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,formatter,History,UIComponent) {
        "use strict";

        return Controller.extend("zov001.controller.OrdemForm", {
            formatter: formatter,

            formMode: "I",

            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrdemNew").attachMatched(this._onRouteMatchedNew,this);
                oRouter.getRoute("RouteOrdemEdit").attachMatched(this._onRouteMatchedEdit,this);
            },

            liveChangeItemQuantity: function(oEvent){
                var _oInput = oEvent.getSource();
                var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
                _oInput.setValue(val);

                this.recalcOrder();
            },

            liveChangePrice: function(oEvent){
                var _oInput = oEvent.getSource();
                var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');

                if(val == ""){
                    _oInput.setValue(val);
                    return;
                }

                // removendo zero a esquerda
                val = val.replace(/^0+/, '');

                var length = val.length;
                if(length == 1){
                    val = "0.0"+val;
                }else if(length == 2){
                    val = "0."+val;
                }else if(length > 2){
                    val = val.slice(0,length-2)+"."+val.slice(-2);
                }else{
                    val = "";
                }

                // GAMBIARRA para atualizar o model usando formatação e liveUpdate ao mesmo tempo
                // caso encontre uma solução melhor, faço o ajuste no futuro
                
                //_oInput.setValue(val);

                var oView      = this.getView();
                var oModel     = oView.getModel();
                var oData      = oModel.getData();
                var oContext   = _oInput.getBindingContext();
                var sInputPath = _oInput.mBindingInfos.value.binding.sPath;
                //debugger;
                
                if(sInputPath == "/TotalFrete"){
                    // TotalFrete
                    oData.TotalFrete = parseFloat(val);
                }else{
                    //var oObject = oContext.getObject();
                    var sPath  = oContext.getPath();
                    var aPath  = sPath.split("/");
                    var iIndex = [];

                    // PrecoUni
                    if(sInputPath == "PrecoUni"){
                        iIndex = parseInt(aPath[2]);
                        oData.toOVItems[iIndex].PrecoUni = parseFloat(val);
                    }
                }

                this.recalcOrder();
            },

            recalcOrder: function(){
                var oView  = this.getView();
                var oModel = oView.getModel();
                var oOrdem = this.getOrderObject();
                oModel.setData(oOrdem);
                oView.setModel(oModel);
            },

            onNewItem: function(){
                var oView     = this.getView();
                var oModel    = oView.getModel();
                var oOrdem    = oModel.getData();
                var atoOVItems = oOrdem.toOVItems;

                var lastItemId = 0;
                for(var i in atoOVItems){
                    if(atoOVItems[i].ItemId > lastItemId){
                        lastItemId = atoOVItems[i].ItemId;
                    }
                }

                // clonando objeto
                var item = this.createEmptyItem();

                item.ItemId = lastItemId + 1;

                atoOVItems.push(item);
                oOrdem.toOVItems = atoOVItems;

                oModel.setData(oOrdem);
                oView.setModel(oModel);
            },

            onDeleteItem: function(oEvent){
                var oSource   = oEvent.getSource();
                var sItemId   = oSource.data("ItemId");

                var oView     = this.getView();
                var oModel    = oView.getModel();
                var oOrdem    = oModel.getData();
                var atoOVItems = oOrdem.toOVItems;

                for(var i in atoOVItems){
                    if(atoOVItems[i].ItemId == sItemId){
                        atoOVItems.splice(i,1);
                        break;
                    }
                }

                oOrdem.toOVItems = atoOVItems;
                oModel.setData(oOrdem);
                oView.setModel(oModel);

                this.recalcOrder();
            },

            getOrderObject: function(){
                var oView  = this.getView();
                var oModel = oView.getModel();
                var oOrdem = oModel.getData();

                // cabeçalho
                oOrdem.OrdemId    = this.parseInt(oOrdem.OrdemId);
                oOrdem.TotalFrete = this.parsePrice(oOrdem.TotalFrete);
                
                // itens
                oOrdem.TotalItens = 0;
                for(var i in oOrdem.toOVItems){
                    oOrdem.toOVItems[i].Quantidade = this.parseInt(oOrdem.toOVItems[i].Quantidade);
                    oOrdem.toOVItems[i].PrecoUni   = this.parsePrice(oOrdem.toOVItems[i].PrecoUni);
                    oOrdem.toOVItems[i].PrecoTot   = oOrdem.toOVItems[i].Quantidade * oOrdem.toOVItems[i].PrecoUni;

                    oOrdem.TotalItens = oOrdem.TotalItens + oOrdem.toOVItems[i].PrecoTot;
                }
                oOrdem.TotalOrdem = oOrdem.TotalItens + oOrdem.TotalFrete;

                return oOrdem;
            },

            getOrderOData: function(){
                var oOrdem = this.getOrderObject();

                // cabeçalho
                if(oOrdem.OrdemId == ""){
                    oOrdem.OrdemId = 0;
                }
                oOrdem.ClienteId = this.parseInt(oOrdem.ClienteId);

                oOrdem.TotalItens = oOrdem.TotalItens.toFixed(2);
                oOrdem.TotalFrete = oOrdem.TotalFrete.toFixed(2);
                oOrdem.TotalOrdem = oOrdem.TotalOrdem.toFixed(2);

                // items
                for(var i in oOrdem.toOVItems){
                    oOrdem.toOVItems[i].PrecoUni = oOrdem.toOVItems[i].PrecoUni.toFixed(2);
                    oOrdem.toOVItems[i].PrecoTot = oOrdem.toOVItems[i].PrecoTot.toFixed(2);
                }

                return oOrdem;
            },

            createEmptyOrderObject: function(){
                var oOrdem = {
                    OrdemId: "",
                    DataCriacao: null,
                    CriadoPor: "",
                    ClienteId: "",
                    TotalItens: 0.0,
                    TotalFrete: 0,
                    TotalOrdem: 0.0,
                    Status: "",
                    toOVItems: []
                };
                return oOrdem;
            },

            createEmptyItem: function(){
                var oItem = {
                    ItemId: 0,
                    Material: "",
                    Descricao: "",
                    Quantidade: "",
                    PrecoUni: "",
                    PrecoTot: ""
                };
                return oItem;
            },

                        onDelete: function(){
                var oOrdem = this.getOrderOData();
                var that   = this;

                if(oOrdem.OrdemId == 0){
                    MessageToast.show("Só é possível deletar uma ordem que existe");
                    return;
                }

                this.onDeleteOrder(oOrdem.OrdemId,function(sStatus){
                    if(sStatus=="S"){
                        // limpando dados da tela
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                        oModel.setData(that.createEmptyOrderObject());
                        that.getView().setModel(oModel);

                        // redirecionando para a listagem
                        sap.ui.core.UIComponent.getRouterFor(that).navTo("RouteOrdemList");
                    }
                });
            },

onSave: function(){
                var that     = this;
                var oView    = this.getView();
                var oModel1  = this.getOwnerComponent().getModel();
                var oModel2  = oView.getModel();
                var oOrdem   = this.getOrderOData();
                
                // validações
                var oClienteId = this.getView().byId("OVCab.ClienteId");
                oClienteId.setValueState("None");

                if(oOrdem.ClienteId == 0){
                    oClienteId.setValueState("Error");
                    MessageToast.show("Cliente vazio");
                    return;
                }

                 oView.setBusy(true);
                if(this.formMode == "I"){
                   
                    oModel1.create("/OVCabSet",oOrdem,{
                        success: function(oData, oResponse){
                            // ajustando itens que voltam dentro do campo results
                            oData.toOVItems = oData.toOVItems.results;

                            oModel2.setData(oData);
                            if(oResponse.statusCode == 201){
                                // bloqueando campos
                                oView.byId("OVCab.DataCriacao").setEditable(false);
                                oView.byId("OVCab.CriadoPor").setEditable(false);
                                oView.byId("bt-delete").setVisible(false);
                                
                                MessageToast.show("Ordem cadastrada com sucesso");
                            }else{
                                MessageToast.show("Erro ao salvar");    
                            }

                            oView.setBusy(false);
                        },
                        error: function(oResponse){
                            var oError = JSON.parse(oResponse.responseText);
                            MessageToast.show(oError.error.message.value);
                            oView.setBusy(false);
                        }}
                    );
                }else{
                    
                    // com deep entity, o método create é usado para atualizar também
                    oModel1.create("/OVCabSet",oOrdem,{
                        success: function(oData, oResponse){
                            if(oResponse.statusCode == 204 || oResponse.statusCode == 201){
                                MessageToast.show("Ordem atualizada com sucesso");
                            }
                            oView.setBusy(false);
                        },
                        error: function(oResponse){
                            var oError = JSON.parse(oResponse.responseText);
                            MessageToast.show(oError.error.message.value);
                            oView.setBusy(false);
                        }}
                    );
                }
            },

            _onRouteMatchedNew: function(oEvent){
                var oView = this.getView();

                this.formMode = "I";

                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                oModel.setData(this.createEmptyOrderObject());
                oView.setModel(oModel);

                oView.byId("OVCab.DataCriacao").setEditable(true);
                oView.byId("OVCab.CriadoPor").setEditable(true);
                oView.byId("OVCab.ClienteId").setValueState("None");
                oView.byId("bt-delete").setVisible(false);

                this.recalcOrder();
            },

        _onRouteMatchedEdit: function(oEvent){
                var that     = this;
                var oView    = this.getView();
                var oArgs    = oEvent.getParameter("arguments");
                var sOrdemId = oArgs.OrdemId;
                var oModel   = this.getOwnerComponent().getModel();
                var oModel1  = null;

                this.formMode = "U";
                
                // limpando dados
                oModel1 = new sap.ui.model.json.JSONModel(this.createEmptyOrderObject());
                oModel1.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

                oView.byId("OVCab.DataCriacao").setEditable(false);
                oView.byId("OVCab.CriadoPor").setEditable(false);
                oView.byId("OVCab.ClienteId").setValueState("None");
                oView.byId("bt-delete").setVisible(true);
                
                oView.setBusy(true);

                // cabeçalho
                oModel.read("/OVCabSet("+sOrdemId+")",{
                    success: function(oOrdem, oResponse){
                        // items
                        oModel.read("/OVCabSet("+sOrdemId+")/toOVItems",{
                            success: function(oData, oResponse){
                                oOrdem.toOVItems = oData.results;
                                oModel1.setData(oOrdem);
                                oView.setModel(oModel1);
                                
                                that.recalcOrder();
                                oView.setBusy(false);
                            },
                            error: function(oError){
                                var oError = JSON.parse(oResponse.responseText);
                                MessageToast.show(oError.error.message.value);
                                oView.setBusy(false);
                            }
                        });
                    },
                    error: function(oResponse){
                        var oError = JSON.parse(oResponse.responseText);
                        MessageToast.show(oError.error.message.value);
                        oView.setBusy(false);
                    }
                });
            },


            parseInt: function(sValue){
                if(sValue == "" || sValue == null || sValue == undefined){
                    return 0;
                }
    
                sValue = parseInt(sValue);
                if(sValue == null || isNaN(sValue)){
                    sValue = 0;
                }
                return sValue;
            },
    
            parsePrice: function(sValue){
                if(sValue == "" || sValue == null || sValue == undefined){
                    return 0.00;
                }
    
                if(typeof(sValue) == "number"){
                    return sValue;
                }

                sValue = sValue.toString();

                if(sValue.indexOf(",") === -1){
                    return parseFloat(sValue);
                }
    
                sValue = sValue.toString().replaceAll(/[^0-9\.\,]/g,'');
                sValue = sValue.replace(/^0+/, '');
                sValue = sValue.replace(".","");
                sValue = sValue.replace(",",".");
                return parseFloat(sValue);
            },
    
            formatPrice: function(fPrice){
                if(typeof(fPrice) != "number"){
                    return "0,00";
                }
                var sPrice = fPrice.toFixed(2);
                sPrice = sPrice.replace(".",",");
                return sPrice;
            },

            onPageBack: function(){
                var oHistory      = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    UIComponent.getRouterFor(this).navTo("RouteOrdemList");
                }
            },

                        onDeleteOrder: function(iOrdemId,callback){
                var oModel1 = this.getOwnerComponent().getModel();
                var oView   = this.getView();
                
                oView.setBusy(true);
                oModel1.remove("/OVCabSet("+iOrdemId+")",{
                    success: function(oData2, oResponse){
                        if(oResponse.statusCode == 204){
                            MessageToast.show("Deletado com sucesso");
                        }else{
                            MessageToast.show("Erro em deletar");
                        }
    
                        oView.setBusy(false);
                        callback("S");
                    },
                    error: function(oResponse){
                        var oError = JSON.parse(oResponse.responseText);
                        MessageToast.show(oError.error.message.value);
                        oView.setBusy(false);
                        callback("E");
                    }}
                );
            }

        });
    });
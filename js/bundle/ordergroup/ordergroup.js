/**
 * Created by Misha on 09.04.2015.
 */
define([
        "app", "model/user", "moment", "common/custom-paginator",
        "backbone.paginator", "backgrid", "backgrid.paginator",
        "text!bundle/ordergroup/tpl/buyer-ordergroup-full.html", "text!bundle/ordergroup/tpl/buyer-ordergroup-full-odr-item.html"

    ],
    function (App, Data, Moment, Custom,
              BackbonePaginator, Backgrid, BackgridPaginator,
              buyerCurrentOrderGroupsFullTpl, buyerCurrentOrderGroupsFullOrderItemTpl
              ) {

        App.module("Ordergroup", function (Ordergroup, App, Backbone, Marionette, $, _) {

            BuyerOrder = Backbone.Model.extend({
                defaults:
                {
                    check: true
                },
                urlRoot: 'rest/v0/order'
            });



            BuyerOrdersCollection = Backbone.Collection.extend({
                model: BuyerOrder,
                url: function () {
                    return 'rest/v0/ordergroup/' + idOrderGroup + '/orders'
                },
                read: function(options){
                    defOptions = {"url":this.url(), "error": onErrorHttpRequest};
                    options == undefined ? options=defOptions: _.extend(options,defOptions);
                    this.fetch(options);
                }
            });

            var buyerOrders = new BuyerOrdersCollection();
            // TODO модель полной доставки
            var BuyerOrderGroup = Backbone.Model.extend({
                defaults: {
                    comment: "",
                    shipmentDate: "",
                    state:"CREATED",

                    creationTime:"",
                    shop:{
                        id:"",
                        name:""
                    },
                     itemCount:0,
                    itemPrice:0,
                    name:"",
                    itemDiscount:0,
                    shipmentPrice:0,
                    shipmentType:"SHIPMENT_TYPE_1",
                    totalPrice:0

                },
                urlRoot: function () {
                    return 'rest/v0/ordergroup';
                }

            });

            // TODO представление заказа в полной доставке
            var BuyerCurrentOrderGroupsFullOrderItemView = Marionette.ItemView.extend({
                template: _.template(buyerCurrentOrderGroupsFullOrderItemTpl),
                tagName: "tr",
                events:{
                "click input[type='checkbox']": "checkFlag"
                },
                serializeData: function () {
                    var state = this.model.get("state");
                    var objModel = this.model.toJSON();
                    var advancedObj = {
                        "statePop": App.Data.stateViews[state].statepop || "",
                        "stateImg": App.Data.stateViews[state].stateimg || ""
                    };
                    _.extend(objModel, advancedObj);
                    return objModel;
                },
                checkFlag: function (e) {
                    this.model.set("check", e.target.checked);
                }
            });

            // TODO представление раскрытой доставки с полной информацией
            var OrderGroupsFull = Marionette.CompositeView.extend({
                template: _.template(buyerCurrentOrderGroupsFullTpl),
                childView: BuyerCurrentOrderGroupsFullOrderItemView,
                childViewContainer: "tbody",
                events:{
                "click #btn-order-ordergroup-cancel": "onOrdersCanceled"
                },

                initialize: function () {
                    this.listenTo(this.model, "change", this.onModelChange);
                },
                onModelChange: function () {
                    var rendering = !(this.model.changed.check && _.values(this.model.changed).length == 1);
                    if (!rendering) return;
                    this.render();
                },
                serializeData: function () {
                    var state = stateOrderGroup(this.model);
                    var shType = this.model.get("shipmentType");
                    var objModel = this.model.toJSON();
                    if (shType){
                    var advancedObj = {
                        "shipmentTypeImg": App.Data.shipmentViews[shType].shipmentTypeImg  || "fa fa-2x fa-beer",
                        "shippmentPop": App.Data.shipmentViews[shType].shipmentpop || "",
                        "statePop": App.Data.stateViews[state].statepop || "",
                        "stateImg": App.Data.stateViews[state].stateimg || ""
                    };
                    _.extend(objModel, advancedObj);
                    };
                    return objModel;
                },
                onOrdersCanceled: function(e){
                    var CanceledOrders = buyerOrders.where({check:true});
                    if (CanceledOrders.length>0){
                        require(["bundle/modal/modal"],
                            function(Modal) {
                                App.Wreqr.setHandler("modal:yes", function(){
                                    CanceledOrders.forEach(function (model) {
                                        model.set({"state": "REJECTED_BY_BUYER", "check": false});
                                        model.save({patch:true});
                                    });
                                    modelOrderGroupLine = new BuyerOrderGroup({'id': idOrderGroup});
                                    stateOrderGroup(modelOrderGroupLine);
                                });
                                App.Wreqr.setHandler("modal:no", function(){
                                    console.log("No");
                                });
                                new Modal.View({text: "Вы уверены что хотите отменить выбранные заказы?", yes:"Да!!!", no: "No"});
                            }
                        );
                    }
                }
            });

            // TODO представдение раскрытой доставки с полной информацией
            Ordergroup.ContainerView = Marionette.LayoutView.extend({
                template: _.template("<div class=\"modal-dialog modal-lg\" id=\"orderGroupFullModal\"></div>"),
                initialize: function (id) {
                    idOrderGroup = id;
                    modelOrderGroupLine = new BuyerOrderGroup({id:idOrderGroup});
                    modelOrderGroupLine.fetch({reset: true, wait: true});
                },
                regions: {
                    region: '#orderGroupFullModal'
                },
                onShow: function () {
                    ordersRefresh();
                    this.render();
                    this.region.show(new OrderGroupsFull({model: modelOrderGroupLine, collection: buyerOrders}));
                }
            });

            var ordersRefresh = function () {
                buyerOrders.read();
            };
            var onErrorHttpRequest = function (xhr,status,thrown){
                if (status == 403 ) {
                    Data.user.set("loggedIn", false);
                    Data.user.trigger("change");
                }
            }
            var stateOrderGroup = function (model) {
                var result = "ACKNOWLEDGED";
                if (model.has("orders")) {
                    var orders = model.get("orders");
                    var acceptOrders = _.where(orders, {state: "ACCEPTED"});
                    if (acceptOrders.length == orders.length) result = "ACCEPTED";
                }
                return result;
            }
            var idOrderGroup = "";
            var previewRoute = "";
            var modelOrderGroupLine = "";
            Ordergroup.onStart = function () {

                console.log("ordergroup view started");
            };

            Ordergroup.onStop = function () {
                console.log("ordergroup view stopped");
            };

        });
        return App.Ordergroup;
    });

define([
    "app"
], function(App) {
    'use strict';
    return App.module("Categories.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controller >>> Categories');
            },

            shopInfo: function(id) {
                require([
                    "bundle/shop-info/shop-info",
                    "bundle/shop-info/model/shop-info"
                ], function(ShopInfo, Data){
                    Data.ShopInfo.set('id', id);

                    Data.ShopInfo.fetch({reset:true}).done(function(){
                        App.getMainRegion().show(new ShopInfo.Info({
                            model: Data.ShopInfo
                        }));
                    });

                });
            },

            shopShipment: function(id) {
                require([
                    "bundle/shop-info/shop-info",
                    "bundle/shop-info/model/shop-info",
                    "model/shipments"
                ], function(ShopInfo, Data){
                    Data.ShopShipment.set('id', id);

                    Data.ShopShipment.fetch({reset:true}).done(function(){
                        _.map(Data.ShipmentsPrototype.models, function(model) {
                            for (var i = 0; i < Data.ShopShipment.attributes.shipments.length; ++i) {
                                if (Data.ShopShipment.attributes.shipments[i].type == model.get('id')) {
                                    Data.ShopShipment.attributes.shipments[i].name = model.get('shipmentpop');
                                    Data.ShopShipment.attributes.shipments[i].classIcon = model.get('shipmentTypeImg');
                                    break;
                                }
                            }
                        });

                        console.log(Data.ShopShipment)

                        App.getMainRegion().show(new ShopInfo.Shipment({
                            model: Data.ShopShipment
                        }));
                    });

                });
            },

            shopConditions: function(id) {
                require([
                    "bundle/shop-info/shop-info",
                    "bundle/shop-info/model/shop-info"
                ], function(ShopInfo, Data){
                    Data.ShopConditions.set('id', id);

                    Data.ShopConditions.fetch({reset:true}).done(function(){
                        App.getMainRegion().show(new ShopInfo.Conditions({
                            model: Data.ShopConditions
                        }));
                    });

                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "shop-info/info/:id": "shopInfo",
            "shop-info/shipment/:id": "shopShipment",
            "shop-info/conditions/:id": "shopConditions"
        });

    });

});
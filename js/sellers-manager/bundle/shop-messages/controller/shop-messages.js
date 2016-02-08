'use strict';

define(['app'],function(App){
    return App.module("ShopMessages.Controller", function (Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controllers >>> load');
            },

            shopMessages: function(id){
                require(["bundle/shop-messages/shop-messages", "bundle/shop-messages/model/shop-messages", "model/shop"], function(ShopMessages, Data) {
                    // TODO: получение с сервера списка магазинов с открытыми тикетами 
                    Data.Shop.set({
                        id: id,
                        name: 'Магазин 1'
                    });

                    Data.ShopMessages.reset([
                        {
                            number: 111112,
                            newMessages: 3,
                            lastDate: '12.12.2012',
                            theme: 'Решение проблем с корзиной',
                            closed: false
                        },
                        {
                            number: 1112332,
                            newMessages: 0,
                            lastDate: '12.12.2012',
                            theme: 'Какой-то тикет',
                            closed: true
                        }
                    ])

                    App.mainRegion.show(new ShopMessages.View());
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "shop-messages/:id": 'shopMessages'
        });
    });

});
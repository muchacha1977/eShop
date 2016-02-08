'use strict';

define([
    'app',
    'bundle/messages/controller/messages',
    'bundle/shop-messages/controller/shop-messages'
],function(App){
    return App.module("Controller", function (Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controllers >>> load');
            },

            home: function(){
                require(["bundle/app/home", "model/shops"], function(Home, Data) {
                    // TODO: получение с сервера списка магазинов
                    Data.Shops.reset([
                        {
                            id: '1a',
                            name: 'ООО Солнышко',
                            manager: 'Алексей Викторович Титков',
                            rate: '1',
                            balance: 1000,
                            turnover: 100000,
                            active: 0
                        },
                        {
                            id: '2b',
                            name: 'ООО Солнышко',
                            manager: 'Алексей Викторович Титков',
                            rate: '1',
                            balance: 1000,
                            turnover: 100000,
                            active: 1
                        },
                        {
                            id: '3c',
                            name: 'ООО Солнышко',
                            manager: 'Алексей Викторович Титков',
                            rate: '1',
                            balance: 1000,
                            turnover: 100000,
                            active: 0
                        },
                        {
                            id: '4d',
                            name: 'ООО Солнышко',
                            manager: 'Алексей Викторович Титков',
                            rate: '1',
                            balance: 1000,
                            turnover: 100000,
                            active: 0
                        },
                        {
                            id: '5e',
                            name: 'ООО Солнышко',
                            manager: 'Алексей Викторович Титков',
                            rate: '1',
                            balance: 1000,
                            turnover: 100000,
                            active: 1
                        },
                        {
                            id: '6f',
                            name: 'ООО Солнышко',
                            manager: 'Алексей Викторович Титков',
                            rate: '1',
                            balance: 1000,
                            turnover: 100000,
                            active: 0
                        },
                        {
                            id: '7g',
                            name: 'ООО Солнышко',
                            manager: 'Алексей Викторович Титков',
                            rate: '1',
                            balance: 1000,
                            turnover: 100000,
                            active: 1
                        },
                        {
                            id: '8h',
                            name: 'ООО Солнышко',
                            manager: 'Алексей Викторович Титков',
                            rate: '1',
                            balance: 1000,
                            turnover: 100000,
                            active: 0
                        },
                    ]);

                    App.mainRegion.show(new Home.View());
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "": "home",
            "home": "home"
        });

        App.Router.onRoute = function(route){
            $('.manager-menu a').removeClass('active');

            _.delay(function () {
                if (route == 'home' || route == '') {
                    $('.manager-menu .to-sellers').addClass('active');
                }
                if (route == 'messages' || route == 'shopMessages') {
                    $('.manager-menu .to-messages').addClass('active');
                }
            }, 100);
        };
    });

});
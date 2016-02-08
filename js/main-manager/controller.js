'use strict';

define([
    'app',
    'bundle/managers/controller/managers'
    //'bundle/new-sellers/controller/new-sellers'
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
                            contactManager: 'Иванов И.И.',
                            phone: '+7 (900) 666 2233',
                            active: 1,
                            repair: 0
                        },
                        {
                            id: '2b',
                            name: 'ООО Солнышко',
                            contactManager: 'Иванов И.И.',
                            phone: '+7 (900) 666 2233',
                            active: 1,
                            repair: 0
                        },
                        {
                            id: '3c',
                            name: 'ООО Солнышко',
                            contactManager: 'Иванов И.И.',
                            phone: '+7 (900) 666 2233',
                            active: 1,
                            repair: 0
                        },
                        {
                            id: '4d',
                            name: 'ООО Солнышко',
                            contactManager: 'Иванов И.И.',
                            phone: '+7 (900) 666 2233',
                            active: 1,
                            repair: 0
                        },
                        {
                            id: '5e',
                            name: 'ООО Солнышко',
                            contactManager: 'Иванов И.И.',
                            phone: '+7 (900) 666 2233',
                            active: 1,
                            repair: 1
                        },
                        {
                            id: '6f',
                            name: 'ООО Солнышко',
                            contactManager: 'Иванов И.И.',
                            phone: '+7 (900) 666 2233',
                            active: 1,
                            repair: 0
                        },
                        {
                            id: '7g',
                            name: 'ООО Солнышко',
                            contactManager: 'Иванов И.И.',
                            phone: '+7 (900) 666 2233',
                            active: 1,
                            repair: 0
                        },
                        {
                            id: '8h',
                            name: 'ООО Солнышко',
                            contactManager: 'Иванов И.И.',
                            phone: '+7 (900) 666 2233',
                            active: 1,
                            repair: 1
                        }
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
                    $('.manager-menu .to-new-sellers').addClass('active');
                }
                if (route == 'allSellers') {
                    $('.manager-menu .to-all-sellers').addClass('active');
                }
                if (route == 'managers') {
                    $('.manager-menu .to-managers').addClass('active');
                }
            }, 100);
        };
    });

});
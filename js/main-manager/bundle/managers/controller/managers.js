'use strict';

define(['app'],function(App){
    return App.module("Managers.Controller", function (Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controllers >>> load');
            },

            managers: function(){
                require(["bundle/managers/managers", "bundle/managers/model/managers"], function(Managers, Data) {
                    // TODO: получение с сервера списка магазинов
                    Data.Managers.reset([
                        {
                            id: '1a',
                            name: 'Сергей Семенов',
                            shopsCount: 7,
                            phone: '8 (916) 315 8956'
                        },
                        {
                            id: '1b',
                            name: 'Сергей Семенов',
                            shopsCount: 7,
                            phone: '8 (916) 315 8956'
                        },
                        {
                            id: '1c',
                            name: 'Сергей Семенов',
                            shopsCount: 7,
                            phone: '8 (916) 315 8956'
                        }
                    ]);

                    App.mainRegion.show(new Managers.View());
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "managers": "managers"
        });
    });

});
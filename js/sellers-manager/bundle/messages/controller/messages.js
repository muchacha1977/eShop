'use strict';

define(['app'],function(App){
    return App.module("Messages.Controller", function (Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controllers >>> load');
            },

            messages: function(){
                require(["bundle/messages/messages", "bundle/messages/model/messages"], function(Messages, Data) {
                    // TODO: получение с сервера списка магазинов с открытыми тикетами 
                    Data.Messages.reset([
                        {
                            id: '1a',
                            name: 'Магазин 1',
                            tickets: 2
                        },
                        {
                            id: '1b',
                            name: 'Магазин 2',
                            tickets: 4
                        },
                        {
                            id: '1c',
                            name: 'Магазин 3',
                            tickets: 5
                        }
                    ]);

                    App.mainRegion.show(new Messages.View());
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "messages": "messages"
        });
    });

});
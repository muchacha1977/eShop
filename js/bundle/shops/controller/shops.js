define([
    "app"
], function(App) {
    'use strict';
    return App.module("Shops.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controller >>> Shops');
            },
            shop: function(id){
                require([
                    "model/catalog"
                ], function(Data){
                    var category = Data.Catalog.ProdListCollection.category ? Data.Catalog.ProdListCollection.category : '-';
                    var query = Data.Catalog.ProdListCollection.query ? Data.Catalog.ProdListCollection.query : '-';
                    App.Router.navigate('prodlist/' + category + '/' + id + '/' + query, {trigger: true});
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "shop/:id": "shop"
        });
    });
});
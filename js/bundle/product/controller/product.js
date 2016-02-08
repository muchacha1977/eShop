define([
    "app"
], function(App) {
    'use strict';
    return App.module("Product.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controller >>> Product');
            },
            product: function(id){
                require([
                    "bundle/product/product",
                    "bundle/product/model/product"
                ], function(Product, Data){
                    Data.Product.set('id', id);
                    App.getMainRegion().show(new Product.Container({
                        model: Data.Product
                    }));

                    Data.Product.set('id', id);
                    Data.Product.fetch({reset: true});

                    Data.OffersCollection.id = id;
                    Data.OffersCollection.fetch({reset: true});
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "product/:id": "product"
        });

    });

});

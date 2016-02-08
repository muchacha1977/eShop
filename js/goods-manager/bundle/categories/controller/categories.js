define(["app"], function(App) {
    'use strict';
    return App.module("Categories.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controller >>> Categories');
            },
            showAllCategories: function(id){
                require([
                    "bundle/categories/categories",
                    "model/categories"
                ], function(Categories, Data){
                    Data.Categories.id = id ? id : null

                    Data.Categories.fetch({reset:true}).done(function(result){
                        if (!result.length) {
                            var path = id ? 'goods/' + id : 'home';
                            return App.Router.navigate(path, {trigger: true});
                        }
                        App.getMainRegion().show(new Categories.View({
                            collection: Data.Categories
                        }));
                    });

                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "categories": "showAllCategories",
            "categories/:id": "showAllCategories"
        });

    });

});
define([
    "app"
], function(App) {
    'use strict';
    return App.module("UserCategories.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controller >>> UserCategories');
            },
            showCategories: function(){
                require([
                    "bundle/user-categories/user-categories",
                    "model/categories"
                ], function (UserCategories, Data) {
                    Data.CategoriesWithChars.id = null;
                    Data.CategoriesWithChars.fetch({reset: true}).done(function () {
                        _.each(Data.CategoriesWithChars.models, function (model) {
                            if (!model.get('characteristics')) {
                                model.set('characteristics', []);
                            }
                        });

                        App.getMainRegion().show(new UserCategories.View());
                    });
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "my-categories": "showCategories",
            "my-categories/": "showCategories"
        });

    });

});
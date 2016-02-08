define([
    "app", "model/catalog"
], function(App, CatalogData) {
    'use strict';
    return App.module("Categories.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controller >>> Categories');
            },
            showAllCategories: function(){
                require([
                    "bundle/categories/categories",
                    "bundle/categories/model/categories"
                ], function(Categories, Data){
                    CatalogData.Catalog.ProdListCollection.category = null;
                    CatalogData.Catalog.ProdListCollection.shop = null;
                    CatalogData.Catalog.ProdListCollection.query = null;

                    App.vent.trigger("change:searchType");
                    App.vent.trigger("change:query");

                    //describe the shop zone
                    $('#breadcrumbToShopLi').hide();
                    $('#closeShop').hide();

                    //remove current shop name
                    Data.ShopInfo.set('name', ''); 

                    Data.Categories.fetch({reset:true}).done(function(){
                        App.getMainRegion().show(new Categories.Container({
                            collection: Data.Categories
                        }));
                    });

                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "categories": "showAllCategories",
            "categories/": "showAllCategories"
        });

    });

});
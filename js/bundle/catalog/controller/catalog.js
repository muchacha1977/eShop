/**
 * Created by GOODPROFY on 30.07.2015.
 */
define([
    "app",
    "bundle/catalog/model/catalog"
], function(App) {
    'use strict';

    return App.module("Controller", function(Controller, App, Backbone, Marionette, $, _) {

        this.pageCatalog = function(path, query){
            console.log(path, query);
            if ( path != null ){
                var regexp = /\.html$/i;
                var lastId = _.last(path.split('/'));
                if ( regexp.test(lastId) ){
                    var pid = lastId.replace(regexp, '');
                    require(["bundle/catalog/product"], function(){
                        App.Catalog.Product.start({ id: pid });
                    });
                }else{
                    require(["bundle/catalog/category"], function(){
                        App.Catalog.Category.start({id: lastId, s: App.Shops.getShop()});
                    });
                }
            }else{
                if ( query == null ){
                    require(["bundle/catalog/categories"], function(){
                        App.Breadcrumbs.reset();
                        App.Catalog.Categories.start();
                    });
                }else{
                    var params = App.QUERY_STRING(query);
                    require(["bundle/catalog/category"], function(){
                        App.Catalog.Category.start({id: null, q: params.q});
                    });
                }

            }
        };

        this.pageCategory = function(cat){
            require(["bundle/catalog/categories"], function(){
                var resCollection = new Backbone.Collection();
                var value = App.Catalog.Model.Branches.findWhere({name: cat});
                if (_.isUndefined(value) ) Controller.pageCatalog(cat);
                resCollection.add(value);
                App.Breadcrumbs.reset();
                App.getMainRegion().show( new App.Catalog.Categories.Container({collection: resCollection}) );
            });
        };

        this.pageShop = function(path){
            var shop = App.Catalog.Model.Shops.findWhere({alias: path});
            if ( !_.isUndefined(shop) ){
                require(["bundle/catalog/category"], function(){
                    App.Catalog.Category.start({id: null, s: path});
                    App.Shops.setShop(path);
                });
            }else{
                App.navigate('catalog?q='+path, true);
            }
        };

        App.appRoutes.set({
            "catalog/:cat": "pageCategory",
            "catalog(/*path)(?*query)" : "pageCatalog"
        });
    });

});



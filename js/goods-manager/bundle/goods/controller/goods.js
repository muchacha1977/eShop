define([
    "app"
], function(App) {
    'use strict';
    return App.module("Goods.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controller >>> Goods');
            },
            
            goods: function(id){
                if (!id) {
                    return App.Router.navigate('categories', {trigger: true});
                }

                require([
                    "bundle/goods/goods",
                    "bundle/goods/model/goods"
                ], function(Goods, Data){
                    Data.Goods.id = id;
                    Data.Goods.fetch().done(function (result) {
                        Data.GoodsInfo.set('totalCount', result.total);

                        // TODO: Название категории и идентификатор должны приходить с сервера
                        function parseTree(branch) {

                            if (branch.nodes) {
                                parseTree(branch.nodes[0]);
                            } else{
                                Data.GoodsInfo.set({
                                    categoryId: branch.id,
                                    categoryName: branch.name
                                });
                            }
                        }

                        parseTree(result.tree);
                        App.getMainRegion().show(new Goods.View());
                    });    

                    
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "goods": "goods",
            "goods/:id": "goods"
        });

    });

});

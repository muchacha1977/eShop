define([
    "app"
], function(App) {
    'use strict';
    return App.module("Categories.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controller >>> Categories');
            },
            showCategories: function(){
                require([
                    "bundle/categories/categories",
                    "bundle/categories/model/categories"
                ], function (Categories, Data) {
                    var collection = Data.CategoriesFactory();

                    // Временное решение пока не сделаем ресты
                    var Category = Backbone.Model.extend({
                        defaults: {
                            id: null,
                            name: null,
                            nodesCount: 0,
                            characteristics: []        
                        }         
                    });  

                    collection.set([
                        new Category({
                            id: 'as',
                            name: 'Аксессуары',
                            nodesCount: 3,
                            characteristics: []
                        }),
                        new Category({
                            id: 'dsad',
                            name: 'Игровые костюмы',
                            nodesCount: 0,
                            characteristics: [
                                {
                                    name: 'Производитель',
                                    dimension: 'Текстовое поле'
                                },
                                {
                                    name: 'Цена',
                                    dimension: 'Текстовое поле'
                                }
                            ]
                        }),
                        new Category({
                            id: '111',
                            name: 'Для мужчин',
                            nodesCount: 5,
                            characteristics: []
                        }),
                        new Category({
                            id: 'dsdsdaaa',
                            name: 'Корсеты',
                            nodesCount: 2,
                            characteristics: []
                        }),
                    ]);   

                    App.getMainRegion().show(new Categories.View({_collection: collection}));

                    // Конец временного решения

                    
                    /*collection.fetch().done(function (result) {
                        console.log(result)
                        App.getMainRegion().show(new Categories.View({_collection: collection}));        
                    });    */    
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "categories": "showCategories",
            "categories/": "showCategories"
        });

    });

});
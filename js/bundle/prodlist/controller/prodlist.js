'use strict';

define(["app"], function(App) {

    App.module("ProdList.Controller", function(Controller, App, Backbone, Marionette, $, _) {
        require(["model/catalog", "bundle/shop-info/model/shop-info", "bundle/shops/model/shops"], function(Data){
            Controller = Marionette.Controller.extend({
                initialize: function (options) {
                    console.info('Controller >>> Prodlist');
                    
                },
                prodlist: function(category, shop, query, page){
                    Data.Catalog.ProdListCollection.category = category !== '-' ? category : null;
                    Data.Catalog.ProdListCollection.shop = shop !== '-' ? shop : null;
                    Data.Catalog.ProdListCollection.query = query !== '-' ? query : null;
                    Data.ShopInfo.set('id', Data.Catalog.ProdListCollection.shop);
                    if ( Data.Catalog.ProdListCollection.shop != null )
                    Data.ShopInfo.fetch({reset:true}).done(function(){
                        console.log("Data.ShopInfo.info in prodlist" + JSON.stringify(Data.ShopInfo.get("name")));
                    }); 
                    require([
                        "bundle/prodlist/prodlist",  "text!bundle/shops/view/button.html"
                    ], function(ProdList){

                        Data.Catalog.ProdListCollection.fetch({reset: true}).done(function(result, status){
                            if (status == 'success') {
                                if (result.total > 0) {
                                    var showFilters = false;

                                    // Дерево категорий
                                    var tree = result.tree;
                                    var counter = 0;
                                    parseTree(tree);
                                    Data.Catalog.CatNodeCollection.reset(tree || {id:"", name: "", nodes:[]});
                                    console.clear();
                                    console.log(Data.Catalog);
                                    counter = Data.Catalog.CatNodeCollection.models[0].nodes.models[0].nodes.models.length;
                                    // Всего товаров и категорий
                                    Data.Catalog.TotalAmountProductsModel.set({
                                        total: result.total,
                                        categoriesAmount: counter
                                    });


                                    
                                     Data.Catalog.CurrentShopModel.set({
                                            id:   Data.Catalog.ProdListCollection.shop,
                                            name:  Data.ShopInfo.get("name"),
                                            text: 'Здесь будет эмблема магазина'
                                        });


                                       
                                    // set breadcrumb
                                    setBreadCrumbInShop();
                                    // Фильтры

                                    result.filters = [
                                        {
                                            name: "Объем памяти",
                                            options: [
                                                {
                                                    name: "128 Гб",
                                                    value: 128,
                                                    checked: 0,
                                                    products: 1
                                                },
                                                {
                                                    name: "256 Гб",
                                                    value: 256,
                                                    checked: 0,
                                                    products: 3
                                                },
                                                {
                                                    name: "512 Гб",
                                                    value: 512,
                                                    checked: 0,
                                                    products: 2
                                                }
                                            ]
                                        },
                                        {
                                            name: "Бренд",
                                            options: [
                                                {
                                                    name: "Apple",
                                                    value: "Apple",
                                                    checked: 0,
                                                    products: 3
                                                },
                                                {
                                                    name: "Samsung",
                                                    value: "Samsung",
                                                    checked: 0,
                                                    products: 4
                                                },
                                                {
                                                    name: "Lenovo",
                                                    value: "Lenovo",
                                                    checked: 0,
                                                    products: 1
                                                }
                                            ]
                                        },
                                        {
                                            name: "Цвет",
                                            options: [
                                                {
                                                    name: "Желтый",
                                                    value: "yellow",
                                                    checked: 0,
                                                    products: 2
                                                },
                                                {
                                                    name: "Серебро",
                                                    value: "argentum",
                                                    checked: 0,
                                                    products: 1
                                                }
                                            ]
                                        }
                                    ];

                                    var filters = (result.filters && result.filters.length && showFilters) ? result.filters : [];
                                    Data.Catalog.ProductFilterCollection.reset(filters);

                                    App.getMainRegion().show(new ProdList.Container({
                                        collection: Data.Catalog.ProdListCollection
                                    }));
                                } else {
                                    App.getMainRegion().show(new ProdList.Empty());
                                }

                                App.vent.trigger("change:searchType");
                                App.vent.trigger("change:query");
                            }
                            /**
                             * Show  current  breadcrumb in shop
                             * Set attribute  href to a element
                             * show only if shopname not undefined
                             */
                            function setBreadCrumbInShop(){
                                if(typeof Data.ShopInfo.get("name") !== 'undefined' && (Data.ShopInfo.get("name").length>0)){
                                   $('#breadcrumbToShopLi').show();
                                   $('#closeShop').show();
                                   $('#breadcrumbToShop').text(Data.ShopInfo.get("name"));
                                   $('#breadcrumbToShop').attr('href', "#prodlist/-/"  + Data.Catalog.ProdListCollection.shop +  "/-");
                               }else{
                                   $('#breadcrumbToShopLi').hide();
                                   $('#closeShop').hide();

                               }
                            }
                            /**
                             * Парсит дерево, считает количество товаров и категорий и расставляет ссылки
                             * @param branch
                             */
                            function parseTree(branch) {
                                var _shop = shop ? shop : '-';
                                var _query = query ? query : '-';

                                if (branch.id.trim()) {

                                    branch.href = '#prodlist/' + branch.id + '/' + _shop + '/' + _query;
                                    
                                } else {
                                    branch.href = (shop && shop != '-') ? '#prodlist/-/' + shop : '#categories';
                                   
                                }

                                if (branch.nodes) {
                                    //counter += branch.nodes.length;
                                    for(var i = 0; i < branch.nodes.length; ++i){
                                        parseTree(branch.nodes[i]);
                                    }
                                } else{
                                    ++counter;
                                    if (branch.id.trim() == Data.Catalog.ProdListCollection.category) {
                                        showFilters = true;
                                    }
                                }
                            }
                        });

                    });
                }
            });

            App.Router.processAppRoutes(new Controller(), {
                "prodlist/:category": "prodlist",
                "prodlist/:category/:shop": "prodlist",
                "prodlist/:category/:shop/:query": "prodlist",
                "prodlist/:category/:shop/:query/:page": "prodlist"
            });

            App.Router.onRoute = function(route){
                if (route != 'prodlist' && route != 'shop'){
                    Data.Catalog.ProdListCollection.category = null;
                    Data.Catalog.ProdListCollection.shop = null;
                    Data.Catalog.ProdListCollection.query = null;
                }
            };

            console.log("prodlist controller created")
        });
    });

    return App.ProdList.Controller;
});
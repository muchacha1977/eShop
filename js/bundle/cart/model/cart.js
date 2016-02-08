/**
 * Модель корзины
 *
 * Data.Cart - Объект данных корзины
 * Data.Cart.Model - Модель
 * Data.Cart.Collection - Коллекция
 * Data.Cart.urlFetch - Ссылка на коллекцию на сервере
 * Data.Cart.toggleNum - Сколько предложений показать в кнопке корзина
 * Data.Cart.fixedPrice - Сколько копеек выводим, по умолчанию 2.
 * Data.Cart.total() - Общее количество товаров в коллекции
 * Data.Cart.totalPrice() - Общая сумма товаров в коллекции
 * Data.Cart.totalOffers() - Общее количество предложений в корзине
 * Data.Cart.viewShort() - Вернет урезанную коллекцию полной корзины. Обрезается по значению Data.Cart.toggleNum
 * Data.Cart.viewTree(collection = null) - Вернет коллекцию полной корзины. Группировка по магазинам.
 *
 * @TODO Обновление предложения при изменении его продавцом
 */

define([
        "app",
        "localstorage"
    ],
    function (App) {
        'use strict';
        App.module("Data", function (Data, App, Backbone, Marionette, $, _) {
            Data.Cart = {
                urlFetch: "rest/v0/cart",
                urlShipments: "rest/v0/shops/shipment/",
                urlOrderCreate: "rest/v0/ordergroup",
                fixedPrice: 2,
                toggleNum: 3,
                toggleNumOrder: 4,
                Model: Backbone.Model.extend(),
                Collection: Backbone.Collection.extend(),
                _Local: Backbone.Collection.extend(),
                _Server: Backbone.Collection.extend(),
                Orders: Backbone.Collection.extend(),

                options: {
                    cartFullViewType: "list"
                },
                total: function(collection){
                    if ( collection == null ) {
                        collection = Data.Cart.Collection;
                    }
                    var Models = collection.toJSON();
                    var total = 0;
                    _.each(Models, function(value, key, list){
                        if ( value.state != 'DELETED' )
                            total = total + Number(value.amount);
                    });
                    return total;
                },

                totalPrice: function(collection){
                    if ( collection == null ) {
                        collection = Data.Cart.Collection;
                    }
                    var Models = collection.toJSON();
                    var price = 0;
                    _.each(Models, function(value){
                        if ( value.state != 'DELETED' )
                            price = price + Number(value.offerPrice || value.currentPrice) * Number(value.amount);
                    });
                    return App.decimal(price);
                },

                totalOffers: function(collection){
                    if ( collection == null ) {
                        collection = Data.Cart.Collection;
                    }
                    return Data.Cart.Collection.length;
                },

                /**
                 * Мелкая корзина
                 * @returns Backbone.Collection
                 */
                viewShort: function(){

                    var collection = Backbone.Collection.extend({ model: Backbone.Model.extend() });
                    var collect = new collection();
                    var args = [];
                    var tmp = {};
                    var countOffers = 0;

                    var shopIds = Data.Cart.Collection.pluck("shopId");

                    shopIds = _.uniq(shopIds);

                    _.each(shopIds, function(id){
                        args.push(Data.Cart.Collection.where({shopId:id}));
                    });

                    _.each(args, function(model, key, list) {
                        var sum = 0;
                        var total = 0;
                        var offers = [];
                        _.each(model, function(m, k, l) {
                            sum = sum + Number(m.get('amount')) * Number(m.get('offerPrice'));
                            total = total + Number(m.get('amount'));
                            countOffers++;

                            if ( countOffers <= Data.Cart.toggleNum ){ // обрежем вывод офферов, а то в экран не влазит =D
                                offers.push(m.attributes);
                            }
                            tmp = {
                                shop:{
                                    id: m.get('shopId'),
                                    name: m.get('shopName'),
                                    sum: sum,
                                    total: total
                                },
                                offers: offers
                            };
                        });
                        collect.push(tmp);
                    });

                    return collect;
                },

                /*
                    @returns Backbone.Collection
                 */
                viewTree: function(newCollection){
                    if ( newCollection == null ) {
                        newCollection = Data.Cart.Collection;
                    }
                    var collection = Backbone.Collection.extend({ model: Backbone.Model.extend() });
                    var collect = new collection();
                    var args = [];
                    var tmp = {};
                    var countOffers = 0;

                    var shopIds = newCollection.pluck("shopId");

                    shopIds = _.uniq(shopIds);

                    var shipmentCollection =  Backbone.Collection.extend({ model: Backbone.Model.extend() });
                    var shipments =  new shipmentCollection();

                    _.each(shopIds, function(id){
                        args.push(newCollection.where({shopId:id}));
                    });


                    _.each(args, function(model, key, list) {
                        var sum = 0;
                        var total = 0;
                        var offers = [];
                        _.each(model, function(m, k, l) {
                            sum = sum + Number(m.get('amount')) * Number(m.get('offerPrice') || m.get('currentPrice'));
                            total = total + Number(m.get('amount'));
                            countOffers++;

                            offers.push(m.attributes);

                            tmp = {
                                shop:{
                                    id: m.get('shopId'),
                                    name: m.get('shopName'),
                                    sum: sum,
                                    total: total,
                                    offers: offers,
                                    shipments: [],
                                    address: [],
                                    defaultAddress: {},
                                    defaultShipments: {}
                                }
                            };
                        });
                        collect.push(tmp);
                    });

                    return collect;
                }
            };

            Data.Cart.Collection = Backbone.Collection.extend({
                model: Data.Cart.Model,
                url: Data.Cart.urlFetch,
                comparator: function (model) {
                    return -model.get('creationTime');
                },
                localStorage: new Backbone.LocalStorage("Cart")
            });
            Data.Cart.Collection = new Data.Cart.Collection();
            Data.Cart.Collection.fetch();

            if ( App.User.isBuyer() ){
                var local = null;
                local = Data.Cart.Collection.toJSON();
                while (Data.Cart.Collection.length > 0)
                    Data.Cart.Collection.at(0).destroy({ajaxSync: false});
                Data.Cart.Collection.fetch({ ajaxSync: true, reset: true }).done(function(){

                    if ( local.length > 0 ){
                        _.each(local, function(value, key, list){
                            var search = Data.Cart.Collection.findWhere({offerId: value.offerId});
                            if ( typeof search !== 'undefined' ){
                                if ( search.get('amount') <= value.amount ){
                                    search.set({amount:Number(value.amount)});
                                }
                            }else{
                                Data.Cart.Collection.add(value);
                            }
                        });
                    }
                });
            };

            App.User.on('change', function(args){
                if ( !Data.user.get('loggedIn') ){
                    Data.Cart.Collection.fetch().done(function(){
                        while (Data.Cart.Collection.length > 0)
                            Data.Cart.Collection.at(0).destroy();
                    });
                }else{
                    if(Data.user.isBuyer()){
                        var local = null;
                        local = Data.Cart.Collection.toJSON();
                        while (Data.Cart.Collection.length > 0)
                            Data.Cart.Collection.at(0).destroy({ajaxSync: false});
                        Data.Cart.Collection.fetch({ ajaxSync: true, reset: true }).done(function(){

                            if ( local.length > 0 ){
                                _.each(local, function(value, key, list){
                                    var search = Data.Cart.Collection.findWhere({offerId: value.offerId});
                                    if ( typeof search !== 'undefined' ){
                                        if ( search.get('amount') <= value.amount ){
                                            search.set({amount:Number(value.amount)});
                                        }
                                    }else{
                                        Data.Cart.Collection.add(value);
                                    }
                                });
                            }
                        });
                    }
                }
            });

            Data.Cart.Collection.on('sync', function(args){
                //console.log('Data.Cart >>> sync');
            });

            Data.Cart.Collection.on('request', function(args){
                //console.log('Data.Cart >>> request');
            });

            Data.Cart.Collection.on('change', function(args){
                //console.log('Data.Cart >>> change');
                if ( Data.user.isBuyer() && Data.user.get('loggedIn') ){
                    args.save(null,{ajaxSync: true});
                }else{
                    args.save();
                }
            });

            Data.Cart.Collection.on('add', function(args){
                //console.log('Data.Cart >>> add');
                if ( Data.user.isBuyer() && Data.user.get('loggedIn') ){
                    args.unset('id',{silent:true});

                    args.save(null,{ajaxSync: true});
                }else{
                    args.save();
                }
            });

            Data.Cart.Collection.on('create', function(args){
                //console.log('Data.Cart >>> create');
            });

            Data.Cart.Collection.on('reset', function(args){
                //console.log('Data.Cart >>> reset');
            });
            
            Data.Cart.Collection.on('remove', function(args, model, options){
                //console.log('Data.Cart >>> remove');
                if ( Data.user.isBuyer() && Data.user.get('loggedIn') ){
                    if ( typeof options.ajaxSync === 'undefined' ){
                        args.destroy({ajaxSync: true});
                    }else{
                        args.destroy();
                    }
                }else{
                    args.destroy();
                }
            });
        });

        return App.Data;
    }
);


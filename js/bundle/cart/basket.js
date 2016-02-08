/**
 * Created by GOODPROFY on 22.05.2015.
 *  @example Кнопка корзины с выпадающим списком
 *  require(["bundle/cart/basket"], function(Basket){ this.region.show(new Cart.Cart()) });
 */

define([
    'app',
    'bundle/cart/model/cart',
    "text!bundle/cart/view/cart.html",
    "text!bundle/cart/view/cart-items.html",
    "text!bundle/cart/view/cart-empty.html",
    "text!bundle/cart/view/cart-trader.html"
], function(
    App,
    Data,
    viewCart,
    viewCartItems,
    viewCartEmpty,
    viewCartTrader
){
    'use strict';
    return App.module('Cart.Basket', function(Cart, App, Backbone, Marionette, $, _ ){

            /**
             * Добавление в корзину
             * @param e
             * @constructor
             */

            App.vent.on("cart:add", function(e){

                var el = e.target || e.srcElement;
                var amount = $(el).parent().parent().find('input').val();
                var args = $(el).data();

                if ( typeof amount === 'undefined' ){
                    amount = args.offerAmount;
                }
                var offerId = args.offerId;
                if ( typeof offerId === 'undefined' ){
                    offerId = args.offer;
                }

                if ( amount == 0  ) amount = 1;
                $(el).data('offerAmount', amount);
                var offer = {};
                $.ajax({
                    url: "rest/v0/offer/" + offerId,
                    success: function(data){

                        offer = {
                            "productId": data.product.id,
                            "offerId": data.id,
                            "shopId": data.shop.id,
                            "amount": Number(amount),
                            "creationTime": new Date().getTime(),
                            "productName": data.product.name,
                            "productEan": data.product.barCode,
                            "offerPrice": data.unitPrice,
                            "shopName": data.shop.name
                        };
                        /**
                         * + amount к существующему предложению
                         */


                        var search = Data.Cart.Collection.findWhere({offerId: data.id});
                        if ( typeof search !== 'undefined' ){
                            if ( Data.user.isBuyer() && Data.user.get('loggedIn') ){
                                search.save({amount:Number(search.get('amount'))+Number(amount)}, {ajaxSync: true});
                            }else{
                                search.save({amount:Number(search.get('amount'))+Number(amount)});
                            }
                        }else{
                            Data.Cart.Collection.add(offer);
                        }

                        App.alert({ message: 'Товар '+data.product.name+' от магазина '+ data.shop.name +', добавлен в корзину.' });

                    },
                    error: Cart.Error
                });
            });

            this.CartItem = Marionette.ItemView.extend({
                tagName: "li",
                className: "cart-button-items",
                template: _.template(viewCartItems)
            });

            this.CartItems = Marionette.CollectionView.extend({
                childView: Cart.CartItem,
                collection: Data.Cart.Collection,
                initialize: function(){
                    this.collection = Data.Cart.viewShort();
                }
            });

            this.Cart = Marionette.LayoutView.extend({
                template: _.template(viewCart),
                regions: {
                    items: '#cart-dropdown-items'
                },
                templateHelpers: function () {
                    return {
                        total: Data.Cart.total,
                        totalPrice: Data.Cart.totalPrice
                    };
                },
                ui: {
                    btn: '#cart-button'
                },
                events: {
                    'click @ui.btn': 'onDropdown',
                    'click #cart-order': 'navOrder'
                },
                navOrder: function(){
                    if ( Data.user.get('loggedIn') && Data.user.isBuyer() ) {
                        App.navigate('cart/order', true);
                    }else{
                        require(['bundle/authentication/authentication'], function(Authentication){
                            App.dialogRegion.show(new  Authentication.View());
                        });

                        Data.user.on('change', function(args){
                            if ( Data.user.get('loggedIn') && Data.user.isBuyer() ) {
                                App.navigate('cart/order', true);
                            }
                        });
                    }
                },
                onDropdown: function () {
                    this.items.show(new Cart.CartItems());
                },
                onBeforeRender: function(){
                    if ( Data.user.isTrader() ){
                        this.template = _.template(viewCartTrader);
                    }else{
                        if ( Data.Cart.total() == 0 ){
                            this.template = _.template(viewCartEmpty);
                        }else{
                            this.template = _.template(viewCart);
                        }
                    }
                },
                initialize: function () {
                    this.listenTo(Data.user, "change", this.render);
                    this.listenTo(Data.Cart.Collection, "sync", this.render);
                    this.listenTo(Data.Cart.Collection, "change", this.render);
                    this.listenTo(Data.Cart.Collection, "remove", this.render);
                    this.listenTo(Data.Cart.Collection, "add", this.render);
                }
            });
        }
    );

});
/**
 * Корзина покупателя
 * @version 0.2.6 Stable
 *
 * @example Кнопка добавления в корзину
 *  events: { "click button[data-cart]" : "onCart" }
 *  onCart: function (e) { App.vent.trigger("cart:add", e); } в DOM указать data-offer-id="<%=id%>" и data-offer-amount="1"
 *  <button class="btn btn-primary product-btn-cart glyphicon glyphicon-shopping-cart" type="button" data-cart="<%=id%>" data-offer-id="<%=id%>" data-offer-amount="1"></button>
 *
 * @example Кнопка с количеством
     <div class="input-group cart-button-add">
          <input type="number" name="amount" id="amount" min="1" value="1" class="form-control text-center">
          <span class="input-group-btn">
               <button class="btn btn-primary product-btn-cart glyphicon glyphicon-shopping-cart" type="button" data-cart="<%=id%>" data-offer-id="<%=id%>" data-offer-amount="1"></button>
          </span>
     </div>
 *
 *
 *
 *
 * @example Полная корзина с оформлением заказа
 *  require(["bundle/cart/cart"], function(Cart){ this.region.show(new Cart.Full()) });
 *
 * @example Переадресация в корзину
 *  App.navigate('cart', true);  // Вид списком
 *  App.navigate('cart/tree', true); // Вид "деревом" [deprecated]
 *  App.navigate('cart/order', true); // Оформление
 *
 *
 * @TODO Оптимизировать.
 *
 */

define([
        "app",
        "bundle/cart/model/cart",
        "moment",
        "text!bundle/cart/view/full.html",
        "text!bundle/cart/view/full-items.html",
        "text!bundle/cart/view/full-tree.html",
        "text!bundle/cart/view/full-tree-items.html",
        "text!bundle/cart/view/full-empty.html",
        "text!bundle/cart/view/order.html",
        "text!bundle/cart/view/order-shops.html",
        "text!bundle/cart/view/order-products-item.html",
        "text!bundle/cart/view/order-total.html",
        "text!bundle/cart/view/done.html",
        "bundle/authentication/authentication",
        "model/shipments",
        "model/user",
        "model/address",

        "jquery.tablesorter",
        "jquery.tablesorter.widgets",
        "serializejson"
    ],
    function (
          App,
          Data,
          moment,
          viewFull,
          viewFullItems,
          viewTree,
          viewTreeItems,
          viewFullEmpty,
          viewOrder,
          viewOrderShops,
          viewOrderProductsItem,
          viewOrderTotal,
          viewDone,
          Authentication
    ) {
        'use strict';
        App.module("Cart", function (Cart, App, Backbone, Marionette, $, _) {

            var userProfile = Backbone.Model.extend({
                url: App.config.rest + 'buyer/profile'
            });

            Cart.Error = function(collection, response, options){
                console.warn('%cCart >>> Error >>> ', 'background: #c53546; color: #fff');
                console.group();
                console.debug(collection);
                console.debug(response);
                console.groupEnd();
            };

            /**
             * Подтверждение
             */

            Cart.Done = Marionette.ItemView.extend({
                template: _.template(viewDone),
                ui: {
                    btnBack: '#cart-done-back',
                    btnSubmit: '#cart-done-submit',
                    items: '#cart-order-items'
                },
                events: {
                    'click @ui.btnBack': 'onBack',
                    'click @ui.btnSubmit': 'onSubmit'
                },
                onShow: function(){
                    console.log(this.model.toJSON());
                    if ( this.model.attributes.offers.length > Data.Cart.toggleNumOrder ){
                        var self = this;
                        require(['lib/tablesorter/widgets/widget-scroller'], function(){
                            $.tablesorter.themes.bootstrap = {
                                table        : 'table table-hover',
                                iconSortNone : 'fa fa-sort',
                                iconSortAsc  : 'fa fa-sort-asc',
                                iconSortDesc : 'fa fa-sort-desc'
                            };

                            self.ui.items.tablesorter({
                                theme : "bootstrap",
                                widthFixed: false,
                                headerTemplate : '{content} {icon}',
                                widgets : [ "uitheme", 'scroller' ],
                                showProcessing: true,
                                headers : { 0 : { sorter: false }, 2 : { sorter: false }},
                                delayInit: true,
                                initialized : function(table){
                                    $.tablesorter.refreshWidgets(table, false, true );
                                },
                                widgetOptions : {
                                    scroller_height : 250,
                                    scroller_upAfterSort: true,
                                    scroller_jumpToHeader: true,
                                    scroller_barWidth : null
                                }
                            });
                        });
                    }

                },
                onBack: function () {
                    $('.modal').modal('hide');
                },
                onSubmit: function () {

                    var offers = this.model.get('offers');

                    var offerArgs = [];

                    _.each(offers, function(value){
                        offerArgs.push({
                            id: value.offerId,
                            quantity: Number(value.amount),
                            unitPrice: value.offerPrice
                        });
                    });
                    var order = Backbone.Model.extend({

                        url: Data.Cart.urlOrderCreate

                    });
                    order = new order();


                    order.save({
                        items: offerArgs,
                        shipmentType: this.model.attributes.defaultShipments.type,
                        shipmentAddress: this.model.attributes.defaultAddress.id,
                        comment: this.model.attributes.order.comment
                    },{
                        dataType: "text",
                        success: function(model, response, options) {

                            require(["bundle/modal/modal"],
                                function (Modal) {
                                    App.Wreqr.setHandler("modal:yes", function () {
                                        console.log("Yes");
                                        App.navigate('cart/order');
                                    });
                                    App.Wreqr.setHandler("modal:no", function () {
                                        console.log("No");
                                        App.navigate('cart/order');
                                    });
                                    new Modal.View({text: "Заказ успешно оформлен", yes: "Закрыть", no: "", _template: "message", _static: false});
                                }
                            );

                            _.each(offers, function(value, key, list){

                                model = Data.Cart.Collection.findWhere({id: value.id});
                                Data.Cart.Collection.remove(model);

                            });
                        },
                        error: Cart.Error
                    });

                }
            });


            /**
             * Оформление
             */

            Cart.OrderViewProduct = Marionette.ItemView.extend({
                template: _.template(viewOrderProductsItem),
                tagName: 'tr',
                events: {
                    'click .cart-item-remove': 'itemRemove',
                    'change input.amount': 'itemAmount'
                },
                itemRemove: function(){
                    this.triggerMethod('item:remove');
                },
                itemAmount: function(){
                    var amount = this.$('input.amount');
                    var amountHidden = this.$('.amount span');
                    if ( amount.val() < 0 ) amount.val(1);
                    amountHidden = amount.val();

                    this.triggerMethod('item:amount', amount.val());
                }
            });


            Cart.OrderViewProducts = Marionette.CollectionView.extend({
                childView: Cart.OrderViewProduct,
                tagName: 'table',
                className: 'table table-hover',
                childEvents: {
                    'item:remove': function(child){
                        this.collection.remove(child.model);
                        Data.Cart.Orders.remove(child.model);
                        this.triggerMethod('item:remove', this.collection);
                    },
                    'item:amount': function(m, amount){
                        var find = Data.Cart.Orders.findWhere({offerId: m.model.get('offerId')});
                        find.set({amount: amount});
                        this.triggerMethod('item:amount', m, amount);
                    }
                },
                initialize: function(){
                    var offers = this.model.get('offers');
                    this.collection = new Backbone.Collection(offers);
                }
            });

            Cart.OrderViewShop = Marionette.CompositeView.extend({
                template: _.template(viewOrderShops),
                childViewContainer: '#cart-full-items-products',
                childView: Cart.OrderViewProducts,
                tagName: 'div',
                className: 'cart-full-items-item',
                ui: {
                    btnSubmit: '#cart-order-submit',
                    selNewAddress: '#address',
                    selShipments: '#shipments',
                    sumWithShipment: '#sum-with-shipment',
                    helpAddress: '#address-help',
                    helpShipments: '#shipments-help'
                },
                events: {
                    'click @ui.btnSubmit': 'onSubmit',
                    'change @ui.selNewAddress': 'onAddress',
                    'change @ui.selShipments': 'onShipments'
                },
                childEvents: {
                    'item:remove': function(child){
                        var mArgs = this.model.get('shop');
                        var offers = [];
                        _.each(child.collection.toJSON(),function(v){
                            offers.push(v);
                        });
                        mArgs.offers = offers;
                        var total = 0;
                        var sum = 0;
                        _.each(mArgs.offers, function(v,k,l){
                            total += Number(v.amount);
                            sum += Number(v.offerPrice);
                        });
                        mArgs.total = total;
                        sum = sum * total;
                        sum = sum*10;
                        sum = sum / 10;
                        mArgs.sum = sum.toFixed(2);
                        this.collection.set(mArgs);
                        if( child.collection.length == 0 ){
                            this.destroy();
                        }else{
                            this.render();
                        }

                        this.triggerMethod('item:remove');
                    },
                    'item:amount': function(c, m, a){

                        var mArgs = this.model.get('shop');
                        var total = 0;
                        var sum = 0;
                        _.each(mArgs.offers, function(v,k,l){
                            if (v.offerId == m.model.get('offerId') ){
                                v.amount = a;
                            }
                            total += Number(v.amount);
                            sum += Number(v.offerPrice);
                        });
                        mArgs.total = total;
                        sum = sum * total;
                        sum = sum*10;
                        sum = sum / 10;
                        mArgs.sum = sum.toFixed(2);
                        this.collection.set(mArgs);
                        this.render();
                    }
                },
                onSubmit: function(e){
                    var orderArgs = this.$('form').serializeJSON();
                    if ( orderArgs.address == 'Добавить новый' ){

                        require(['bundle/buyer/address'], function(Buyer){
                            App.getRegion('dialogRegion').show(new Buyer.ContainerViewModal());
                            App.Wreqr.setHandler("modal:no", function () {
                                App.Wreqr.execute("address:update");
                                App.Wreqr.removeHandler("address:update");
                            });
                        });
                        return;
                    }
                    var model = Backbone.Model.extend();
                    var m = new model();
                    console.log(orderArgs);
                    if (_.isEmpty(orderArgs.phone) ){
                        orderArgs.phone=userProfile.get('phone');
                    }
                    var offers = this.model.get('shop');
                    _.extend(offers,{order: orderArgs });
                    m.set(offers);

                    App.dialogRegion.show(new Cart.Done({model:m}));
                    $('.modal').modal({
                        backdrop: 'static'
                    });
                    return false;
                },
                onAddress: function(e){
                    var self = this;
                    var el = e.target || e.srcElement;
                    var args = $('option:selected', el).data();
                    if ( $('option:selected', el).val() == 'Добавить новый' ){

                        require(['bundle/buyer/address'], function(Buyer){
                            App.getRegion('dialogRegion').show(new Buyer.ContainerViewModal());
                            App.Wreqr.setHandler("modal:no", function () {
                                App.Wreqr.execute("address:update");
                                App.Wreqr.removeHandler("address:update");
                            });
                        });

                    }else{
                        var mArgs = this.model.get('shop');
                        _.each(mArgs.address, function(value){
                            var attrs = value.attributes;
                            if ( attrs.deflt == true ) attrs.deflt = false;
                            if ( attrs.id == args.addressId ){
                                attrs.deflt = true;
                                mArgs.defaultAddress = attrs;
                            }
                        });
                    }
                    this.render();

                },
                onShipments: function(e){
                    var el = e.target || e.srcElement;
                    var args = $('option:selected', el).data();
                    var mArgs = this.model.get('shop');
                    var som = _.findWhere(this.collection.at(0).attributes.shipments, {id: args.shipmentsId});
                    mArgs.defaultShipments = som.attributes;

                    mArgs.defaultShipments.days = moment().add(mArgs.defaultShipments.days, 'days').format("DD.MM.YY");
                    this.model.set({shop:mArgs});
                    this.render();
                },
                initialize: function(){
                    var shop = this.model.get('shop');
                    shop.comment = '';
                    this.collection = new Backbone.Collection(shop);
                },
                onRender: function(){
                    var self = this;
                    this.$("#comment").bind('input propertychange', function(){
                        var shop = self.model.get('shop');
                        shop.comment = $(this).val();
                    });

                    this.$('[data-toggle="tooltip"]').tooltip();

                    if ( _.isFunction(userProfile) ){
                        userProfile = new userProfile();
                        userProfile.fetch().done(function(){
                            self.$('#phone').val('+'+userProfile.get('phone'));
                        });
                    }else{
                        userProfile.fetch().done(function(){
                            self.$('#phone').val('+'+userProfile.get('phone'));
                        });
                    }
                },
            });


            Cart.OrderViewShops = Marionette.CollectionView.extend({
                childView: Cart.OrderViewShop
            });

            Cart.OrderTotal = Marionette.ItemView.extend({
                template: _.template(viewOrderTotal),
                templateHelpers: function () {
                    return {
                        total: Data.Cart.total(Data.Cart.Orders),
                        totalPrice: Data.Cart.totalPrice(Data.Cart.Orders)
                    };
                },
                initialize: function(){
                    this.listenTo(Data.Cart.Orders, "change", this.render);
                    this.listenTo(Data.Cart.Orders, "remove", this.render);
                },
                onRender: function(){
                    if ( Data.Cart.Orders.length == 0 ){
                        return App.navigate('cart', {trigger:true});
                    }
                }
            });

            Cart.Order = Marionette.LayoutView.extend({
                template: _.template(viewOrder),
                regions: {
                  itemsAll: '#cart-full-items',
                  totalAll: '#cart-full-after'
                },
                onRender: function(){
                    Data.Cart.Orders = Data.Cart.Collection.clone();

                    var self = this;
                    var curCollection = new Backbone.Collection();
                    var resCollection = new Backbone.Collection();
                    curCollection = Data.Cart.viewTree( Data.Cart.Orders );


                    Data.Address.fetch({
                        success: function(collection, response, options){
                            _.each(curCollection.toJSON(), function(value){

                                var shipments = new Data.Shipments({id: value.shop.id});
                                shipments.fetch({
                                    success: function(c, r, o){
                                        var newShipments = new Backbone.Collection();
                                        _.each(c.models, function(element){
                                            if ( element.get('active') ){
                                                newShipments.add(element.toJSON());
                                            }
                                        });

                                        var defaultAddress = (typeof collection.findWhere({deflt:true}) === 'undefined' )? '' : collection.findWhere({deflt:true}).attributes;

                                        if ( defaultAddress == '' ){
                                            require(['bundle/buyer/address'], function(Buyer){
                                                App.getRegion('dialogRegion').show(new Buyer.ContainerViewModal());
                                                App.Wreqr.setHandler("modal:no", function () {
                                                    App.Wreqr.execute("address:update");
                                                    App.Wreqr.removeHandler("address:update");
                                                });
                                            });
                                        }

                                        value.shop.shipments = newShipments.models;
                                        value.shop.defaultShipments = newShipments.at(0).attributes;
                                        value.shop.defaultShipments.days = moment().add(value.shop.defaultShipments.days, 'days').format("DD.MM.YY");
                                        value.shop.address = collection.models;
                                        value.shop.defaultAddress = defaultAddress;
                                    },
                                    error: Cart.Error
                                }).done(function(){
                                    resCollection.add(value);
                                });

                            });
                            if ( App.getCurrentRoute() == 'cart/order' ){
                                self.itemsAll.show( new Cart.OrderViewShops({ collection: resCollection }) );
                                self.totalAll.show( new Cart.OrderTotal() );
                            }

                        },
                        error: Cart.Error
                    });


                },
                initialize: function(){
                    var self = this;
                    App.Wreqr.setHandler("address:update", function () {
                        self.render();
                    });
                    this.listenTo(Data.Cart.Collection, "remove", this.render);
                    this.listenTo(Data.Cart.Collection, "reset", this.render);
                    this.listenTo(Data.Cart.Collection, "sync", this.render);

                    App.User.on('change', this.render());
                }
            });


            /**
             * Корзина толстая
             */

            Cart.FullTree = Marionette.ItemView.extend({
                template: _.template(viewTree),
                templateHelpers: function() {
                    return {
                        total: Data.Cart.total,
                        totalPrice: Data.Cart.totalPrice,
                        shop: this.collection.toJSON()
                    };
                },
                events: {
                    'click .cart-item-remove': 'itemRemove',
                    'change input.amount': 'itemAmount'
                },
                itemRemove: function(e){

                    var el = e.target || e.srcElement;
                    var m = Data.Cart.Collection.where({offerId: $(el).data('offerId')});
                    Data.Cart.Collection.remove(m);
                    this.collection = Data.Cart.viewTree();
                    this.render();
                },
                itemAmount: function(e){
                    var el = e.target || e.srcElement;

                    var amount = $(el);
                    if ( amount.val() < 1 ) amount.val(1);
                    var amountHidden = amount.parent().parent().find('.amount span');
                    amountHidden = amount.val();

                    var m = Data.Cart.Collection.findWhere({offerId: $(el).data('offerId')});
                    m.set({amount: amount.val()});
                    this.render();
                },
                onRender: function(){
                    $.tablesorter.themes.bootstrap = {
                        table        : 'table',
                        iconSortNone : 'fa fa-sort',
                        iconSortAsc  : 'fa fa-sort-asc',
                        iconSortDesc : 'fa fa-sort-desc'
                    };

                    this.$('table').tablesorter({
                        theme : "bootstrap",
                        widthFixed: false,
                        headerTemplate : '{content} {icon}',
                        widgets : [ 'uitheme', 'stickyHeaders' ],
                        cssInfoBlock : "tablesorter-no-sort",
                        headers : { 0 : { sorter: false } }
                    });
                },

                initialize: function(){
                    this.listenTo(Data.Cart.Collection, "sync", this.render);
                    this.listenTo(Data.Cart.Collection, "change", this.render);
                    this.listenTo(Data.Cart.Collection, "remove", this.render);
                    this.listenTo(Data.Cart.Collection, "add", this.render);
                    this.listenTo(Data.Cart.Collection, "reset", this.render);
                },
                onBeforeRender: function(){
                    this.collection = Data.Cart.viewTree();
                    if ( Data.user.isTrader() ){
                        App.navigate('home', true);
                    }else{
                        if ( Data.Cart.total() == 0 ){
                            this.template = _.template(viewFullEmpty);
                        }else{
                            this.template = _.template(viewTree);
                        }
                    }
                }
            });

            /**
             * Список всех предложений
             */
            Cart.FullItem = Marionette.ItemView.extend({
                tagName: "tr",
                template: _.template(viewFullItems),
                events: {
                    'click .cart-item-remove': 'itemRemove',
                    'change input.amount': 'itemAmount'
                },
                itemRemove: function(){
                    this.triggerMethod('item:remove');
                },
                itemAmount: function(){
                    this.triggerMethod('item:amount');
                }
            });

            Cart.Full = Marionette.CompositeView.extend({
                childEvents: {
                    'item:remove': function(o){

                        Data.Cart.Collection.remove(o.model);
                        this.render();
                        var resort = true,
                            callback = function(table){};
                        this.$("table").trigger("update", [ resort, callback ]);
                    },
                    'item:amount': function (o) {
                        var amount = o.$('input.amount');
                        var amountHidden = o.$('.amount span');
                        if ( amount.val() < 1 ) amount.val(1);
                        o.model.set({amount: amount.val()});
                        amountHidden = amount.val();
                        this.render();
                        var resort = true,
                            callback = function(table){};
                        this.$("table").trigger("update", [ resort, callback ]);
                    }
                },
                template: _.template(viewFull),
                childView: Cart.FullItem,
                childViewContainer: "#cart-full-items tbody",
                collection: Data.Cart.Collection,
                initialize: function () {
                    this.listenTo(Data.Cart.Collection, "sync", this.render);
                    this.listenTo(Data.Cart.Collection, "change", this.render);
                    this.listenTo(Data.Cart.Collection, "remove", this.render);
                    this.listenTo(Data.Cart.Collection, "add", this.render);
                    this.listenTo(Data.Cart.Collection, "reset", this.render);
                },
                templateHelpers: function() {
                    return {
                        total: Data.Cart.total,
                        totalPrice: Data.Cart.totalPrice
                    };
                },
                onBeforeRender: function(){
                    if ( Data.user.isTrader() ){
                        App.navigate('home', true);
                    }else{
                        if ( Data.Cart.total() == 0 ){
                            this.template = _.template(viewFullEmpty);
                        }else{
                            this.template = _.template(viewFull);
                        }
                    }
                },

                onRender: function(){

                    $.tablesorter.themes.bootstrap = {
                        table        : 'table table-hover',
                        iconSortNone : 'fa fa-sort',
                        iconSortAsc  : 'fa fa-sort-asc',
                        iconSortDesc : 'fa fa-sort-desc'
                    };

                    this.$('table').tablesorter({
                        theme : "bootstrap",
                        widthFixed: false,
                        headerTemplate : '{content} {icon}',
                        headers : { 0 : { sorter: false }, 2 : { sorter: false }, 7 : { sorter: false }},
                        widgets : [ "uitheme",  "stickyHeaders" ]
                    });

                }
            });

            Cart.addInitializer(function () {
                //console.log("Cart >>> addInitializer");
            });

        });

        return App.Cart;
    }
);



/**
 * Разное
 * Created by jetsc on 21.08.2015.
 */
define([
    'app'
], function(App){
    return App.module("Data.Misc", function (Misc, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;


        /**
         * Модель к-ва магазинов и предложений
         */
        this.OffersAndShopsCounts = Backbone.Model.extend({
            options: {
                string: {
                    offers: ['предложение', 'предложения', 'предложений'],
                    shops: ['магазина', 'магазинов', 'магазинов'],
                    products: ['товаре', 'товарах', 'товарах']
                }
            },
            url: 'rest/v0/misc/counts',
            defaults: {"products":13376,"shops":30,"offers":79457, strProducts: 'товаров', strShops: 'магазинов', strOffers: 'предложений'},
            initialize: function(){
                var self = this;
                this.on('sync', function(){
                    self.set({
                        "products": App.decimal(self.get('products')),
                        "shops": App.decimal(self.get('shops')),
                        "offers": App.decimal(self.get('offers')),
                        "strProducts": App.getNumEnding(self.get('products'), self.options.string.products),
                        "strShops": App.getNumEnding(self.get('shops'), self.options.string.shops),
                        "strOffers": App.getNumEnding(self.get('offers'), self.options.string.offers)
                    },{silent: true});
                });
            }
        });


        this.onStart = function() {
            console.log('Data.Misc >>> Start');
        };

        this.onStop = function() {
            console.log('Data.Misc >>> Stop');
        };

    });
});
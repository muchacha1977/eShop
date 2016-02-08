/**
 * Created by GOODPROFY on 01.06.2015.
 */
define([
    'app'
], function(App){
    return App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

        Data.BidModel = Backbone.Model.extend({
            url: 'rest/v0/bid',
            initialize: function(){
                console.log('Data.BidModel >>> init');
            },
            defaults: {
                unitPrice: null,
                quantity: 1,
                productId: null,
				region: '',
				regionData: ''
            }
        });



    });
});
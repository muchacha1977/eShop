/**
 * Created by Root on 27.05.2015.
 */
define([
    'app'
], function(App){
    return App.module("Data.Asks", function (Asks, App, Backbone, Marionette, $, _) {
        Asks.Collection = Backbone.Collection.extend({
            url: 'rest/v0/bid',
            initialize: function(){
                console.log('Data.Asks.Collection >>> init');
            }
        });

        Asks.Model = Backbone.Model.extend({
            url: 'rest/v0/bid',
            initialize: function(){
                console.log('Data.Asks.Model >>> init');
            }
        });

        Asks.PageableCollection = Backbone.PageableCollection.extend({
            initialize: function(){
                console.log('Data.Asks.PageableCollection >>> init');
            },
            url: "rest/v0/bid",
            mode: "server",

            queryParams: {
                currentPage: "p",
                pageSize: "l",
                totalPages: null,
                totalRecords: null
            },

            state: {
                pageSize: 2
            },

            parseRecords: function(result) {
                return result.data;
            },

            parseState: function (resp) {
                return { totalRecords: resp.total };
            }
        });



    });
});
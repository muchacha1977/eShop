/**
 * Модуль регионов(GEO)
 * Created by GOODPROFY on 04.06.2015.
 */
define([
    'app'
], function(App){
    return App.module("Data.Regions", function (Regions, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;
        this.Collection = Backbone.Collection.extend({
            url: 'rest/v0/misc/regions'
        });

        this.Collection = new this.Collection();

        this.onStart = function() {
            console.log('Data.Regions >>> Start');
        };

        this.onStop = function() {
            console.log('Data.Regions >>> Stop');
            Regions.Collection.reset([]);
        };

    });
});
/**
 * Created by jetsc on 20.08.2015.
 */
define([
        "app",
        "localstorage"
    ],
    function (App) {
        return App.module("Data.Countries", function (Countries, App, Backbone, Marionette, $, _) {

            this.Model = Backbone.Model.extend({
                defaults: {
                    "name":"",
                    "alpha2":"",
                    "alpha3":"",
                    "isoNum":0,
                    "iso":"",
                    "filepath":""
                }
            });

            this.Collection = Backbone.Collection.extend({
                model: Countries.Model,
                url: 'mock/countries.json',
                localStorage: new Backbone.LocalStorage("Countries"),
                initialize: function(){
                    console.log('Data.Countries >>> Init');
                }
            });

            this.Collection = new this.Collection();

            this.Collection.fetch().done(function(){
                console.log('Data.Countries >>> Load');
            });

        });
    }
);


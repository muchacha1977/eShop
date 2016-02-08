define(["app", "backbone"],
    function (App) {
        return App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

            var Shops = Backbone.Collection.extend({
            	url: '/rest/v0/shops'
            });

            Data.Shops = new Shops();

        });
    }
);


define([
    "app"
], function(App) {
    'use strict';
    return App.module("Controller", function(Controller, App, Backbone, Marionette, $, _) {


        this.showTraderView = function(tab, subTab){
            console.log("show trader view: tab = " + tab + ", sub = " + subTab);
            require(["bundle/trader/trader"], function(Trader) {
                var opts = {"tab":tab, "subTab":subTab};
                App.getMainRegion().show(new Trader.Container(opts));
            });
        };

        App.appRoutes.set({
            "trader(/:tab)(/:subTab)" : "showTraderView"
        });

    });

});
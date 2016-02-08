define([
    "app"
], function(App) {
    'use strict';
    return App.module("Controller", function(Controller, App, Backbone, Marionette, $, _) {

        this.showProducerView = function(tab, subTab){
            console.log("show producr view: tab = " + tab + ", sub = " + subTab);
            require(["bundle/producer/producer"], function(Producer) {
                var opts = {"tab":tab, "subTab":subTab};
                App.getMainRegion().show(new Producer.Container(opts));
            });
        };

        App.appRoutes.set({
            "producer(/:tab)(/:subTab)" : "showProducerView"
        });

    });

});
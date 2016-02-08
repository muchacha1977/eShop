define([
    "app"
], function(App) {
    'use strict';
    return App.module("Controller", function(Controller, App, Backbone, Marionette, $, _) {

        this.showManufacturerView = function(id){
            require(["bundle/manufacturer/manufacturer"], function(Manufacturer) {
                App.getMainRegion().show(
                    new Manufacturer.Container({id: id}));
            });
        };
		
		App.appRoutes.set({
            "manufacturer/:id" : "showManufacturerView"
        });

    });

});

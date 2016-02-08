define([
    "app"
], function(App) {
    'use strict';
    return App.module("NewGood.Controller", function(Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controller >>> NewGood');
            },
            
            newGood: function(id){
                require([
                    "bundle/new-good/new-good"
                ], function(NewGood){
                    App.getMainRegion().show(new NewGood.View());
                });
            },

            newGoodChars: function() {
                require([
                    "bundle/new-good/new-good-chars",
                    "bundle/new-good/model/new-good"
                ], function(NewGoodChars, Data){                    
                    App.getMainRegion().show(new NewGoodChars.View());
                });     
            },

            goodSaved: function () {
                require([
                    "bundle/new-good/good-saved"
                ], function(GoodSaved){
                    App.getMainRegion().show(new GoodSaved.View());
                }); 
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "new-good": "newGood",
            "new-good-chars": "newGoodChars",
            "good-saved": "goodSaved"
        });

    });

});

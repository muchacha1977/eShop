'use strict';

define([
    'app',
    'bundle/new-good/controller/new-good',
    'bundle/goods/controller/goods',
    'bundle/good/controller/good',
    'bundle/categories/controller/categories',
    'bundle/user-categories/controller/user-categories'
],function(App){
    return App.module("Controller", function (Controller, App, Backbone, Marionette, $, _) {

        Controller = Marionette.Controller.extend({
            initialize: function (options) {
                console.info('Controllers >>> load');
            },

            pageHome: function(){
                require(["bundle/app/home"], function(Home) {
                    App.mainRegion.show(new Home.View());
                });
            }
        });

        App.Router.processAppRoutes(new Controller(), {
            "": "pageHome",
            "home": "pageHome"
        });
    });

});
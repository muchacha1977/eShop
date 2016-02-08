/**
 * Created by GOODPROFY on 22.05.2015.
 */
define([
    'app',
    'bundle/catalog/controller/catalog',
    'bundle/authentication/controller/authentication',
    'bundle/registration/controller/registration',
    'bundle/cart/controller/cart',
    'bundle/buyer/controller/buyer',
    'bundle/trader/controller/trader',
    'bundle/producer/controller/producer',
    'bundle/manufacturer/controller/manufacturer',
    'bundle/page/controller/page'
],function(App){
    'use strict';
    return App.module("Controller", function (Controller, App, Backbone, Marionette, $, _) {

        this.pageHome = function(){
            require(["bundle/app/home"], function(Home) {
                App.mainRegion.show(new Home.View());
            });
        };

        App.appRoutes.set({
            "": "pageHome",
            "home": "pageHome",
            "*path" : "pageShop"
        });
    });

});
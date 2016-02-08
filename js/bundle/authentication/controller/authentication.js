/**
 * Created by GOODPROFY on 21.05.2015.
 */
define([
    "app"
], function(App) {
    'use strict';
    return App.module("Controller", function(Controller, App, Backbone, Marionette, $, _) {

        this.pageLogin = function(){
            require(["bundle/authentication/authentication"],
                function(Authentication){
                    App.getDialogRegion().show(new Authentication.View());
                }
            );
        };

        App.appRoutes.set({
            "login": "pageLogin"
        });

    });

});
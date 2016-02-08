/**
 * Created by GOODPROFY on 21.05.2015.
 */
define([
    "app"
], function(App) {
    'use strict';
    return App.module("Controller", function(Controller, App, Backbone, Marionette, $, _) {

        this.pageRegistration = function(){
            require(["bundle/registration/registration"],
                function(Registration){
                    App.dialogRegion.show(new Registration.AppLayoutView());
                }
            );
        };

        App.appRoutes.set({
            "registration": "pageRegistration"
        });

    });

});
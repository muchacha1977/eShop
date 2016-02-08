/**
 * Статические страницы
 * Created by GOODPROFY on 27.05.2015.
 */

define([
    "app"
], function(App) {
    'use strict';
    return App.module("Controller", function(Controller, App, Backbone, Marionette, $, _) {

        this.pageStatic = function(page){
            require(["bundle/page/page"],
                function(Page){
                    App.getMainRegion().show(new Page.View(page));
                }
            );
        };
        this.allPageStatic = function(page){
            console.log("allPageStatic!");
            require(["bundle/page/page"],
                function(Page){
                    App.getMainRegion().show(new Page.All(page));
                }
            );
        };

        App.appRoutes.set({
            "page/:page": "pageStatic",
            "page": "allPageStatic"
        });

    });

});
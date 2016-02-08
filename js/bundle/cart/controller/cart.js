define([
    "app",
    "model/user"
], function(App, Data) {
    'use strict';
    return App.module("Controller", function(Controller, App, Backbone, Marionette, $, _) {

        this.pageCart = function(){
            require(["bundle/cart/cart"],
                function(Cart){
                    App.getMainRegion().show(new Cart.Full());
                }
            );
        };
        this.pageCartTree = function(){
            require(["bundle/cart/cart"],
                function(Cart){
                    App.getMainRegion().show(new Cart.FullTree());
                }
            );
        };
        this.pageOrder = function(){
            require(["bundle/cart/cart"],
                function(Cart){
                    if ( Data.user.get('loggedIn') && Data.user.isBuyer() ) {
                        App.getMainRegion().show(new Cart.Order());
                        $(window).scrollTop(0);
                    }else{
                        require(["bundle/authentication/authentication"],
                            function(Authentication){
                                App.dialogRegion.show(new Authentication.View());
                            }
                        );
                        Data.user.on('change', function(args){
                            App.getMainRegion().show(new Cart.Order());
                        });
                    }
                }
            );
        };

        App.appRoutes.set({
            "cart": "pageCart",
            "cart/tree": "pageCartTree",
            "cart/order": "pageOrder"
        });
    });

});
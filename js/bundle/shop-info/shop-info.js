define([
    "app",
    "text!bundle/shop-info/view/info.html",
    "text!bundle/shop-info/view/shipment.html",
    "text!bundle/shop-info/view/conditions.html"],
    function(App, infoTpl, shipmentTpl, conditionsTpl) {

        return App.module("ShopInfo", function(ShopInfo, App, Backbone, Marionette, $, _) {

            ShopInfo.Info = Marionette.ItemView.extend({
                tagName: "div",

                className: "shop-info",

                template: _.template(infoTpl)
            });

            ShopInfo.Shipment = Marionette.ItemView.extend({
                tagName: "div",

                className: "shop-shipment",

                template: _.template(shipmentTpl)
            });

            ShopInfo.Conditions = Marionette.ItemView.extend({
                tagName: "div",

                className: "shop-conditions",

                template: _.template(conditionsTpl)
            });
        });

    }
);

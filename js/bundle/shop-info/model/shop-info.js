define(["app"], function(App) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Info = Backbone.Model.extend({
            default: {
                id: null
            },
            url: function() {
                return "rest/v0/shops/" + this.get('id') + "/info"
            }
        });

        var Shipment = Backbone.Model.extend({
            default: {
                id: null
            },
            url: function() {
                return "rest/v0/shops/" + this.get('id') + "/shipment2"
            }
        });

        var Conditions = Backbone.Model.extend({
            default: {
                id: null
            },
            url: function() {
                return "rest/v0/shops/" + this.get('id') + "/conditions"
            }
        });

        Data.ShopInfo = new Info();
        Data.ShopShipment = new Shipment();
        Data.ShopConditions = new Conditions();
    });
});


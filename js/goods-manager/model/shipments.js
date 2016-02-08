/**
 * Created by GOODPROFY on 13.05.2015.
 * @example var shipments = new Data.Shipments({id: value.shop.id});
 */
define(["app"], function (App) {

    App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

        Data.Shipments = Backbone.Collection.extend({
            initialize: function(options){
                this.url = 'rest/v0/shops/shipment/'+options.id
            }
        });

        Data.ShipmentsPrototype = new Backbone.Collection([
            {
                id: "SHIPMENT_TYPE_1",
                shipmentTypeImg: "fa fa-male",
                shipmentpop: "Экспресс доставка",
                className: ""
            },

            {
                id: "SHIPMENT_TYPE_2",
                shipmentTypeImg: "fa fa-truck",
                shipmentpop: "Доставка в течение 3-х дней",
                className: ""
            },

            {
                id: "SHIPMENT_TYPE_3",
                shipmentTypeImg: "fa fa-envelope-o",
                shipmentpop: "Доставка почтой",
                className: ""
            },

            {
                id: "SHIPMENT_TYPE_4",
                shipmentTypeImg: "fa fa-upload",
                shipmentpop: "Доставка в точку самозабора",
                className: ""
            },

            {
                id: "SHIPMENT_TYPE_5",
                shipmentTypeImg: "fa fa-suitcase",
                shipmentpop: "Самовывоз",
                className: ""
            }
        ]);
    });

    return App.Data;
});

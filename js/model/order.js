/**
 * Created by Misha on 08.04.2015.
 */
define(["app"], function (App) {

    return App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

        var _Order = Backbone.Model.extend({

            urlRoot : "rest/v0/order"

        });

        Data.Order = new _Order();


        Data.Orders = App.PageableCollection.extend({
            url: "rest/v0/order"
        });



        Data.stateViews = {
            "CREATED": {
                stateimg: "fa fa-check-circle-o",
                statepop: "Заказан",
                className: ""
            },
            "ACKNOWLEDGED": {
                stateimg: "fa fa-wrench",
                statepop: "В работе",
                className: "warning"
            },
            "ACCEPTED": {
                stateimg: "fa fa-thumbs-up",
                statepop: "Подтвержден",
                className: "success"
            },
            "SHIPPED": {
                stateimg: "fa fa-truck",
                statepop: "Доставлен",
                className: ""
            },
            "REJECTED_BY_BUYER": {
                stateimg: "fa fa-frown-o",
                statepop: "Отклонен покупателем",
                className: "danger"
            },
            "REJECTED_BY_TRADER": {
                stateimg: "fa fa-user-times",
                statepop: "Отклонен продавцом",
                className: "danger"
            },
            "ABANDONED": {
                stateimg: "fa fa-times",
                statepop: "Отвергнут",
                className: "danger"
            },
            "CLOSED": {
                stateimg: "fa fa-times",
                statepop: "Закрыта",
                className: ""
            }
        };

        Data.shipmentViews = {
            "SHIPMENT_TYPE_1": {
                shipmentTypeImg: "fa fa-male",
                shipmentpop: "Экспресс доставка",
                className: ""
            },
            "SHIPMENT_TYPE_2": {
                shipmentTypeImg: "fa fa-truck",
                shipmentpop: "Доставка в течение 3-х дней",
                className: ""
            },
            "SHIPMENT_TYPE_3": {
                shipmentTypeImg: "fa fa-envelope-o",
                shipmentpop: "Доставка почтой",
                className: ""
            },
            "SHIPMENT_TYPE_4": {
                shipmentTypeImg: "fa fa-upload",
                shipmentpop: "Доставка в точку самозабора",
                className: ""
            },
            "SHIPMENT_TYPE_5": {
                shipmentTypeImg: "fa fa-suitcase",
                shipmentpop: "Самовывоз",
                className: ""
            }

        };
    });

});
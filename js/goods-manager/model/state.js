/**
 * Created by GOODPROFY on 12.05.2015.
 */
define(["app"], function (App) {

    App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

        Data.State = new Backbone.Collection([
            {
                state: "CREATED",
                stateimg: "fa fa-check-circle-o",
                statepop: "Заказан",
                className: "",
                access: null
            },
            {
                state: "ACKNOWLEDGED",
                stateimg: "fa fa-wrench",
                statepop: "В работе",
                className: "warning",
                access: "trader"
            },
            {
                state: "ACCEPTED",
                stateimg: "fa fa-thumbs-up",
                statepop: "Подтвержден",
                className: "success",
                access: "trader"
            },
            {
                state: "SHIPPED",
                stateimg: "fa fa-truck",
                statepop: "Доставлен",
                className: "",
                access: "trader"
            },
            {
                state: "REJECTED_BY_BUYER",
                stateimg: "fa fa-frown-o",
                statepop: "Отклонен покупателем",
                className: "danger",
                access: null
            },
            {
                state: "REJECTED_BY_TRADER",
                stateimg: "fa fa-user-times",
                statepop: "Отклонен продавцом",
                className: "danger",
                access: "trader"
            },
            {
                state: "ABANDONED",
                stateimg: "fa fa-times",
                statepop: "Отвергнут",
                className: "danger",
                access: "buyer"
            },
            {
                state: "ACTIVE",
                stateimg: "fa fa-play-circle-o",
                statepop: "Активная",
                className: "success",
                access: null
            },
            {
                state: "CLOSED",
                stateimg: "fa fa-ban",
                statepop: "Закрытая",
                className: "default",
                access: null
            }

        ]);

        return App.Data;
    });

});
/**
 * Различные статусы
 * @version 0.0.2
 * Created by GOODPROFY on 12.05.2015.
 */
define(["app"], function (App) {

    return App.module("Data", function (Data, App, Backbone, Marionette, $, _) {
        "use strict";
        Data.StateShare = new Backbone.Collection([
            {
                state: "SHIPPED",
                stateimg: "fa fa-flag-checkered",
                statepop: "Доставлен",
                className: "",
                next: [],
                bulkActions: false,
                confirm: 'Применить статус "Доставлен"?',
                edit: false
            },
            {
                state: "CANCELLED_BY_BUYER",
                stateimg: "fa fa-times",
                statepop: "Отменен", //Отклонен покупателем
                className: "danger",
                next: [],
                bulkActions: false,
                confirm: 'Применить статус "Отменен"?',
                edit: false
            },
            {
                state: "REJECTED_BY_BUYER",
                stateimg: "fa fa-ban",
                statepop: "Отвергнут",
                className: "danger",
                next: [],
                bulkActions: false,
                confirm: 'Применить статус "Отвергнут"?',
                edit: false
            },
            {
                state: "CANCELLED_BY_TRADER",
                stateimg: "fa fa-times",
                statepop: "Отменен",
                className: "danger",
                next: [],
                bulkActions: false,
                confirm: 'Применить статус "Отменен"?',
                edit: false
            },
            {
                state: "REJECTED_BY_TRADER",
                stateimg: "fa fa-ban",
                statepop: "Отвергнут",
                className: "danger",
                next: [],
                bulkActions: false,
                confirm: 'Применить статус "Отвергнут"?',
                edit: false
            },
            {
                state: "SHIP",
                stateimg: "fa fa-flag-checkered",
                statepop: "Доставлен",
                className: "",
                next: [],
                bulkActions: true,
                confirm: 'Применить статус "Доставлен"?',
                edit: false
            },
            {
                state: "CANCEL",
                stateimg: "fa fa-ban",
                statepop: "Отмененить",
                className: "danger",
                next: [],
                bulkActions: true,
                confirm: 'Применить статус "Отменен"?',
                edit: false
            },
            {
                state: "CANCELLED",
                stateimg: "fa fa-ban",
                statepop: "Отменен",
                className: "danger",
                next: [],
                bulkActions: false,
                confirm: null,
                edit: false
            }
        ]);

        Data.StateBuyer = new Backbone.Collection([
            {
                state: "CREATED",
                stateimg: "fa fa-shopping-cart",
                statepop: "Заказан",
                className: "",
                next: ['CANCELLED_BY_BUYER', 'CANCEL'],
                bulkActions: false,
                confirm: null,
                edit: true
            },
            {
                state: "UNKNOWN",
                stateimg: "fa fa-shopping-cart",
                statepop: "Заказан",
                className: "",
                next: ['CANCELLED_BY_BUYER', 'CANCEL'],
                bulkActions: false,
                confirm: null,
                edit: true
            },
            {
                state: "ACCEPTED",
                stateimg: "fa fa-coffee",
                statepop: "В работе",
                className: "warning",
                next: ['CANCELLED_BY_BUYER', 'CANCEL'],
                bulkActions: false,
                confirm: null,
                edit: true
            },
            {
                state: "ACKNOWLEDGED",
                stateimg: "fa fa-check-square-o",
                statepop: "Подтвержден",
                className: "success",
                next: ['SHIPPED', 'REJECTED_BY_BUYER', 'CANCEL', 'SHIP'],
                bulkActions: false,
                confirm: null,
                edit: false
            }
        ]);

        Data.StateTrader = new Backbone.Collection([
            {
                state: "CREATED",
                stateimg: "fa fa-shopping-cart",
                statepop: "Заказан",
                className: "",
                next: ['CANCELLED_BY_TRADER', 'ACCEPTED', 'CANCEL', 'ACCEPT'],
                bulkActions: false,
                confirm: null,
                edit: true
            },
            {
                state: "UNKNOWN",
                stateimg: "fa fa-shopping-cart",
                statepop: "Заказан",
                className: "",
                next: ['CANCELLED_BY_TRADER', 'ACCEPTED', 'CANCEL', 'ACCEPT'],
                bulkActions: false,
                confirm: null,
                edit: true
            },
            {
                state: "ACCEPTED",
                stateimg: "fa fa-coffee",
                statepop: "В работе",
                className: "warning",
                next: ['CANCELLED_BY_TRADER', 'ACKNOWLEDGED', 'CANCEL', 'ACKNOWLEDGE'],
                bulkActions: false,
                confirm: 'Применить статус "В работе"?',
                edit: true
            },
            {
                state: "ACKNOWLEDGED",
                stateimg: "fa fa-check-square-o",
                statepop: "Подтвержден",
                className: "success",
                next: ['REJECTED_BY_TRADER', 'SHIPPED', 'CANCEL', 'SHIP'],
                bulkActions: false,
                confirm: 'Применить статус "Подтвержден"?',
                edit: false
            },
            {
                state: "ACCEPT",
                stateimg: "fa fa-coffee",
                statepop: "В работу",
                className: "warning",
                next: ['CANCELLED_BY_TRADER', 'ACKNOWLEDGED'],
                bulkActions: true,
                confirm: 'Применить "В работу"?',
                edit: true
            },
            {
                state: "ACKNOWLEDGE",
                stateimg: "fa fa-check-square-o",
                statepop: "Подтвердить",
                className: "success",
                next: ['REJECTED_BY_TRADER', 'SHIPPED'],
                bulkActions: true,
                confirm: 'Применить "Подтвержден"?',
                edit: false
            }
        ]);

        Data.StateBuyer.add(Data.StateShare.toJSON(), {silent : true});
        Data.StateTrader.add(Data.StateShare.toJSON(), {silent : true});

        /**
         * TODO deprecated
         * @type {Backbone.Collection}
         */
        Data.State = new Backbone.Collection([
            {
                state: "CREATED",
                stateimg: "fa fa-check-circle-o",
                statepop: "Заказан",
                className: "",
                access: null
            },
            {
                state: "ACCEPTED",
                stateimg: "fa fa-wrench",
                statepop: "В работе",
                className: "warning",
                access: "trader"
            },
            {
                state: "ACKNOWLEDGED",
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
                state: "CANCELLED_BY_BUYER",
                stateimg: "fa fa-frown-o",
                statepop: "Отклонен", //Отклонен покупателем
                className: "danger",
                access: null
            },
            {
                state: "CANCELLED_BY_TRADER",
                stateimg: "fa fa-user-times",
                statepop: "Отклонен", //Отклонен продавцом
                className: "danger",
                access: "trader"
            },
            {
                state: "REJECTED_BY_BUYER",
                stateimg: "fa fa-frown-o",
                statepop: "Отвергнут покупателем",
                className: "danger",
                access: null
            },
            {
                state: "REJECTED_BY_TRADER",
                stateimg: "fa fa-user-times",
                statepop: "Отвергнут продавцом",
                className: "danger",
                access: "trader"
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
                statepop: "Закрыт",
                className: "default",
                access: null
            }

        ]);

        Data.getAccessEdit = function( collection, state ){
            var f = collection.where({state: state, edit: false});
            return _.isEmpty(f);
        }
    });

});
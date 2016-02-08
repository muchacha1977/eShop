/**
 * Модель
 * Data.Payment - Объект данных
 * Data.TraderPayment - Модель
 * Data.TraderPaymentCollection - Коллекция
 * Data.incomingTotal() - Общее количество  Приходa
 * Data.costsTotal() - Общее количество  Расход
 * Data.balance() -
 *
 */
define(["app", "moment"], function(App, moment) {
    'use strict';
    App.module("Data", function(Data, App, Backbone, Marionette, $, _) {
        var TraderPayment = Backbone.Model.extend({});
        Data.TraderPaymentCollection = App.PageableCollection.extend({
            model: TraderPayment,
            url: " rest/v0/payment/list", //TODO: REST
            initialize: function() {
                var paymentTotalObject = {};
				
				_.bindAll(this, 'getQ');
				this.state.q = this.getQ;
				
                $.ajax({
                    url: "rest/v0/payment/list",
                    success: function(data) {
                        paymentTotalObject = {
                            "type": data.type,
                            "incomingTotal": data.incomingTotal,
                            "costsTotal": data.costsTotal,
                            "balance": data.balance
                        };
                        Data.Payment.Collection = paymentTotalObject;
                    }
                });
            },
			formFilter : {
				startDate	: null,
				endDate		: null
			},
			getQ: function() {
				var q = [];
				var i = 0;
				if(this.formFilter.startDate !== null) {
					q[i] = 'startDate.eq('+moment(this.formFilter.startDate, "DD.MM.YY").format("x")+')';
					i++;
				}
				if(this.formFilter.endDate !== null) {
					q[i] = 'endDate.eq('+moment(this.formFilter.endDate, "DD.MM.YY").format("x")+')';
				}
				return (q.length>0) ? q.join('.and.') : "";

			}
        });
        Data.Payment = {
            urlFetch: "rest/v0/payment/list",
            Model: TraderPayment,
            Collection: Backbone.Collection.extend(),
            Payments: Backbone.Collection.extend(),
            incomingTotal: function() {
                console.log("Data.Payment.Collection in incomingTotal  " + JSON.stringify(Data.Payment.Collection, null, 4));
                return Data.Payment.Collection.incomingTotal;
            },
            costsTotal: function() {
                return Data.Payment.Collection.costsTotal;
            },
            balance: function() {
                return Data.Payment.Collection.balance;
            }
        }
    });
    return App.Data;
});
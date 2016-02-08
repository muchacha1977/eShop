
define(["app"],
    function (App) {
        'use strict';
        App.module("Data", function (Data, App, Backbone, Marionette, $, _) {


            var TraderProduct = Backbone.Model.extend({ });
			
			Data.TraderProductsCollection = App.PageableCollection.extend({
				url: "rest/v0/offer/s",
                model: TraderProduct,
			});

/*            Data.TraderProductsCollection = App.PageableCollection.extend({
                //mode: "server",
                model: TraderProduct,
                query: "",
                queryParams: {
                    currentPage: "p",
                    pageSize: "1",
                    totalPages: null,
                    totalRecords: null
                },

                url: "rest/v0/offer/s",

                state: { pageSize: 10 },

                parseRecords: function(resp) { return resp.data; },

                parseState: function (resp, queryParams, state, options) {
                    return { totalRecords: resp.total };
                }
            });*/


        });

        return App.Data;
    }
);

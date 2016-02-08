define(["app", "backbone.paginator"], function(App) {
    App.module("Pageable", function(Pageable, App, Backbone, Marionette, $, _) {
        Pageable.Collection = Backbone.PageableCollection.extend({

            mode: "server",

            queryParams: {
                currentPage: "p",
                pageSize: "l",

                totalPages: null,
                totalRecords: null
            },

            state: {
                pageSize: 10
            },

            parseRecords: function(result) {
                return result.data;
            },

            parseState: function (resp, queryParams, state, options) {
                return { totalRecords: resp.total };
            }

        });

    });
    return App.Pageable;
});


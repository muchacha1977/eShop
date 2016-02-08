define([
        "app",
        "bundle/common/collection/pageable-collection"
    ],
    function (App, PageableCollection) {
        'use strict';
        App.module("Data", function (Data, App, Backbone, Marionette, $, _) {


            var TraderProduct = Backbone.Model.extend({ });

            Data.TraderOrdersCollection = PageableCollection.Collection.extend({
                model: TraderProduct,

                url: "rest/v0/order"
            });


        });

        return App.Data;
    }
);

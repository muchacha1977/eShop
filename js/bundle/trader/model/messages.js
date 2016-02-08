define(["app",
        "backbone",
        "bundle/common/collection/pageable-collection"],
    function (App, Backbone, PageableCollection) {
        'use strict';
        App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

            var TraderMessage = Backbone.Model.extend({ });

            Data.TraderMessageCollection = PageableCollection.Collection.extend({
                model: TraderMessage,
                url: "rest/v0/shop/message"
            });

        });

        return App.Data;
    }
);

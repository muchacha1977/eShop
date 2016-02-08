define([
        "app",
        "text!bundle/buyer/view/messages/messages.html"
    ],
    function (
        App,
        viewMessages
    ) {
        'use strict';
        return App.module("Buyer.Messages", function (Messages, App, Backbone, Marionette, $, _) {

            this.ContainerView = Marionette.LayoutView.extend({
                template: _.template(viewMessages),

                regions: {
                    listRegion: "#shop-messages-list",
                    pagerRegion: "#shop-messages-pagination"
                }
            });



        });
    }
);
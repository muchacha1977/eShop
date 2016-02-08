define(["app",
        "backbone",
        "bundle/common/paginator",
        "marionette",
        "bundle/trader/model/messages",
        "text!bundle/trader/view/messages/container.html",
        "text!bundle/trader/view/messages/list.html",
        "text!bundle/trader/view/messages/item.html"
    ],
    function (App, Backbone, Paginator, Marionette,
              Data,
              containerTpl,
              listTpl,
              itemTpl) {
        'use strict';
        App.module("Messages", function (Messages, App, Backbone, Marionette, $, _) {

            var MessageItemView = Marionette.ItemView.extend({
                template: _.template(itemTpl),
                tagName: "tr"
            });

            var MessageListView = Marionette.CompositeView.extend({
                template: _.template(listTpl),
                childView: MessageItemView,
                childViewContainer: "tbody",
            });

            this.View = Marionette.LayoutView.extend({
                template: _.template(containerTpl),

                regions: {
                    listRegion: "#shop-messages-list",
                    pagerRegion: "#shop-messages-pagination"
                },

                onShow: function() {
                    var messages = new Data.TraderMessageCollection();
                    var self = this;
                    messages.fetch({
                        reset:true,
                        success: function(collection, response, options) {
                            if (messages.state.totalPages > 1 ) {
                                var paginator = new Paginator.Paginator({collection: messages});
                                self.pagerRegion.show(paginator);
                            }
                        }
                    });
                    this.listRegion.show(new MessageListView({collection:messages}));

                }
            });



        });

        return App.Messages;
    }
);

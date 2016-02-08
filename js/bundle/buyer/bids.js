/**
 * Заявки
 * @version 0.0.1
 * Created by Yuriy Dolganov(GOODPROFY) on 19.05.2015.
 */

define([
        "app",
        "text!bundle/buyer/view/bids/bids.html"
    ],
    function (
        App,
        buyerAsksTpl
    ) {

        return App.module("Buyer.Bids", function (Bids, App, Backbone, Marionette, $, _) {


            Bids.ContainerView = Marionette.LayoutView.extend({

                initialize: function (subTab) {
                    this.subTab = subTab;
                },

                template: _.template(buyerAsksTpl),

                regions: {
                    mainRegion: "#buyer-bids-region"
                },

                onShow: function () {
                    var self = this;
                    if (typeof this.subTab !== "string") this.subTab = "active";

                    require(['bundle/buyer/bids-'+this.subTab], function(BuyerTab){
                        self.mainRegion.show(new BuyerTab.ContainerView(self.subTab));
                    });

                    this.$('a[href$="' + this.subTab + '"]').tab("show");
                }
            });

            Bids.onStart = function () {
                console.log("Buyer.Bids >>> view started");
            };

            Bids.onStop = function () {
                console.log("Buyer.Bids <<< view stopped");
            };
        });

    });
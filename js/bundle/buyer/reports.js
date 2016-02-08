define([
    "app",
    "text!bundle/trader/view/reports/container.html"
], function(
    App,
    View
){
    return App.module("Buyer.Orders", function (Orders, App, Backbone, Marionette, $, _) {


        this.ContainerView = Marionette.LayoutView.extend({

            initialize: function (subTab) {
                this.subTab = subTab;
            },

            template: _.template(View),

            regions: {
                mainRegion: "#region-main"
            },

            onShow: function () {
                if (typeof this.subTab !== "string")
                    this.subTab = "sale";
                var self = this;
                require(["bundle/trader/reports-" + this.subTab], function (subReport) {
                    self.mainRegion.show(new subReport.View());
                });
                this.$('a[href$="' + this.subTab + '"]').tab("show");
            }
        });

        this.onStart = function () {
            console.log("Trader.Orders >>> view started");
        };

        this.onStop = function () {
            console.log("Trader.Orders <<< view stopped");
        };

    });
});
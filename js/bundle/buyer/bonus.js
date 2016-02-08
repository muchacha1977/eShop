/**
 * Buyer.Bonus
 * @version 0.0.2
 * @description Бонусы и рефералы
 * Created by GOODPROFY on 19.05.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/bonus/bonus.html'
],function(
    App,
    viewBonus
){
    return App.module("Buyer.Bonus", function (Bonus, App, Backbone, Marionette, $, _) {

        this.onStart = function () {
            console.log("Buyer.Bonus >>> started");
        };

        this.onStop = function () {
            console.log("Buyer.Bonus <<< stopped");
        };

        this.ContainerView = Marionette.LayoutView.extend({

            initialize: function (subTab) {
                this.subTab = subTab;
            },

            template: _.template(viewBonus),

            regions: {
                mainRegion: "#buyer-bonus-region"
            },

            onShow: function () {
                var self = this;
                if (typeof this.subTab !== "string") this.subTab = "history";

                require(['bundle/buyer/bonus-'+this.subTab], function(BuyerTab){
                    self.mainRegion.show(new BuyerTab.ContainerView(self.subTab));
                });

                this.$('a[href$="' + this.subTab + '"]').tab("show");
            }
        });
    });
});

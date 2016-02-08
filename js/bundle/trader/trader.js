/**
 * Trader v.0.0.7
 */

define([
    "app",
    "text!bundle/trader/view/container.html"
], function(
    App,
    containerTpl
){
    return App.module("Trader", function(Trader, App, Backbone, Marionette, $, _) {


        Trader.Container = Marionette.LayoutView.extend({
            template: _.template(containerTpl),

            regions: {
                mainRegion: '#region-main'
            },

            initialize: function(opts){
                this.tab = opts.tab;
                this.subTab = opts.subTab;
                //this.isFullProfileTrader();
            },
            isFullProfileTrader: _.once(function(){

                if (App.User.isTrader() ){

                    if ( typeof App.User.get('full_profile') === 'undefined' || App.User.get('full_profile') == false ){
                        this.tab = 'profile';
                        App.navigate('trader/profile');
                    }
                }
            }),
            onRender: function () {
                var self = this;

                if (typeof this.tab !== "string") this.tab = "orders";

                require(['bundle/trader/'+this.tab], function(Trader){
                    self.mainRegion.show(new Trader.View(self.subTab));
                });

                this.$('a[href$="' + this.tab + '"]').tab("show");
            }
        });


        Trader.onStart = function() {
            console.log("trader module started");

        };

        Trader.onStop = function() {
            console.log("trader module stopped");
        };

    });
});
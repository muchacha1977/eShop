/**
 * Trader v.0.0.7
 */

define([
    "app",
    "text!bundle/producer/view/container.html"
], function(
    App,
    containerTpl
){
    return App.module("Producer", function(Producer, App, Backbone, Marionette, $, _) {

        Producer.Container = Marionette.LayoutView.extend({

            template: _.template(containerTpl),

            regions: {
                mainRegion: '#region-main'
            },

            initialize: function(opts){
                this.tab = opts.tab;
                this.subTab = opts.subTab;
				
				if(!App.User.isProducer()) {
					App.navigate('home',true);
				}
				
            },

            onRender: function () {
                var self = this;
                if (typeof this.tab !== "string") this.tab = "site";

                require(['bundle/producer/'+this.tab], function(Producer){
                    self.mainRegion.show(new Producer.View(self.subTab));
                });

                this.$('a[href$="' + this.tab + '"]').tab("show");
            }

        });


        Producer.onStart = function() {
            console.log("Producer module started");
        };

        Producer.onStop = function() {
            console.log("Producer module stopped");
        };

    });
});
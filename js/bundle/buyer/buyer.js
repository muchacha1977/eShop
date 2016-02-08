/**
 * Buyer - Покупатель
 * @version 0.0.2
 */

define([
        "app",
        "text!bundle/buyer/view/buyer.html"
    ],
    function (
        App,
        buyerContainerTpl
    ) {
        return App.module("Buyer", function (Buyer, App, Backbone, Marionette, $, _) {

            Buyer.ContainerView = Marionette.LayoutView.extend({

                template: _.template(buyerContainerTpl),

                regions: {
                    mainRegion: "#buyer-view-region"
                },

                initialize: function (options) {
                    this.tab = options.tab;
                    this.subTab = options.subTab;
                    App.Data.user.on('change', function(){
                        var user = App.Data.user;
                        if (user.get("loggedIn")) {
                            if (user.isTrader()) {
                                App.navigate("trader", {trigger: true});
                            } else {
                                App.navigate("buyer", {trigger: true});
                            }
                        } else {
                            App.navigate("home", {trigger: true});
                        }
                    });
                },

                onShow: function () {
                    var self = this;
                    if (typeof this.tab !== "string") this.tab = "orders";

                    require(['bundle/buyer/'+this.tab], function(BuyerTab){
                        self.mainRegion.show(new BuyerTab.ContainerView(self.subTab));
                    });

                    this.$('a[href$="' + this.tab + '"]').tab("show");
                }

            });



            Buyer.onStart = function () {
                console.log("buyer view started");
                if ( App.User.isTrader() ||  App.User.get('loggedIn') == false ){
                    App.navigate("home", {trigger: true});
                }
            };

            Buyer.onStop = function () {
                console.log("buyer view stopped");
            };

        });
    }
);
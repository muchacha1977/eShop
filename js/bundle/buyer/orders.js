define([
        "app",
        "text!bundle/buyer/view/order/orders.html"
    ],
    function (App,
              buyerOrdersTpl) {

        return App.module("Buyer.Orders", function (Orders, App, Backbone, Marionette, $, _) {


            this.ContainerView = Marionette.LayoutView.extend({

                initialize: function (subTab) {
                    this.subTab = subTab;
                },

                template: _.template(buyerOrdersTpl),

                regions: {
                    main: "#buyer-orders-region"
                },

                onShow: function () {
                    if (typeof this.subTab !== "string")
                        this.subTab = "current";
                    var self = this;
                    require(["bundle/buyer/orders-" + this.subTab], function (subOrders) {
                        self.main.show(new subOrders.ContainerView());
                    });
                    this.$('a[href$="' + this.subTab + '"]').tab("show");
                }
            });

            this.onStart = function () {
                console.log("Buyer.Orders >>> view started");
            };

            this.onStop = function () {
                console.log("Buyer.Orders <<< view stopped");
            };

        });
    });
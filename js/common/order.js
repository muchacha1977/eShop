define([
          "app",
          "model/user",
          "text!view/order-dialog.html"
        ],
    function (App, Data, orderDialogTpl) {
        App.module("Order", function (Order, App, Backbone, Marionette, $, _) {

            var Offer = Backbone.Model.extend({

                url: function() {
                    return "rest/v0/offer/" + this.id;
                },

                initialize: function(options) {
                    options = options || {};
                    this.id = options.id;
                }

            });

            var OrderGroup = Backbone.Model.extend({
                url: "rest/v0/ordergroup"

            });

            var Address = Backbone.Model.extend({});

            var Addresses = Backbone.Collection.extend({
                model: Address,
                url: "rest/v0/buyer/address"
            });

            var AddressItemView = Marionette.ItemView.extend({
                tagName: "option",
                attributes: function() {
                    var attrs = {id: this.model.get("id")};
                    if (this.model.get("deflt")) {
                        attrs.value = true;
                    }
                    return attrs;
                },
                template: _.template("<%=name%>")   // TODO move it into template, add part of data
            });

            var AddressComboBox = Marionette.CollectionView.extend({
                childView: AddressItemView,
                tagName:"select",
                className:"form-control",
                id: "shipment-address-selector"
            });

            var Shipment = Backbone.Model.extend({});

            var Shipments = Backbone.Collection.extend({
                model: Shipment,
                shopId : "",
                url: function() {
                    return "rest/v0/shops/shipment/" + this.shopId;
                }
            });

            var ShipmentItemView = Marionette.ItemView.extend({
                tagName: "option",
                attributes: function() {
                    return { value: this.model.get("type") };
                },
                template: _.template("<%=description%> - <%=price%> р.,  <%=days%> дней")   // TODO move it into template
            });

            var ShipmentComboBox = Marionette.CollectionView.extend({
                childView: ShipmentItemView,
                tagName:"select",
                className:"form-control",
                id: "shipment-method-selector"
            })

            Order.Dialog = Marionette.LayoutView.extend({

                template: _.template(orderDialogTpl),

                regions: {
                    addressCombo: "#shipment-address-combobox",
                    shipmentCombo:"#shipment-method-combobox"
                },

                events: {
                    "click #order-ok":"onCreate",
                    "hidden.bs.modal":"onClose",

                    "keyup #order-quantity": "recalcTotal"
                },

                recalcTotal: function() {
                    var total = this.$("#order-quantity").val();
                    this.$("#order-total-amount").html(this.model.get("price") * total);
                },

                onCreate: function() {
                    var Model = Backbone.Model.extend({ url: "rest/v0/ordergroup" });
                    var __model = new Model({
                        items: [
                            {
                                offerId: this.model.get("offerId"),
                                price: this.model.get("price"),
                                quantity: new Number(this.$("#order-quantity").val())
                            }
                        ],
                        shipmentType: this.$("#shipment-method-selector").val(),
                        shipmentAddress: this.$("#shipment-address-selector").val()

                    });
                    __model.save( null,
                        {
                            dataType: "text",
                            success: function(model, response, options) {
                                App.dialogRegion.$el.modal("hide");
                            },
                            error: function(model, response, options) {
                                console.error("save order failed: " + response.status);
                            }
                        });
                },

                onClose: function() {
                    this.remove();
                    App.dialogRegion.$el.clear();
                }

            });

            Order.buy = function(offerId) {
                var offer = new Offer({id: offerId});
                offer.fetch({
                    success: function () {
                        var __offer = offer.toJSON();
                        var order = new OrderGroup({
                            offerId: __offer.id,
                            product: __offer.product,
                            price: __offer.price
                            });
                        var st = __offer.shipmentTypes;
                        var shipmentTypes = {           // TODO ugly, select more appropriate data model
                            SHIPMENT_TYPE_1:st.type1,
                            SHIPMENT_TYPE_2:st.type2,
                            SHIPMENT_TYPE_3:st.type3,
                            SHIPMENT_TYPE_4:st.type4,
                            SHIPMENT_TYPE_5:st.type5
                        };
                        var dialog = new Order.Dialog({model: order });
                        dialog.on("show", function() {
                            dialog.render();
                            var shipments = new Shipments();
                            shipments.shopId = __offer.shop.id;
                            shipments.fetch({
                                success : function(shipments, response, options) {
                                    var filtered = shipments.filter(function(shipment) {
                                        return shipmentTypes[shipment.get("type")] === true;
                                    });
                                    var Collection = Backbone.Collection.extend({});
                                    var filteredCollection = new Collection(filtered);
                                    dialog.shipmentCombo.show(new ShipmentComboBox({collection: filteredCollection}))
                                }
                            });
                            var addresses = new Addresses();
                            addresses.fetch({
                                success : function(addresses, response, options) {
                                    dialog.addressCombo.show(new AddressComboBox({collection: addresses}))
                                }
                            });
                        });
                        App.getRegion("dialogRegion").show(dialog);

                    },
                    error: function(offer, xhr) {
                        console.log("fetch offer error: " + xhr.status);
                    }
                });
            };


        });
        return App.Order;
    }
);
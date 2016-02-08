/**
 * Bid
 * @version 0.0.2
 * Created by GOODPROFY on 01.06.2015.
 */
define([
        "app",
        "text!bundle/bid/view/bid.html",
        "moment",
        "model/bid",
        "model/regions",
		"model/shipments"
    ],
    function (
        App,
        viewBid,
        moment,
        Data,
        DataRegions
    ) {
        return App.module("Bid", function(Bid, App, Backbone, Marionette, $, _) {
            var BidView = Marionette.ItemView.extend({
                initialize: function(options){
                    console.log(options);
                    var bid = new Data.Bid.Model();
                    this.model = bid;
                    var prodId = options.id;
					var self = this;
                    this.model.set( {
						productId	: prodId
					});
					this.additional = {
						regionData: null,
						shipments: Data.ShipmentsPrototype.toJSON()
					};

                    DataRegions.start();
                    DataRegions.Collection.fetch({reset:true}).done(function(){
						self.additional.regionData = DataRegions.Collection.toJSON();
						DataRegions.stop();
                        self.render();
                    });
                },
                template: _.template(viewBid),
                events: {
                    'click #modal-btn-yes'	: 'onSave',
                    'keyup #bidDateInp'		: 'onbidDateInp',
                    'change #bidDateInp'	: 'onbidDateInp'
                },
				changeSum: function() {
					var sum = this.model.get('unitPrice') * this.$('#bidCount').val();
					this.$('#bidSum').val( (!sum) ? '-' : App.decimal(sum) );
				},
                onSave: function(){
					
					var self = this;
					var shipments = {};
					_.each(self.$el.find('.bidShipmentTypes:checked'), function(value){
						shipments[$(value).val()] = true;
					});
					this.model.set({
						shipmentTypes	: shipments
					}, {silent: true});
					
                    this.model.save(null, {
                        dataType: "text",
                        success: function(model, response, options) {
                            App.dialogRegion.$el.modal("hide");
                            App.alert({message: 'Заявка успешно размещена.'});
                        },
                        error: function(model, response, options) {
                            console.error("save bid failed: " + response.status);
                        }
                    });
                },
                onbidPrice: function() {
                    var bidPrice = this.$('#bidPrice').val().replace(',','.');
                    this.model.set({unitPrice: bidPrice});
					this.changeSum();
                },
                onbidDateInp: function() {
                    var bidDateInp = this.$('#bidDateInp').val();
                    this.model.set({validUntil: moment(bidDateInp, "DD.MM.YY HH:mm").format("x")});
                },
                onbidDeliveryDate: function() {
                    var bidDeliveryDate = this.$('#bidDeliveryDate').val();
                    this.model.set({deliveryDate: moment(bidDeliveryDate, "DD.MM.YY HH:mm").format("x")});
                },
                onbidCount: function() {
                    var bidCount = this.$('#bidCount').val();
                    this.model.set({quantity: bidCount});
					this.changeSum();
                },
				onbidRegion: function() {
					this.model.set({region	: String(this.$('#bidRegion').val())})
				},
                onRender: function(){
                    var self = this;

                    this.$('#bidDate').datetimepicker({
                        format: 'DD.MM.YY HH:mm',
						minDate: moment()
                        //defaultDate: moment(self.model.get('till_date'), "DD.MM.YYYY")
                    });
					this.$('#bidDeliveryDateCalendar').datetimepicker({
                        format: 'DD.MM.YY HH:mm',
						minDate: moment()
                        //defaultDate: moment(self.model.get('till_date'), "DD.MM.YYYY")
                    });
                    this.$('#bidDate').on("dp.change",function (e) {
                        self.onbidDateInp(e);
                    });
                    this.$('#bidDeliveryDateCalendar').on("dp.change",function (e) {
                        self.onbidDeliveryDate(e);
                    });
                    this.$('#bidDate').mask("99.99.99 99:99");

                    this.$("#bidPrice").bind('keyup', function(){
                        self.onbidPrice();
                    });
					this.model.set({region	: String(this.$('#bidRegion').val())}, {silent: true});
					this.$("#bidRegion").bind('change', function(){
                        self.onbidRegion();
                    });
                    this.$("#bidCount").bind('keyup', function(){
                        self.onbidCount();
                    });
                },
				serializeData: function(){
					var self = this;
					return _.extend(this.model.toJSON(), self.additional);
				}
            });


            Bid.Start = function(options){
                var options = options || {};
                if(App.Data.user.isBuyer())
                    App.dialogRegion.show( new BidView(options) );
                else {
                    require(['bundle/authentication/authentication'], function(Authentication){
                        App.dialogRegion.show(new  Authentication.View());
                    });

                    App.Data.user.once('change', function(args){
                        if ( App.Data.user.isBuyer() ){
                            App.dialogRegion.destroy();
                            App.dialogRegion.show( new BidView(options) );
                        }

                    });
                }
            }


        });
    }
);
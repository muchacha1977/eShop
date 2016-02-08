define(["app",
        "bundle/common/collection/pageable-collection",
		"moment",
        "model/regions",
        "model/order",
        "bundle/trader/model/bids"], function(App, PageableCollection, moment, DataRegions) {
	return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Model = Backbone.Model.extend({

			defaults: {
				unitPrice: "0.00",
				quantity: 0,
				shop : {
					rating : 1
				},
				shipmentTypes: {
					SHIPMENT_TYPE_1: true,
					SHIPMENT_TYPE_2: true,
					SHIPMENT_TYPE_3: true,
					SHIPMENT_TYPE_4: true,
					SHIPMENT_TYPE_5: true,
				},
				shipmentTime: null
			},
            url: function() {
				return "rest/v0/ask/"
			},
			initialize: function() {
				this.url = 'rest/v0/bid/'+this.get('bidId')+'/ask';
				if(this.isNew() === false) {
					this.url += '/'+this.get('id');
				}
				this.getSTFormatted();
				this.on('change:shipmentTime', this.getSTFormatted);
			},
			getSTFormatted: function() {
				var self = this;
				this.set({
					'shipmentTimeFormatted': moment(self.get('shipmentTime'), "x").format("DD.MM.YY HH:mm")
				}, {silent: true});
			},
			getIcons: function() {
				var shipmentTypes = Data.shipmentViews;
				var icons = {};
				var activeShipmentTypes = this.get('shipmentTypes');
				for(var k in activeShipmentTypes) {
					if(activeShipmentTypes[k] === true)
						icons[k] = shipmentTypes[k];
				}
				return icons;
			},
			validate: function(attr,opts) {
				var errors = [];
				attr.unitPrice = Number(attr.unitPrice);
				attr.quantity = Number(attr.quantity);
				
				if(!attr.unitPrice) {
					errors.push({
						id		: 'askPrice',
						error	: 'Неверно указана цена',
					});
				}
				if( attr.minPrice > 0 && attr.unitPrice > attr.minPrice) {
					errors.push({
						id		: 'askPrice',
						error	: 'Ваша цена не может быть больше цены покупателя',
					});
				}
				if(!attr.quantity || attr.quantity<1) {
					errors.push({
						id		: 'askQuantity',
						error	: 'Неверно указано количество',
					});
				}
				if(attr.shipmentTypes.length <1) {
					errors.push({
						id		: 'askShipment',
						error	: 'Не выбраны допустимые способы доставки',
					});
				}
				if(errors.length > 0) {
					return errors;
				}
			}

        });

        Data.Ask = Model;
		
		//Data.Responses = PageableCollection.Collection.extend({
		Data.Asks = PageableCollection.Collection.extend({
                model: Model,
				initialize: function(options) {
					if(typeof options != 'undefined' && typeof options.id != 'undefined')
						this.url =  "rest/v0/bid/"+options.id+"/ask";
				}
            });
    });
});
define([
        "app",
        "bundle/common/collection/pageable-collection",
        "moment",
        "model/regions"
    ],
    function (App, PageableCollection, moment, DataRegions) {
        'use strict';
        App.module("Data", function (Data, App, Backbone, Marionette, $, _) {


            Data.Bid = Backbone.Model.extend({
				defaults: {
					state			: "CREATED",
					validUntil		: "",
					deliveryDate	: "",
					totalPrice		: 0,
					responses		: 0,
					regionName		: ""
				},
				initialize: function() {
					var obj = {
						creationTime: moment(this.get('creationTime'), "x").format('DD.MM.YY HH:mm')
					};
					if(this.get('totalPrice') === 0) {
						obj.totalPrice = this.get('quantity')*this.get('unitPrice');
					}
					if(this.get('validUntil') !== "") {
						obj.validUntil= moment(this.get('validUntil'), "x").format('DD.MM.YY HH:mm');
					}
					if(this.get('deliveryDate') !== "") {
						obj.deliveryDate= moment(this.get('deliveryDate'), "x").format('DD.MM.YY');
					}
					this.set(obj, {silent: true});
				},
				getRegion: function() {
					var self = this;
					DataRegions.start();
					DataRegions.Collection.fetch({reset:true}).done(function(){
                        self.set({
							regionName: DataRegions.Collection.get(self.get('region')).get('name')
						})
                    });
				}
			});

            Data.TraderBidsCollection = PageableCollection.Collection.extend({
                model: Data.Bid,

                url: "rest/v0/bid",
				
				initialize: function() {
					var self = this
					DataRegions.start();
					this.on('change', this.onChange);
                    DataRegions.Collection.fetch({reset:true}).done(function(){
                        self.onChange();
                    });
				},
				onChange: function() {
					var self = this;
					var Regions = DataRegions.Collection;
					_.each(self.models, function(bid){
						var region = bid.get('region');
						if(typeof region !== 'undefined')
							bid.set({regionName:  Regions.get(region).get('name')});
						else
							bid.set({regionName: 'Не указано!'});
					});
				}
				
            });

        });

        return App.Data;
    }
);

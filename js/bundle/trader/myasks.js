define([
        "app",
        "bundle/common/paginator",
        "bundle/common/collection/pageable-collection",
        "model/regions",
		"text!bundle/trader/view/ask/myasks-container.html",
		"text!view/product-link.html",
        "bundle/modal/modal",
        "bundle/trader/model/bids",
		
        "model/state"
	],
    function (App,
              Paginator,
			  PageableCollection, 
			  DataRegions,
			  containerTpl,
			  viewProductLink,
			  Modal,
			  Data
    ) {
        'use strict';
        App.module("myAsks", function (myAsks, App, Backbone, Marionette, $, _) {
			
			
			
			var AskBid = Backbone.Model.extend({

				defaults: {
					unitPrice: "0.00",
					quantity: 0,
					shop : {
						rating : 1
					},
					bid: {
						name: null
					},
					product: {

					},
					buyer: {

					}
				},
				url: "rest/v0/ask/",
				initialize: function() {

					this.url = 'rest/v0/bid/'+this.get('bidId')+'/ask';
					this.on('change:shipmentTypes',this.onChangeShipmentTypes);
					this.onChangeShipmentTypes();
					this.on('change:bid.regionName',this.setBidModel);
					this.setBidModel();
				},
				setBidModel: function() {
					this.set({bidModel: this.getBidModel().toJSON()}, {silent: true});
				},
				getBidModel: function() {
					return new Data.Bid(_.extend(this.get('bid'), {product: this.get('product')}));
				},
				onChangeShipmentTypes: function() {
					var shipmentTypes = Data.shipmentViews;
					var icons = {};
					for(var k in this.get('shipmentTypes')) {
						icons[k] = shipmentTypes[k];
					}
					this.set('icons', icons);
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
					if(attr.unitPrice > attr.minPrice) {
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

			var AsksBids = PageableCollection.Collection.extend({
					model: AskBid,
					url: 'rest/v0/ask/',
					initialize: function() {
						DataRegions.start();
						var self = this;
						this.on('change', this.onChange);
						DataRegions.Collection.fetch({reset:true}).done(function(){
							self.trigger('change');
						});
					},
					onChange: function() {
						var self = this;
						var Regions = DataRegions.Collection;
						_.each(self.models, function(ask){
							var region = ask.get('bid').region;
							if(typeof region !== 'undefined') {
								ask.get('bid').regionName = Regions.get(region).get('name');
								//ask.get('bidModel').set({regionName:  Regions.get(region).get('name')}, {silent: true});
							} else {
								ask.get('bid').regionName = 'Не указано';
								//ask.get('bidModel').set({regionName: 'Не указано'});
							}
							ask.trigger("change:bid.regionName");//setBidModel();
						});
					}
				});
			
			this.Container = Marionette.LayoutView.extend({
				
				Grid: null,
                template: _.template(containerTpl),
				backGridVent: Backgrid.Row.extend({
                    events: {
						'click .btn--edit' : 'onDetail'
                    },
					onDetail: function(e){
						e.preventDefault();
						var self = this;
						require(['bundle/trader/bids-detail'], function (BidsDetail) {
							App.vent.once("ask:save", self.checkForUpdate, self);
							App.vent.once("ask:destroy", self.checkForDestroy, self);
							App.dialogRegion.show(new BidsDetail.BidView({
								model: self.model.getBidModel(), 
								ask: self.model.get('ask')
							}));
						});
						//App.dialogRegion.show(new BidView({model: selfModel}));
					},
					checkForDestroy: function(askId) {
						if(askId == this.model.get("ask").id) {
							this.model.destroy();
							this.remove();
						}
					},
					checkForUpdate: function(model) {
						var modelId = model.get('id');
						var self = this;
						if(modelId == this.model.get("ask").id) {
							//this.model.set({ask: model.toJSON()});
							this.model.fetch({
								url	:'/web/rest/v0/ask/'+this.model.get('ask').id,
								error: function() {
									console.log("cant Fetch updated AskBid component")
								},
								success: function(){ 
									self.render();
								}
							});
						}
					},
					onRender: function(){
						this.$('.btn').tooltip();
					}
                }),
				regions: {
                    list: "#trader-asks-list",
                    pagination: "#trader-asks-pagination"
                },
				initialize: function() {
					var self = this;
                    this.collection = new AsksBids();
					this.collection.fetch({reset: true}).done(function(){
						self.collection.trigger('change');
                        self.Grid = new Backgrid.Grid({
                            className: "table table-hover",
                            columns : self.columns,
                            collection : self.collection,
                            emptyText: "Нет откликов",
                            row: self.backGridVent,
							initialize: function() {
								this.collection.on('change', 'render', this);
							}
                        });
						self.list.show( self.Grid );
						var pagination = new App.Pagination({collection: self.collection});
						self.pagination.show( pagination );
						
					});
				},
				columns: [
					{
                        name: "bid.name",
                        label: "№ заявки",
                        editable: false,
                        cell: 'htmlright',
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<a class="btn--tooltip btn--orders btn--edit" href="#">'+ model.attributes.bidModel.name +'</a>';
                            }
                        })
                    },
					{
                        name: "bid.validUntil",
                        label: "Окончание",
                        editable: false,
                        cell: 'htmlcenter',
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.bidModel.validUntil;
                            }
                        })
                    },
					{
                        name: "bid.deliveryDate",
                        label: "Дата доставки",
                        editable: false,
                        cell: 'htmlcenter',
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.bidModel.deliveryDate;
                            }
                        })
                    },
					{
                        name: "product.barCode",
                        label: "Штрих-код",
                        editable: false,
                        cell: 'html',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return App.barCode(model.attributes.product.barCode);
                            }
                        })
                    },
					{
                        name: "product.name",
                        label: "Товар",
                        editable: false,
                        cell: 'html',
						formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
							fromRaw: function (rawValue, model) {
								var template = _.template(viewProductLink);
								return template(model.attributes.product);
							}
						})
                    },
					{
                        name: "bid.quantity",
                        label: "Кол-во",
                        editable: false,
                        cell: 'integer',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.bidModel.quantity;
                            }
                        })
                    },
					{
                        name: "bid.unitPrice",
                        label: "Цена",
                        editable: false,
                        className: 'text-right',
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        }),
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.bidModel.unitPrice;
                            }
                        })
                    },
					{
                        name: "buyer.name",
                        label: "Покупатель",
                        editable: false,
                        cell: 'string',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.bidModel.buyer.name;
                            }
                        })
                    },
					{
                        name: "bid.regionName",
                        label: "Регион",
                        editable: false,
                        cell: 'html',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.bidModel.regionName;
                            }
                        })
                    },
					{
                        name: "ask.unitPrice",
                        label: "Моя цена",
                        editable: false,
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        }),
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.ask.unitPrice;
                            }
                        })
                    },
					{
                        name: "ask.quantity",
                        label: "К-во",
                        editable: false,
                        cell: 'integer',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.ask.quantity;
                            }
                        })
                    },
					{
                        name: "bid.asks",
                        label: "Всего откликов",
                        editable: false,
                        cell: 'integer',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.bidModel.asks;
                            }
                        })
                    }/*,
					{
                        name: "diapazon",
                        label: "Диапазон цен откликов",
                        editable: false,
                        cell: 'html',
                        sortable: false,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return "???";
                            }
                        })
                    }*/
				]
				
			});

			
		});

        return App.myAsks;
    }
);
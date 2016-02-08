define([
        "app",
        "bundle/common/paginator",
        "bundle/trader/model/bids",
        "bundle/modal/modal",
        "text!bundle/trader/view/bid/detail.html",
        "moment",
        "text!view/shipment-types.html",
		'text!view/shop-rating.html',
		//"model/user",
		
        "model/state",
        'model/shipments',
        "bundle/trader/model/asks",
		"lib/bootstrap-datetimepicker",
        "backgrid.select"
	],
    function (App,
              Paginator,
              Data,
              Modal,
			  viewDetail,
			  moment,
			  viewShipmentTypes,
			  viewShopRating
			 // User
    ) {
        'use strict';
        App.module("Trader", function (Trader, App, Backbone, Marionette, $, _) {
			
			this.BidView = Marionette.CompositeView.extend({
                template: _.template(viewDetail),
                childViewContainer: '#asksList tbody',
                childView: null,
                events: {
                    'click #createAskBtn'	: 'createAsk',
					'click #showAskList'	: 'onShowAskList',
					'click #removeAsk'		: 'removeAsk'
                },
                initialize: function(init){
					
					var self = this;
					
                    var _shipments = Backbone.Collection.extend({
                        url: "rest/v0/shop/shipment"
                    });
                    this.model.set({
						shipments:[],
						showAsks: false
					}, {silent: true});
                    var shipments = new _shipments();
					
					var ask = {
								'minPrice'	: self.model.get('unitPrice'),
								'bidId'		: self.model.get('id')
							}
					if(typeof init.ask !== 'undefined') {
						ask = _.extend(ask, init.ask);
					}
					self.model.set({ask: new Data.Ask(ask)}, {silent: true});
                    shipments.fetch({
                    }).done(function(model){
                        self.model.set({
							shipments: model
						}, {silent:true});					
						self.model.on("change:regionName", self.render());
                        self.render();
                    });
                },
                onRender: function(){
                    var self = this;
                    this.$('#shipmentTimeCalendar').datetimepicker({
                        format: 'DD.MM.YY HH:mm'
                    });
                    this.$('#shipmentTime').mask("99.99.99 99:99");

                    this.$("#shipmentAddress").bind('input propertychange', function(){
                        self.onShipmentAddress();
                    });

                    this.$("#shipmentPrice").bind('keyup', function(){
                        self.onShipmentPrice();
                    });
					/*for(var i=1;i<=5;i++) {
						App.tooltip(self.childViewContainer + ' .SHIPMENT_TYPE_'+i);
					}*/
					
                },
				removeAsk: function() {
					var self = this;
					var askId = this.model.get('ask').get('id');
					this.model.get('ask').destroy({
						wait: true,
						success: function() {
							App.dialogRegion.$el.modal("hide");
							App.vent.trigger("ask:destroy", askId);
							self.destroy();
						}, 
						error: function(a,b,c) {
							console.log("Remove ask failed.");
						}
					});
				},
				createAsk: function() {
					var self = this;
					var shipments = {};
					_.each(self.$el.find('.askShipmentTypes:checked'), function(value){
						shipments[$(value).val()] = true;
					});
					var ask = this.model.get('ask');
					ask.set({
						unitPrice :  Number(self.$el.find('#askPrice').val()),
						quantity :  Number(self.$el.find('#askQuantity').val()),
						shipmentTypes : shipments,
						shipmentTime : moment(self.$el.find('#shipmentTime').val(), "DD.MM.YY HH:mm").format("x")
					});
					var validationResult = ask.validate(ask.toJSON());
					
					this.$el.find('.form-group').removeClass('has-error').find('input').attr({title: ''});
					this.$el.find('#alert').remove();
					
					if(typeof validationResult === 'undefined') {
						ask.save(null, {
							success: function(model, response, options) {
								self.model.set({
									asks: self.model.get('asks')+1
								});
								//self.model.fetch();
								App.dialogRegion.$el.modal("hide");
								App.vent.trigger("ask:save", model);
								self.destroy();
							},
							error: function(model, response, options) {
								console.error("create/edit ask failed: " + response.status);
							}
						});
						//this.onResponseCreate();
						return;
					}
					
					// Поведение, если имеются ошибки
					this.$el.find('#askForm').append('<li class="list-group-item"  id="alert"><div class="alert alert-danger">');
					for(var i in validationResult) {
						var Obj = validationResult[i];
						this.$el.find('#'+Obj.id).attr({title: Obj.error}).closest('.form-group').addClass('has-error');
						this.$el.find('#alert div').append('<p>'+Obj.error+'</p>');
					}
				},
				
				onShowAskList: function() {
					
					console.log('Bid Detail >> showAskList');
					
					var self = this;
					var asks = new Data.Asks({
						id: this.model.get('id')
					});
					asks.fetch({
                        reset:true,
                        success: function(collection, response, options) {
							self.collection = asks;
							if(self.collection.length > 0)
								self.model.set({showAsks: true});
							else
								self.model.set({showAsks: false});
							// self.render();
							
							self.Grid =  new Backgrid.Grid({
								className: "table table-hover",
								columns : self.columns,
								collection : self.collection,
								emptyText: "Нет откликов",
								row: self.backGridVent
							});
							self.$el.find("#backGridAsksList").html(self.Grid.render().el);
							
							self.setTooltip();
                        },
						error: function(model, response, options) {
							self.model.set({showAsks: false});
							self.render();
						}
                    });
				},
				
				setTooltip: function() {
					App.tooltip();
				},
				
				serializeData:function() {
					var self = this;
					if(typeof self.model.get('regionName') === 'undefined' || self.model.get('regionName') == "") {
						self.model.getRegion();
					}
					return _.extend(self.model.toJSON(), {
						ask: self.model.get('ask').toJSON()
					});
				},
				
				Grid: null,
				
				backGridVent: Backgrid.Row.extend({
					
				}),
				columns: [
					{
                        name: "shop.name",
                        label: "Магазин",
                        editable: false,
                        cell: 'html',
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.shop.name;
                            }
                        })
                    },
					{
                        name: "shop.rating",
                        label: "Рейтинг",
                        editable: false,
                        cell: 'htmlcenter',
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                var template = _.template(viewShopRating);
                                return template({shop: {ratig: model.attributes.shop.rating}});
                            }
                        })
                    },
					{
                        name: "unitPrice",
                        label: "Стоимость за штуку",
                        editable: false,
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        }),
                        className: 'text-right',
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return App.currency(model.attributes.unitPrice);;
                            }
                        })
                    },
					{
                        name: "quantity",
                        label: "Количество",
                        editable: false,
                        cell: 'integer',
                        sortable: true
                    },
					{
                        name: "icons",
                        label: "Доставка",
                        editable: false,
                        cell: 'htmlcenter',
                        sortable: false,
						formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function (rawValue, model) {
                                    if ( typeof model.attributes.shipmentTypes === 'undefined' ) return;
                                    var shipment = new Backbone.Collection();
                                    _.each(Data.ShipmentsPrototype.toJSON() , function(value, key, list){
                                        if ( model.attributes.shipmentTypes[value.id] == true ){
                                            shipment.add(Data.ShipmentsPrototype.at(key));
                                        }
                                    });
                                    var template = _.template(viewShipmentTypes);
                                    return template({shipmentsTypes: shipment.toJSON()});
                                }
                            })
                       /* formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.bidModel.name;
                            }
                        })*/
                    }
				]
				
            });
			
		});

        return App.Trader;
    }
);
/**
 * Created by GOODPROFY on 22.05.2015.
 *  @example Кнопка корзины с выпадающим списком
 *  require(["bundle/cart/basket"], function(Basket){ this.region.show(new Cart.Cart()) });
 */

define([
    'app',
    "text!bundle/trader/view/offer/container-add-offer.html",
    "text!bundle/trader/view/offer/offer-add-form.html",
    "moment",
		
    'lib/bootstrap-datetimepicker'
], function(
    App,
    containerTpl,
	addFormTpl,
    moment
){
    'use strict';
    return App.module('Offers.Add', function(Offers, App, Backbone, Marionette, $, _ ){
		
		this.offerLayout = Marionette.LayoutView.extend({
			template: _.template(containerTpl),

			regions: {
				offerFormRegion: "#offer-add-form"
			},
			initialize: function (product) {
				this.model = product;
			},
			onRender: function() {
				var self = this;
				
				var Offer = Backbone.Model.extend({
					url: function() {
						return 'rest/v0/offer/' + ((typeof(this.get('id'))== 'undefined') ? "" : this.get('id'));
					},
					defaults: {
						productId		: self.model.get('id'),
						quantity		: 1,
                        price		: null,
                        unitPrice		: null,
						active			: true,
						shipmentTypes	: {
							SHIPMENT_TYPE_1	: true,
							SHIPMENT_TYPE_2	: true,
							SHIPMENT_TYPE_3	: true,
							SHIPMENT_TYPE_4	: true,
							SHIPMENT_TYPE_5	: true
						},
						validUntil		: null
					},
					initialize: function() {
						this.on('change:validUntil', this._onChange);
					},
					_onChange: function() {
						this.set('validUntil', moment(this.get('validUntil'), "x").format("DD.MM.YY"), {silent: true});
					},
					validate: function(attr,opts) {
						var errors = [];

						attr.price = Number(attr.price);
						attr.unitPrice = Number(attr.unitPrice);
						attr.quantity = Number(attr.quantity);
                        var regExp = /\-?\d+(\.\d{0,})?/;
						if(!regExp.test(attr.unitPrice)) {
							errors.push({
								id		: 'offerPrice',
								error	: 'Неверно указана цена',
							});
						}
						if(!attr.quantity || attr.quantity<1) {
							errors.push({
								id		: 'offerQuantity',
								error	: 'Неверно указано количество',
							});
						}
						if(Object.keys(attr.shipmentTypes).length <1) {
							errors.push({
								id		: 'offerShipment',
								error	: 'Не выбраны допустимые способы доставки',
							});
						}
						if(errors.length > 0) {
							return errors;
						}
					}
				});
				var offer = new Offer();
				offer.fetch({
					url: "rest/v0/offer/prod/"+self.model.get('id'),
					success: function() {
                        console.log(offer.toJSON());
						self.offerFormRegion.show(new OfferView({ model : offer }) );
					},
					error: function() {
						self.offerFormRegion.show(new OfferView({ model : offer }) );
					}
				})
			}
		});
		
		var OfferView = Marionette.ItemView.extend({
			template: _.template(addFormTpl),
			initialize: function() {
				var self = this;
				self.additional = {shipments: []};
				var _shipments = Backbone.Collection.extend({
					url: "rest/v0/shop/shipment"
				});
				var shipments = new _shipments();
				shipments.fetch({reset:true}).done(function(model){
					self.additional.shipments = model;
                    console.log(model);
					self.render();
				});
			},
			events: {
				'click #modal-btn-ok': '_onSubmit',
				'click #modal-btn-delete': '_onDelete'
			},
			serializeData: function(){
				var self = this;
				return _.extend(this.model.toJSON(), self.additional);
			},
			_onDelete: function() {
				this.model.destroy({
					success: function() {
						App.dialogRegion.$el.modal("hide");
						self.destroy();
					},
					error: function() {
						console.log('Ошибка удаления предложения');
					}
				});
			},
			_onSubmit: function() {
				var self = this;
				var shipments = {};
				_.each(self.$el.find('.offerShipmentTypes:checked'), function(value){
					shipments[$(value).val()] = true;
				});
				var offerValidUntil = this.$('#offerValidUntil').val();
				
				var unitPrice = self.$el.find('#offerPrice').val();				
				this.model.set({
                    price			: unitPrice.split(',').join('.'),
                    unitPrice		: unitPrice.split(',').join('.'),
					quantity		: self.$el.find('#offerQuantity').val(),
					active			: (self.$el.find('#offerActive').is(':checked')) ? true : false,
					validUntil		: moment(offerValidUntil, "DD.MM.YY").format("x"),
					shipmentTypes	: shipments
				}, {silent: true});
				
				this.$el.find('.form-group').removeClass('has-error').find('input').attr({title: ''});
				this.$el.find('#alert').remove();
				var validationResult = this.model.validate(this.model.toJSON());
				if(typeof validationResult === 'undefined') {
					this.model.save(null,{
						success: function(model, response, options) {
							App.dialogRegion.$el.modal("hide");
							self.destroy();
						},
						error: function(model, response, options) {
							console.error("create ask failed: " + response.status);
						}
					});
					return;
				}
				
				// Поведение, если имеются ошибки
				this.$el.find('#offerAddForm').prepend('<div id="alert" class="alert alert-danger">');
				for(var i in validationResult) {
					var Obj = validationResult[i];
					this.$el.find('#'+Obj.id).attr({title: Obj.error}).closest('.form-group').addClass('has-error');
					this.$el.find('#alert').append('<p>'+Obj.error+'</p>');
				}
				return false;
				
			},
			onRender: function() {
				var self = this;
				this.$('#offerValidUntilCalendar').datetimepicker({
					format: 'DD.MM.YY'
				});
                this.$('#offerValidUntil').mask("99.99.99");
			}
		});
		
	});
});
define(["app", "backbone", "bundle/common/paginator", "marionette", "bundle/trader/model/payment", 
        "moment",
	"text!bundle/trader/view/payment/container.html", 
	"text!bundle/trader/view/payment/options.html",
	
	"lib/bootstrap-datetimepicker"], 
function(App, Backbone, Paginator, Marionette, Data, moment,
	containerTpl, 
	optionsTpl) {
    'use strict';
    App.module("Payment", function(Payment, App, Backbone, Marionette, $, _) {
        this.View = Marionette.LayoutView.extend({
            template: _.template(containerTpl),
			events: {
				'click #vent-period': '_onFilterReports',
				'click #download': 'choke'
			},
			choke: function(e) {
				e.preventDefault();
				require(["bundle/modal/modal"], function(Modal) {
					new Modal.View({
						text: "Функционал в разработке", _template: "message", _static: false
					});
				});
			},
			_onFilterReports: function() {
				this.collection.formFilter.startDate = (this.$el.find('#startDate').val().length>0) 
						? this.$el.find('#startDate').val()
						: null;
				this.collection.formFilter.endDate = (this.$el.find('#endDate').val().length>0) 
						? this.$el.find('#endDate').val()
						: null;
				this.collection.fetch();
			},
            regions: {
                listRegion: "#shop-payment-list",
                pagerRegion: "#shop-payments-pagination"
            },
            onShow: function() {
                this.collection = new Data.TraderPaymentCollection();
                var self = this;
				self.setTooltip();
				
				
                this.$('#period_start').datetimepicker({
                    format: 'DD.MM.YYYY',
                    defaultDate: moment().format()
                });
                this.$('#period_end').datetimepicker({
                    format: 'DD.MM.YYYY',
                    defaultDate: moment().format()
                });
                this.$("#period_start").on("dp.change", function (e) {
                    $('#period_end').data("DateTimePicker").minDate(e.date);
                });
                this.$("#period_end").on("dp.change", function (e) {
                    $('#period_start').data("DateTimePicker").maxDate(e.date);
                });
				
                this.collection.fetch({
                    reset: true,
                    success: function(collection, response, options) {
						
						
						var Grid = new Backgrid.Grid({
                            className: "table table-hover table-responsive",
                            columns : self.columns,
                            collection : self.collection,
                            emptyText: "Нет операций за выбранный период",
                            row: self.backGridVent,
                        });
						
                        self.listRegion.show(Grid);
						
						
						var pagination = new App.Pagination({collection: self.collection});
						self.pagerRegion.show( pagination );
						
                    },
                    error: function() {
                        console.log('There was some error in loading and processing the JSON file');
                    }
                });
            },
			setTooltip: function() {
				App.tooltip();
			},
            templateHelpers: function() {
                return {
                    incomingTotal: Data.Payment.incomingTotal,
                    costsTotal: Data.Payment.costsTotal,
                    balance: Data.Payment.balance
                };
            },
			backGridVent: Backgrid.Row.extend({
				events: {
					'click .editField' : "isEditBtnClicked",
					'click .saveField' : "saveField",
					'click .removeField' : "modalShow"
				},
				isEditBtnClicked: function(e) {
					e.preventDefault();
					//if ($(this.ui.commentEditField).hasClass('edit')) return;
					var $commentField = this.$el.find('.comment');
					$commentField.addClass('edit').removeClass('text-danger').removeClass('text-warning').removeClass('saving');
					var text = $commentField.text();
					var self = this;
					$commentField.html('<textarea class="comment-edit" id="textEditFieldId">' + text + '</textarea>');
					self.toggleBtns();
					$('.comment-edit').focus();
					$('.comment-edit').on('focusout', function() {
						
						
						window.setTimeout(function() { 
							
							var newText = self.$el.find('.comment-edit').val();
							
							if($commentField.hasClass('saving') == false) {
								$commentField.addClass('text-danger').attr('title', 'Данные не были сохранены')
							}
							$commentField.text(newText);
							$commentField.removeClass("edit");
							
							console.log('focusOut');
							self.toggleBtns(); 
						}, 500);
					});
				},
				toggleBtns: function() {
					this.$el.find('.toggles').toggleClass('hidden');
				},
				saveField: function(e) {
					e.preventDefault();
					console.log("saveField!!");
					var $commentField = this.$el.find('.comment');
					$commentField.addClass('saving')
					//var payments = new Data.TraderPaymentCollection(); 
					this.model.save(null, { //TODO: change to save as REST
						dataType: "json",
						success: function(model, response, options) {
							$commentField.removeClass('text-danger').removeClass('text-warning');
							console.log("save!");
						},
						error: function(model, response, options) {
							$commentField.addClass('text-warning');
							console.error("save bid failed: " + response.status);
						}
					});
				},
				modalShow: function(e) {
					console.log("modalShow!!");
					e.preventDefault();
					var self = this.$el.find('.comment');;
					if  (self.text()!=''){
					require(["bundle/modal/modal"], function(Modal) {
						App.Wreqr.setHandler("modal:yes", function() {
							self.text('');
						});
						App.Wreqr.setHandler("modal:no", function() {});
						new Modal.View({
							text: "Вы уверены, что хотите удалить комментарий?",
							yes: "Да",
							no: "Нет"
						});
					});
				  }
				}
			}),
			columns: [
				{
					name: "date",
					label: "Дата",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "incoming",
					label: "Приход",
					editable: false,
					className: 'text-right',
					cell: Backgrid.NumberCell.extend({
						orderSeparator: ' ',
						decimalSeparator: ','
					}),
					sortable: true,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return App.currency(model.get('incoming'));
						}
					})
				},{
					name: "costs",
					label: "Расход",
					editable: false,
					className: 'text-right',
					cell: Backgrid.NumberCell.extend({
						orderSeparator: ' ',
						decimalSeparator: ','
					}),
					sortable: true,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return App.currency(model.get('costs'));
						}
					})
				},{
					name: "transactionType",
					label: "Вид операции",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "reason",
					label: "Основание",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "comment",
					label: "Комментарий",
					editable: false,
					cell: 'html',
					sortable: true,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return '<div class="comment">'+model.get('comment')+'</div>';
						}
					})
				},{
					name: "options",
					label: "",
					editable: false,
					cell: 'html',
					sortable: false,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							
							var template = _.template(optionsTpl);
							return template({});
						}
					})
				},
			]
        });
    });
    return App.Payment;
});
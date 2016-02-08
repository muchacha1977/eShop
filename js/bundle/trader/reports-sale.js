define([
        "app",
        "bundle/trader/model/reports",
        "text!bundle/trader/view/reports/sale-container.html",
        "bundle/modal/modal",
        "moment",
		
		"model/state",
        "backgrid.select",
		"lib/bootstrap-datetimepicker"
	],
    function (App,
			Data,
			containerTpl,
			Modal,
			moment
    ) {
		return App.module("Trader.ReportsDelivery", function (Reports, App, Backbone, Marionette, $, _) {
        
			this.View = Marionette.LayoutView.extend({
				
				events: {
					'click #layer-selection button': "selectLayer",
					'click #filterBtn': "filter",
					'click #downloadCSV': 'choke',
					'click #downloadXLS': 'choke'
				},
                template: _.template(containerTpl),
				regions: {
                    list: "#trader-sale-list",
                    pagination: "#trader-sale-pagination"
                },
				initialize: function() {
					var self = this;
					
                    this.collection = new Data.TraderReports();
					
					this.selectLayer();
					
				},
				onRender: function() {
					this.$('#period_start').datetimepicker({
						format: 'DD.MM.YY'
					});
					this.$('#period_end').datetimepicker({
						format: 'DD.MM.YY'
					});
				},
				choke: function(e) {
					e.preventDefault();
					require(["bundle/modal/modal"], function(Modal) {
						new Modal.View({
							text: "Функционал в разработке", _template: "message", _static: false
						});
					});
				},
				filter: function() {
					this.collection.setFilters({
						startDate	: (!this.$('#startDate').val()) ? null : this.$('#startDate').val(),
						endDate		: (!this.$('#endDate').val()) ? null : this.$('#endDate').val(),
						productName	: (!this.$('#productName').val()) ? null : this.$('#productName').val(),
						categoryName: (!this.$('#categoryName').val()) ? null : this.$('#categoryName').val(),
						buyerName	: (!this.$('#buyerName').val()) ? null : this.$('#buyerName').val()
					});
					this.refreshGrid();
				},
				selectLayer: function(e) {
					var self = this;
					this.$('#startDate').val("");
					this.$('#endDate').val("");
					this.$('#productName').val("");
					this.$('#categoryName').val("");
					this.$('#buyerName').val("");
					
					if(!e) {
						$layer = this.$el.find('#layer-selection button').first();
					} else {
						$layer = $(e.target);
					}
					var option = $layer.data('option');
					if(this.columns[0].name === 'name') {
						this.columns.shift();
					}
					$layer.addClass('active').siblings().removeClass('active');
					switch(option) {
						case 'product':
							this.collection.formFilter.layer = 'product';
							this.columns.unshift({
								name: "name",
								label: "Продукт",
								editable: false,
								cell: 'html',
								sortable: true
							});
							break;
						case 'buyer':
							this.collection.formFilter.layer = 'buyer';
							this.columns.unshift({
								name: "name",
								label: "Покупатель",
								editable: false,
								cell: 'html',
								sortable: true
							});
							break;
						default:
							this.collection.formFilter.layer = 'category';
							this.columns.unshift({
								name: "name",
								label: "Категория",
								editable: false,
								cell: 'html',
								sortable: true
							});
							break;
					}
					this.collection.state.currentPage = 1;
					this.filter();
				},
				refreshGrid: function() {
					var self = this;
					this.collection.fetch({reset: true}).done(function(){
						
						self.Grid = new Backgrid.Grid({
							className: "table table-hover",
							columns : self.columns,
							collection : self.collection,
							emptyText: "Отсутствуют данные для отображения",
						});
                        
						self.list.show( self.Grid );
						
						var pagination = new App.Pagination({collection: self.collection});
						self.pagination.show( pagination );
						
					});
				},
				Grid: null,
				columns: [
					{
                        name: "name",
                    },
					{
                        name: "itemQuantity",
                        label: "Количество товаров",
						cell: 'html',
                        editable: false,
                        sortable: true
                    },
					{
                        name: "dealQuantity",
                        label: "Количество сделок",
						cell: 'html',
                        editable: false,
                        sortable: true
                    },
					{
                        name: "turnoverSum",
                        label: "Сумма оборот",
						className: 'text-right',
						cell: Backgrid.NumberCell.extend({
							orderSeparator: ' ',
							decimalSeparator: ','
						}),
                        editable: false,
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return App.currency(model.get('turnoverSum'));
                            }
                        })
                    },
					{
                        name: "commissionSum",
                        label: "Сумма комиссия",
						className: 'text-right',
						cell: Backgrid.NumberCell.extend({
							orderSeparator: ' ',
							decimalSeparator: ','
						}),
                        editable: false,
                        sortable: false,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return App.currency(model.get('commissionSum'));
                            }
                        })
                    },
					{
                        name: "totalSum",
                        label: "Итого",
						className: 'text-right',
						cell: Backgrid.NumberCell.extend({
							orderSeparator: ' ',
							decimalSeparator: ','
						}),
                        editable: false,
                        sortable: false,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return App.currency(model.get('totalSum'));
                            }
                        })
                    }
				]
				
			});
		});
    }
);
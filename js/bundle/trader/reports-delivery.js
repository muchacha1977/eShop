define([
        "app",
        "bundle/trader/model/reports",
        "text!bundle/trader/view/reports/delivery-container.html",
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
		return App.module("Trader.ReportsSale", function (Reports, App, Backbone, Marionette, $, _) {
        
			this.View = Marionette.LayoutView.extend({
				
				events: {
					'click #layer-selection button': "selectLayer",
				//TODO: если надо будет фильтровать	'click #filterBtn': "filter",
				/*TODO: если нужно будет скачивание	'click #downloadCSV': 'choke',
					'click #downloadXLS': 'choke'*/
				},
                template: _.template(containerTpl),
				regions: {
                    list: "#trader-delivery-list",
                    pagination: "#trader-delivery-pagination"
                },
				initialize: function() {
					
                    this.collection = new Data.TraderReports();
					
					this.collection.url = 'mock/trader/reports-delivery.json';
					
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
				/*TODO: если нужно будет скачивание
				choke: function(e) {
					e.preventDefault();
					require(["bundle/modal/modal"], function(Modal) {
						new Modal.View({
							text: "Функционал в разработке", _template: "message", _static: false
						});
					});
				},*/
				/* TODO: Если надо будет фильтровать
				filter: function() {
					this.collection.setFilters({
						startDate	: (!this.$('#startDate').val()) ? null : this.$('#startDate').val(),
						endDate		: (!this.$('#endDate').val()) ? null : this.$('#endDate').val(),
						productName	: (!this.$('#productName').val()) ? null : this.$('#productName').val(),
						categoryName: (!this.$('#categoryName').val()) ? null : this.$('#categoryName').val(),
						buyerName	: (!this.$('#buyerName').val()) ? null : this.$('#buyerName').val()
					});
					this.refreshGrid();
				},*/
				selectLayer: function(e) {
					var self = this;
					/* Если надо будет фильтровать. Это сброс настроек фильтрации при выборе нового среза
					this.$('#startDate').val("");
					this.$('#endDate').val("");
					this.$('#productName').val("");
					this.$('#categoryName').val("");
					this.$('#buyerName').val("");*/
					
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
						case 'order':
							this.collection.formFilter.layer = 'order';
							this.columns.unshift({
								name: "name",
								label: "Заказ",
								editable: false,
								cell: 'html',
								sortable: true
							});
							break;
						case 'delivery':
							this.collection.formFilter.layer = 'delivery';
							this.columns.unshift({
								name: "name",
								label: "Тип доставки",
								editable: false,
								cell: 'html',
								sortable: true
							});
							break;
						default:
							this.collection.formFilter.layer = 'buyer';
							this.columns.unshift({
								name: "name",
								label: "Покупатель",
								editable: false,
								cell: 'html',
								sortable: true
							});
							break;
					}
					this.collection.state.currentPage = 1;
					//TODO: УБРАТЬ, если нужна будет фильтрация
					this.refreshGrid();
					//TODO: если нужна будет фильтрация this.filter();
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
                        name: "orderSum",
                        label: "Сумма заказа",
						className: 'text-right',
						cell: Backgrid.NumberCell.extend({
							orderSeparator: ' ',
							decimalSeparator: ','
						}),
                        editable: false,
                        sortable: false,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return App.currency(model.get('orderSum'));
                            }
                        })
                    },
					{
                        name: "deliverySum",
                        label: "Сумма доставки",
						className: 'text-right',
						cell: Backgrid.NumberCell.extend({
							orderSeparator: ' ',
							decimalSeparator: ','
						}),
                        editable: false,
                        sortable: false,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return App.currency(model.get('deliverySum'));
                            }
                        })
                    }
				]
				
			});
		});
    }
);
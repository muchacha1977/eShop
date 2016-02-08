define([
    "app",
    "text!bundle/producer/view/reports/container.html",
    "text!bundle/producer/view/reports/option.html",
	"lib/bootstrap-datetimepicker"
], function(
    App,
    containerTpl,
	optionTpl
){
    return App.module("Producer.Reports", function (Reports, App, Backbone, Marionette, $, _) {
		
		var Model = Backbone.Model.extend();
		var Collection = App.PageableCollection.extend({
			url: 'mock/producer/reports.json',
			formFilter : {
					productId	: null,
					sellerId	: null,
					startDate	: null,
					endDate		: null
				},
			initialize: function() {
				_.bindAll(this, 'getQ');
				
				this.state.q = this.getQ;
			},
			getQ: function() {
				var q = [];
				var i = 0;
				if(this.formFilter.productId !== null) {
					q[i] = 'productId.eq('+this.formFilter.productId+')';
					i++;
				}
				if(this.formFilter.sellerId !== null) {
					q[i] = 'sellerId.eq('+this.formFilter.sellerId+')';
					i++;
				}
				if(this.formFilter.startDate !== null) {
					q[i] = 'startDate.eq('+this.formFilter.startDate+')';
					i++;
				}
				if(this.formFilter.endDate !== null) {
					q[i] = 'endDate.eq('+this.formFilter.endDate+')';
				}
				return (q.length>0) ? q.join('.and.') : "";

			}
		});
		
		var OptionView = Marionette.ItemView.extend({
			tagName: 'option',
			template: _.template(optionTpl),
			onRender: function() {
				if(!this.model.isNew())
					this.$el.attr({value: this.model.get('id')});
			}
		});
		var SelectView = Marionette.CollectionView.extend({
			tagName: 'select',
			childView: OptionView,
			className: 'form-control'
		});
		
		this.Container = Marionette.LayoutView.extend({
			template: _.template(containerTpl),
			regions: {
				list: "#producer-reports-list",
				pagination: "#producer-reports-pagination",
				productsRegion: "#product-select",
				sellersRegion: "#seller-select",
			},
			events: {
				"click #vent-period" : "_onFilterReports",
				"show.bs.collapse #collapseBuyerProfileDataRow": "onCollapseShow",
				"show.bs.collapse #collapseBuyerPaymentDetails": "onCollapseShow",
				"show.bs.collapse #collapseBuyerPersonalData": "onCollapseShow",
				"hide.bs.collapse #collapseBuyerProfileDataRow": "onCollapseHide",
				"hide.bs.collapse #collapseBuyerPaymentDetails": "onCollapseHide",
				"hide.bs.collapse #collapseBuyerPersonalData": "onCollapseHide"
			},
			initialize: function() {
				var self = this;
				this.collection = new Collection();
				this.collection.fetch({reset: true}).done(function(){
					self.collection.trigger('change');
					self.Grid = new Backgrid.Grid({
						className: "table table-hover",
						columns : self.columns,
						collection : self.collection,
						emptyText: "Нет брендов",
						initialize: function() {
							this.collection.on('change', 'render', this);
						}
					});
					self.list.show( self.Grid );
					var pagination = new App.Pagination({collection: self.collection});
					self.pagination.show( pagination );

				});
				
				var products = new Backbone.Collection();
				products.fetch({
					url: 'mock/producer/products.json',
					success: function() {
						self.productsRegion.show(new SelectView({ collection: products}));
					}
				});
				
				var sellers = new Backbone.Collection();
				sellers.fetch({
					url: 'mock/producer/sellers.json',
					success: function() {
						self.sellersRegion.show(new SelectView({ collection: sellers}));
					}
				});
			},
			onRender: function() {
				this.$('#period_start').datetimepicker({
					format: 'DD.MM.YY'
				});
				this.$('#period_end').datetimepicker({
					format: 'DD.MM.YY'
				});
			},
			onCollapseShow: function (e) {
				this.$("#" + e.target.id + "Handle").removeClass("fa-chevron-circle-right").addClass("fa-chevron-circle-down");
			},
			onCollapseHide: function (e) {
				this.$("#" + e.target.id + "Handle").removeClass("fa-chevron-circle-down").addClass("fa-chevron-circle-right");
			},
			_onFilterReports: function() {
				this.collection.formFilter.sellerId = (this.$el.find('#seller-select select').val().length>0) 
						? this.$el.find('#seller-select select').val()
						: null;
				this.collection.formFilter.productId = (this.$el.find('#product-select select').val().length>0) 
						? this.$el.find('#product-select select').val()
						: null;
				this.collection.formFilter.startDate = (this.$el.find('#startDate').val().length>0) 
						? this.$el.find('#startDate').val()
						: null;
				this.collection.formFilter.endDate = (this.$el.find('#endDate').val().length>0) 
						? this.$el.find('#endDate').val()
						: null;
				this.collection.fetch();
			},
			Grid: null,
			columns: [
				{
					name: "productName",
					label: "Товар",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "sellerName",
					label: "Продавец",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "unitPrice",
					label: "Цена",
					editable: false,
					className: 'text-right',
					cell: Backgrid.NumberCell.extend({
						orderSeparator: ' ',
						decimalSeparator: ','
					}),
					sortable: true,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return App.currency(model.get('unitPrice'));
						}
					})
				},{
					name: "quantity",
					label: "Количество проданного",
					editable: false,
					className: 'text-right',
					cell: 'html',
					sortable: true
				},{
					name: "sumPrice",
					label: "Сумма проданного",
					editable: false,
					className: 'text-right',
					cell: Backgrid.NumberCell.extend({
						orderSeparator: ' ',
						decimalSeparator: ','
					}),
					sortable: true,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return App.currency(model.get('sumPrice'));
						}
					})
				},{
					name: "percent",
					label: "Начисленный процент от продаж",
					editable: false,
					className: 'text-right',
					cell: "html",
					sortable: true,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return App.percent(model.get('percent'));
						}
					})
				}
			]
		});
		
	});
});
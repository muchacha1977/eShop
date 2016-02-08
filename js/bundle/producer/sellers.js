define([
    "app",
    "text!bundle/producer/view/sellers/container.html"
], function(
    App,
    containerTpl
){
    return App.module("Producer.Sellers", function (Sellers, App, Backbone, Marionette, $, _) {
		
		var Model = Backbone.Model.extend();
		
		var Collection = App.PageableCollection.extend({
			url: 'mock/producer/sellers.json'
		});
		
		this.Container = Marionette.LayoutView.extend({
			template: _.template(containerTpl),
			regions: {
				list: "#producer-sellers-list",
				pagination: "#producer-sellers-pagination"
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
			},
			Grid: null,
			columns: [
				{
					name: "name",
					label: "Название",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "productsQuantity",
					label: "Количество позиций",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "monthIncome",
					label: "Доход в текущем месяце",
					editable: false,
					className: 'text-right',
					cell: Backgrid.NumberCell.extend({
						orderSeparator: ' ',
						decimalSeparator: ','
					}),
					sortable: true,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return App.currency(model.get('monthIncome'));
						}
					})
				},{
					name: "income",
					label: "Суммарный доход бренда",
					editable: false,
					className: 'text-right',
					cell: Backgrid.NumberCell.extend({
						orderSeparator: ' ',
						decimalSeparator: ','
					}),
					sortable: true,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return App.currency(model.get('income'));
						}
					})
				}
			]
		});
		
	});
});
define([
    "app",
    "text!bundle/managers/view/shops-transfer/container.html",
	"text!bundle/managers/view/shops-transfer/transfer-form.html",
	"text!bundle/managers/view/shops-transfer/transfer-shops.html",
	"text!bundle/managers/view/shops-transfer/transfer-shop-item.html",
    "moment",
	// TODO ввести это расширение! "backgrid.select"
], function(
    App,
    containerTpl,
	transferTpl,
	transferShopsTpl,
	transferShopItemTpl,
	moment
){
    return App.module("Managers.shopsTransfer", function (Brands, App, Backbone, Marionette, $, _) {
		
		var Model = Backbone.Model.extend();
		
		var Collection = App.PageableCollection.extend({
			url: 'mock/main-manager/shops-list.json'
		});
		
		var managerGridVent = Backgrid.Row.extend({
			events: {
                    "click button": "transfer"
                },
			transfer: function() {
				App.vent.trigger("transfer:shops", this.model);
			}
		});
		
		var backGridVent = Backgrid.Row.extend({ // TODO: удалить после подключения backgrid.select
                events: {
                    "click input": "setCheckbox"
                },
				initialize: function (options) {
					_.bindAll(this, 'setCheckbox');
					
					App.vent.on("change:selectAll", this.setCheckbox);

					var columns = this.columns = options.columns;
					if (!(columns instanceof Backbone.Collection)) {
						columns = this.columns = new Columns(columns);
					}

					var cells = this.cells = [];
					for (var i = 0; i < columns.length; i++) {
						cells.push(this.makeCell(columns.at(i), options));
					}

					this.listenTo(columns, "add", function (column, columns) {
						var i = columns.indexOf(column);
						var cell = this.makeCell(column, options);
						cells.splice(i, 0, cell);

						var $el = this.$el;
						if (i === 0) {
							$el.prepend(cell.render().$el);
						}
						else if (i === columns.length - 1) {
							$el.append(cell.render().$el);
						}
						else {
							$el.children().eq(i).before(cell.render().$el);
						}
					});

					this.listenTo(columns, "remove", function (column, columns, opts) {
						cells[opts.index].remove();
						cells.splice(opts.index, 1);
					});
				},
				setCheckbox: function() {
					var self = this;
					setTimeout(function() {
						self.model.set('selected', (self.$el.find('input[type="checkbox"]').prop('checked')) ? true : false);
					}, 500);
					
				}
            });
		
		var TransferShopItemView = Marionette.ItemView.extend({
			template: _.template(transferShopItemTpl),
			tagName: 'span'
		});
		var TransferShopsView = Marionette.CompositeView.extend({
			template: _.template(transferShopsTpl),
			childView: TransferShopItemView,
            childViewContainer: "#shopsShortView"
		});
		
		var TransferView = Marionette.LayoutView.extend({
			template: _.template(transferTpl),
			events: {
				'click #zzz': "showRegions"
			},
			regions: {
				shopsRegion			: "#transferShops",
				managersRegion		: "#transferManagers",
				paginationRegion	: '#transferManagersPagination'
			},
			initialize: function() {
				
				_.bindAll(this, 'transferShops');
				//this.collection = collection;
				var self = this;
				
				
				this.managersCollection = new App.PageableCollection();
				this.managersCollection.fetch({
					url: 'mock/main-manager/managers.json',
					success: function() {
						
						self.Grid = new Backgrid.Grid({
							className: "table table-hover",
							columns : self.columns,
							collection : self.managersCollection,
							emptyText: "Нет брендов",
							row: managerGridVent,
							initialize: function() {
								this.collection.on('change', 'render', this);
							}
						});
						
						self.managersRegion.show( self.Grid);
						
						var pagination = new App.Pagination({collection: self.managersCollection});
						self.paginationRegion.show( pagination );
						
						self.shopsRegion.show( new TransferShopsView({collection: self.collection}));
					}
				});
				
				App.vent.on("transfer:shops", this.transferShops);
			},
			transferShops: function(model) {
				var self = this;
				model.save({shops:  this.collection.toJSON()},{
					url: '/mock/telepok',
					success: function() {
						$('.modal').hide();
					},
					error: function() {
						$('.modal').modal('hide');
						/* TODO: вывести сообщение об ошибке
						 * require(["bundle/modal/modal"], function (Modal) {
                            new Modal.View({
                                text: '<h5>Файл был успешно загружен на сервер</h5>',
                                _template: "message",
                                _static: false
                            });
						}.bind(this));*/
					}
				});
			},
			Grid: null,
			columns: [
				{
					name: "name",
					label: "Имя",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "shopsCount",
					label: "Количество магазинов",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "sellQuality",
					label: "Качество продаж ",
					editable: false,
					cell: 'html',
					sortable: true,
				},{
					name: "",
					label: "",
					editable: false,
					cell: 'html',
					sortable: false,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return '<button type="button" class="btn no btn-primary">Передать</button>';
						}
					})
				}
			] 
		});

		
		this.Container = Marionette.LayoutView.extend({
			template: _.template(containerTpl),
			events: {
				"click #transferBtn" : "_onTransfer"
			},
			regions: {
				list: "#manager-shops-list",
				pagination: "#manager-shops-pagination"
			},
			initialize: function(model) {
				this.model = model;
				this.collection = new Collection();
				this.collection.fetch();
				
				var self = this;
				this.collection = new Collection();
				this.collection.fetch({reset: true}).done(function(){
					self.collection.trigger('change');
					self.Grid = new Backgrid.Grid({
						className: "table table-hover",
						columns : self.columns,
						collection : self.collection,
						emptyText: "Нет брендов",
						row: backGridVent,
						initialize: function() {
							this.collection.on('change', 'render', this);
						}
					});
					self.list.show( self.Grid );
					var pagination = new App.Pagination({collection: self.collection});
					self.pagination.show( pagination );

				});
			},
			_onTransfer: function() {
				var self = this;
				var selectedModels = this.Grid.collection.where({selected: true});
				App.dialogRegion.show( new TransferView({collection: new Backbone.Collection(selectedModels) }) );
				$('.modal').on('hidden.bs.modal', function (e) {
					self.collection.fetch();
				});
			},
			Grid: null,
			columns: [
				/*{		TODO : нужно расширение
					name: "",
					cell: "select-row",
					headerCell: "select-all"
				},*/
				{
					name: "",
					label: "<input type=\"checkbox\">",
					editable: false,
					cell: 'html',
					sortable: false,
					headerCell: Backgrid.HeaderCell.extend({
						className: "custom",
						events: {
							'click input': 'onClick'
						},
						onClick: function(e) {
							App.vent.trigger("change:selectAll");
							//console.log(this.$el.find('input[type="checkbox"]').is(':checked'));
							var value = (this.$el.find('input[type="checkbox"]').is(':checked')) ? true : false;
							this.$el.closest('table').find('input[type="checkbox"]').prop('checked', value);
						},
						render: function () {
							this.$el.empty();
							var column = this.column;
							var sortable = Backgrid.callByNeed(column.sortable(), column, this.collection);
							var label;
							if(sortable){
								label = $("<a>").text(column.get("label")).append("<b class='sort-caret'></b>");
							} else {
								label = column.get("label");
							}

							this.$el.append(label);
							this.$el.addClass(column.get("name"));
							this.$el.addClass(column.get("direction"));
							this.delegateEvents();
							return this;
						}
					}),
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return "<input type=\"checkbox\">";
						}
					})
				},
				{
					name: "name",
					label: "Название",
					editable: false,
					cell: 'html',
					sortable: true
				},{
					name: "monthIncome",
					label: "Объём продаж в текущем месяце",
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
					name: "date",
					label: "Дата включения",
					editable: false,
					cell: 'html',
					sortable: true,
					formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
						fromRaw: function (rawValue, model) {
							return moment(model.get('date'), "x").format("DD.MM.YY HH:mm");
						}
					})
				},{
					name: "jurface",
					label: "Юр. лицо",
					editable: false,
					cell: 'html',
					sortable: true
				}
			]
		});
		
	});
});
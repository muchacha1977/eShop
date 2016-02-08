/**
 * Trader v.0.0.7
 */

define([
    "app",
    "text!bundle/manufacturer/view/container.html",
	"text!bundle/manufacturer/view/manufacturer.html",
	
], function(
    App,
    containerTpl,
	manufacturerTpl
){
    return App.module("Manufacturer", function(Manufacturer, App, Backbone, Marionette, $, _) {

		var Doc = Backbone.Model.extend();

		var Docs = App.PageableCollection.extend({
			defaults: {
				manufacturer_id: 0
			},
			url: function() {
				return "rest/v0/manufacturer/documents/"+this.manufacturer_id;
			},
			model: Doc,
			state: { pageSize: 10 }
		});
		
		var Model = Backbone.Model.extend({
            defaults: {
				name		: "Неизвестный производитель"
            }
        });

		var View = Marionette.LayoutView.extend({
			template: _.template(manufacturerTpl),
			regions: {
				docsRegion: "#docs-list",
				docsPagerRegion: "#docs-pagination"
			},
			initialize: function() {
				
				var self = this;
				
				this.collection = new Docs();
				this.collection.manufacturer_id = this.model.get('id');
					
				this.collection.fetch({
					success: function() {

						var columns = [
							/*{
								name: "ico",
								label: "",
								cell: "html",
								editable: false,
								sortable: false,
								formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
									fromRaw: function (rawValue, model) {
										return '<i class="fa '+model.get('ico')+'" data-placement="top" data-original-title="Файл '+model.get('type')+'" data-toggle="tooltip"></i>';
									}
								})
							},*/
							{
								name: "name",
								label: "Название",
								cell: "html",
								editable: false,
								sortable: false,
								formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
									fromRaw: function (rawValue, model) {
										return '<a href="rest/v0/manufacturer/document/'+model.get('id')+'" data-placement="top" data-original-title="Скачать документ" data-toggle="tooltip">'+model.get('name')+'</a>';
									}
								})
							}/*,
							{
								name: "size",
								label: "Размер",
								cell: "html",
								editable: false,
								sortable: false
							}*/
						];

						var backGridVent = Backgrid.Row.extend({
							events: {
								'click .btn-link': "_onRemove"
							},
							_onRemove: function() {
								var self = this;
								require(["bundle/modal/modal"],
									function (Modal) {

										App.Wreqr.setHandler("modal:yes", function () {
											self.model.destroy({wait: true,
											error: function() {
												App.dialogRegion.destroy();
												window.setTimeout(function() {
														new Modal.View({
															text: "Ошибка удаления файла. Пожалуйста, обратитесь к разработчикам", 
															yes: "Закрыть", 
															no: "", 
															_template: "message", 
															_static: false
														});
													}, 1000);
												}
											});
										});
										new Modal.View({text: 'Уверены, что хотите удалить документ "'+self.model.get('name')+'"?', yes: "Удалить", no: "Отмена", _static: false});
									}
								);
							}
						});
						var backGrid = new Backgrid.Grid({
							className: "table table-hover",
							columns : columns,
						//	row: backGridVent,
							collection : self.collection,
							emptyText: "Нет данных для отображения."
						});

						self.docsRegion.show( backGrid );
						var pagination = new App.Pagination({collection: self.collection});
						self.docsPagerRegion.show( pagination );

						self.listenTo(self.collection, "sync", function(){
							self.setTooltip();
						});

					},
					error: function() {
						console.log("Ошибка обновления списка прикреплённых документов");
					}
				});
			},
			setTooltip: function(){
				App.tooltip();
			}
		});

        Manufacturer.Container = Marionette.LayoutView.extend({
			template: _.template(containerTpl),
			regions: {
				manufacturerRegion: '#manufacturerRegion',
			},

			initialize: function (options) {
				var self = this;
				var model = new Model();
				model.fetch({
					url: 'rest/v0/manufacturer/profile/'+options.id,
					success: function() {
						console.log(model);
						self.manufacturerRegion.show(
								new View({model: model})
							);
					}
				});
			},

			onShow: function () {
				var self = this;
			}
		});



        Manufacturer.onStart = function() {
            console.log("Manufacturer module started");
        };

        Manufacturer.onStop = function() {
            console.log("Manufacturer module stopped");
        };

    });
});
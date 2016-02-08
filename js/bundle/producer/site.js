define(["app",
        "bundle/common/collection/pageable-collection",
        "text!bundle/producer/view/site/container.html",
		
        "lib/fileuploader/vendor/jquery.ui.widget",
        "lib/fileuploader/jquery.iframe-transport",
        "lib/fileuploader/jquery.fileupload"
    ],
    function (App,
              PageableCollection,
              containerTpl) {
        'use strict';
        App.module("Site", function (Site, App, Backbone, Marionette, $, _) {

			var Doc = Backbone.Model.extend();

			var Docs = PageableCollection.Collection.extend({
				url: "rest/v0/manufacturer/document",
				model: Doc,
				state: { pageSize: 10 }
			});

			var Model = Backbone.Model.extend({
                url: "rest/v0/manufacturer/profile",
                defaults: {
					site	: "",
					description	: "",
					appeal	: "",
					address	: "",
					phone	: "",
					inn		: "",
					kpp		: ""
				},
				validate: function() {
					var errors = [];
					
					var kpp = Number(this.get('kpp'));
					if(kpp!="" && kpp != this.get('kpp')) {
						errors.push({
							id		: 'kpp',
							error	: 'Неверно указан КПП организации',
						});
					}
					
					var inn = Number(this.get('inn'));
					if(inn!="" && inn != this.get('inn')) {
						errors.push({
							id		: 'inn',
							error	: 'Неверно указан ИНН организации',
						});
					}
					
					var phone = this.get('phone');
					var phoneReg = /^\+\d\s\([\d]{3}\)\s[\d]{3}\-[\d]{2}\-[\d]{2}$/;
					if ( phone!="" && !phoneReg.test(phone) ) {
						errors.push({
							id		: 'phone',
							error	: 'Неверно указан номер телефона',
						});
					}
					
					if(errors.length > 0) {
						return errors;
					}
				}
			});

            this.View = Marionette.LayoutView.extend({
                template: _.template(containerTpl),

                ui: {
                    uploadInput	: '#fileUploadInput',
                    logoImg		: '#producer-logo',
					saveBtn		: '#saveProducerInfoBtn',
                    uploadDoc	: '#docUploadInput'
                },
				events: {
					'click @ui.saveBtn': '_onSave'
				},
				regions: {
					docsRegion: "#docs-list",
                    docsPagerRegion: "#docs-pagination"
				},
                initialize: function(){
                    var self = this;
					
					self.collection = new Docs();
					self.collection.fetch({
						url: 'rest/v0/manufacturer/documents',
						success: function() {
							
							console.log(self.collection);
														
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
								},
								/*{
									name: "size",
									label: "Размер",
									cell: "html",
									editable: false,
									sortable: false
								},*/
								{
									name: "options",
									label: "",
									cell: "html",
									editable: false,
									sortable: false,
									formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
										fromRaw: function (rawValue, model) {
											return '<button type="button" class="btn btn-link" data-placement="top" data-original-title="Удалить документ" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
										}
									})
								}
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
								row: backGridVent,
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
					
					
                    this.model = new Model();
                    this.model.fetch().done(function(){
						self.render();
                    });
					
                },
                setTooltip: function(){
                    App.tooltip();
                },			

                onRender: function() {
					this.$('#phone').mask("+9 (999) 999-99-99");
                    this._refreshImg();
					this._fileUpload();
					this._docUpload();
                },

                _refreshImg: function() {
					if(typeof this.model.get('id') != 'undefined')
						this.ui.logoImg.attr({src: 'rest/v0/manufacturer/logo/'+this.model.get('id')+'?time=' + new Date().getTime()});
                },

                _fileUpload: function(e) {
					var self = this;
                    this.ui.uploadInput.fileupload({
                        url: 'rest/v0/manufacturer/logo',
                        add: function (e, data) {
							e.preventDefault();
                            data.submit();
                        },
                        done: function(e,data) {
							self._onFileUploadSuccess(e,data);
						},
                        fail: self._onFileUploadFail
                    });
                },

                _onFileUploadSuccess: function(e, data) {
					var self = this;
                    require(["bundle/modal/modal"], function (Modal) {
                        if (data._response.jqXHR.status == 200) {
                            self._refreshImg();
                            new Modal.View({
                                text: '<h5>Файл был успешно загружен на сервер</h5>',
                                _template: "message",
                                _static: false
                            });

                        } else {
                            new Modal.View({
                                text: '<h5>Файл не был загружен на сервер</h5>',
                                _template: "message",
                                _static: false
                            });
                        }
                    }.bind(this));
                },

                _onFileUploadFail: function(e, data) {
                    require(["bundle/modal/modal"], function (Modal) {
                            var responseJSON = data.response().jqXHR.responseJSON || {};
                            var errMessage = responseJSON.message || data.errorThrown;
                            new Modal.View({
                                text: '<h5>Файл не был загружен (' + errMessage + ')</h5>',
                                _template: "message",
                                _static: false
                            });
                        }
                    );
                },
				
				_docUpload: function(e) {
					var self = this;
                    this.ui.uploadDoc.fileupload({
                        url: 'rest/v0/manufacturer/document',
                        add: function (e, data) {
							e.preventDefault();
                            data.submit();
                        },
                        done: function(e,data) {
							self._onDocUploadSuccess(e,data);
						},
                        fail: self._onFileUploadFail
                    });
				},

                _onDocUploadSuccess: function(e, data) {
					var self = this;
                    require(["bundle/modal/modal"], function (Modal) {
                        if (data._response.jqXHR.status == 200) {
                            self._refreshDocsList();
                            new Modal.View({
                                text: '<h5>Файл был успешно загружен на сервер</h5>',
                                _template: "message",
                                _static: false
                            });

                        } else {
                            new Modal.View({
                                text: '<h5>Файл не был загружен на сервер</h5>',
                                _template: "message",
                                _static: false
                            });
                        }
                    }.bind(this));
                },
				
				_refreshDocsList: function() {
					this.collection.fetch({
						url: 'rest/v0/manufacturer/documents',
						success: function() {
							console.log('коллекция обновлена');
						}
					});
				},
				_onSave: function() {
					var self = this;
					this.model.set({
						site	: self.$el.find('#site').val(),
						description	: self.$el.find('#description').val(),
						appeal	: self.$el.find('#appeal').val(),
						address	: self.$el.find('#address').val(),
						phone	: self.$el.find('#phone').val(),
						inn		: self.$el.find('#inn').val(),
						kpp		: self.$el.find('#kpp').val()
					});
					var validationResult = this.model.validate();
					
					this.$el.find('.form-group').removeClass('has-error').find('input').attr({title: ''});
					this.$el.find('#alert').remove();
					
					if(typeof validationResult === 'undefined') {
						this.model.save(null, {
							success: function(model, response, options) {
								require(["bundle/modal/modal"],
									function (Modal) {
										new Modal.View({text: "Изменения сохранены", _template: "message", _static: false});
									}
								);
							},
							error: function(model, response, options) {
								console.error("Info edit failed: " + response.status);
							}
						});
						return;
					}
					
					// Поведение, если имеются ошибки
					this.$el.find('#producerInfoForm').prepend('<div id="alert"><div class="alert alert-danger">');
					for(var i in validationResult) {
						var Obj = validationResult[i];
						this.$el.find('#'+Obj.id).attr({title: Obj.error}).closest('.form-group').addClass('has-error');
						this.$el.find('#alert div').append('<p>'+Obj.error+'</p>');
					}
					
					this.model.save();
				}

            });
			

        });

        return App.Site;
    }
);

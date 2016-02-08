define(["app",
        "bundle/trader/model/offers",
        "text!bundle/trader/view/offer/container.html",
        "text!view/product-link.html",
        "text!view/shipment-types.html",

        "model/shipments",
        "lib/fileuploader/vendor/jquery.ui.widget",
        "lib/fileuploader/jquery.iframe-transport",
        "lib/fileuploader/jquery.fileupload",
        "backgrid.select"
    ],
    function (App,
              Data,
              containerTpl,
              viewProductLink,
              viewShipmentTypes) {
        return App.module("Offers", function (Offers, App, Backbone, Marionette, $, _) {
            'use strict';

            this.View = Marionette.LayoutView.extend({

                template: _.template(containerTpl),

                Grid: null,

                regions: {
                    prodListRegion: "#shop-prods-list",
                    prodPagerRegion: "#shop-prods-pagination"
                },

                ui: {
                    downloadBtn: '#download-prods-list',
                    uploadBtn: '#upload-prods-list',
                    uploadInput: '#fileUploadInput',
                    activateAllBtn: '#activate-all',
                    inactivateAllBtn: '#inactivate-all',
                    activateSelectedBtn: '#activate-selected',
                    inactivateSelectedBtn: '#inactivate-selected',
                    deleteSelectedBtn: '#delete-selected'
                },

                events: {
                    "click @ui.downloadBtn": "_onDownloadProds",
                    "click @ui.activateAllBtn": "_onChangeAllActivation",
                    "click @ui.inactivateAllBtn": "_onInactivateAll",
                    "click @ui.activateSelectedBtn": "_onActivateSelected",
                    "click @ui.inactivateSelectedBtn": "_onInactivateSelected",
                    "click @ui.deleteSelectedBtn": "_onDeleteSelected"
                },

                initialize: function () {
                    this.collection = new Data.TraderProductsCollection();

                    var self = this;
                    self.setTooltip();
                    self.listenTo(self.collection, "backgrid:sort", function () {
                        self.setTooltip();
                    });

                    self.listenTo(self.collection, "sync", function () {
                        self.setTooltip();
                    });

                    this.collectionRefresh();

                    App.Wreqr.setHandler("offers:fetch", function () {
                        self.collectionRefresh();
                    });
                },
                setTooltip: function () {
                    App.tooltip();
                },

                onRender: function () {
                    this._fileUpload();
                },

                collectionRefresh: function () {
                    var self = this;
                    this.collection.fetch({
                        reset: true,
                        success: function () {
                            var columns = [
                                {
                                    name: "",
                                    cell: "select-row",
                                    headerCell: "select-all"
                                }, {
                                    name: "product.barCode",
                                    label: "Штрих-код",
                                    cell: "html",
                                    editable: false,
                                    sortable: true,
                                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                        fromRaw: function (rawValue, model) {
                                            return App.barCode(model.attributes.product.barCode);
                                        }
                                    })
                                }, {
                                    name: "product.name",
                                    label: "Наименование",
                                    cell: "html",
                                    editable: false,
                                    sortable: true,
                                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                        fromRaw: function (rawValue, model) {
                                            var template = _.template(viewProductLink);
                                            return template(model.attributes.product);
                                        }
                                    })
                                    /*formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                     fromRaw: function (rawValue, model) {
                                     return "<a href=\"\|>"+model.attributes.product.name+"</a>";
                                     }
                                     })*/
                                }, {
                                    name: "unitPrice",
                                    label: "Цена, руб.",
                                    className: 'text-right',
                                    cell: Backgrid.NumberCell.extend({
                                        orderSeparator: ' ',
                                        decimalSeparator: ','
                                    }),
                                    editable: false,
                                    sortable: true,
                                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                        fromRaw: function (rawValue, model) {
                                            return App.decimal(model.get('unitPrice'));
                                        }
                                    })
                                }, {
                                    name: "quantity",
                                    label: "Кол-во",
                                    cell: "integer",
                                    editable: false,
                                    sortable: true
                                }, {
                                    name: "active",
                                    label: "Статус",
                                    cell: 'stringcenter',
                                    editable: false,
                                    sortable: true,
                                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                        fromRaw: function (rawValue, model) {
                                            return (model.get('active')) ? "Активен" : "Неактивен";
                                        }
                                    })
                                }, {
                                    name: "icons",
                                    label: "Доставка",
                                    editable: false,
                                    cell: 'htmlcenter',
                                    sortable: false,
                                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                        fromRaw: function (rawValue, model) {
                                            if (typeof model.attributes.shipmentTypes === 'undefined') return;
                                            var shipment = new Backbone.Collection();
                                            _.each(Data.ShipmentsPrototype.toJSON(), function (value, key, list) {
                                                if (model.attributes.shipmentTypes[value.id] == true) {
                                                    shipment.add(Data.ShipmentsPrototype.at(key));
                                                }
                                            });
                                            var template = _.template(viewShipmentTypes);
                                            return template({shipmentsTypes: shipment.toJSON()});
                                        }
                                    })
                                }
                            ];

                            self.render();

                            self.Grid = new Backgrid.Grid({
                                className: "table table-hover",
                                columns: columns,
                                collection: self.collection,
                                emptyText: "Нет данных для отображения."
                            });

                            self.prodListRegion.show(self.Grid);
                            var pagination = new App.Pagination({collection: self.collection});
                            self.prodPagerRegion.show(pagination);
                        }
                    });
                },


                _fileUpload: function () {
                    this.ui.uploadInput.fileupload({
                        url: 'rest/v0/offer/l',
                        add: function (e, data) {
                            data.submit();
                        },
                        done: this._onFileUploadSuccess,
                        fail: this._onFileUploadFail
                    });
                },

                _onDownloadProds: function (e) {
                    var url = "rest/v0/offer/l?token=" + Data.user.get("token");
                    var html = "<iframe src=\"" + url + "\"></iframe>";
                    var div = this.$("#shop-prods-frame-div");
                    div.html(html);
                    div.children().on("load", function (e) {
                        console.log("download " + e);
                    });
                    return false;
                },

                _onFileUploadSuccess: function (e, data) {
                    require(["bundle/modal/modal"], function (Modal) {
                        if (data._response.jqXHR.status == 200) {
                            var result = data._response.result;
                            new Modal.View({
                                text: '<h5>Файл был успешно загружен на сервер</h5>',
                                _template: "message",
                                _static: false
                            });
                            App.Wreqr.execute("offers:fetch");
                        } else {
                            new Modal.View({
                                text: '<h5>Файл не был загружен на сервер</h5>',
                                _template: "message",
                                _static: false
                            });
                        }
                    });
                },

                _onFileUploadFail: function (e, data) {
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

                _onInactivateAll: function (e) {
                    this._onChangeAllActivation(e, true);
                },
                _onChangeAllActivation: function (e, action) {
                    var model = new Backbone.Model();
                    var self = this;
                    if (!action) {
                        model.url = "rest/v0/offer/activate/all";
                        var successMessage = "Весь ассортимент опубликован.";
                    } else {
                        model.url = "rest/v0/offer/inactivate/all";
                        var successMessage = "Предложения сняты с публикации на сайте.";
                    }
                    model.save(null, {
                        success: function () {
                            require(["bundle/modal/modal"], function (Modal) {
                                    new Modal.View({
                                        text: '<h5>' + successMessage + '</h5>',
                                        _template: "message",
                                        _static: false
                                    });
                                }
                            );
                            self.collectionRefresh();
                        },
                        error: function () {
                            require(["bundle/modal/modal"], function (Modal) {
                                    new Modal.View({
                                        text: '<h5>Ошибка изменения статуса ассортимента</h5>',
                                        _template: "message",
                                        _static: false
                                    });
                                }
                            );
                        }
                    });
                    return;
                },

                _onActivateSelected: function (e) {
                    e.preventDefault();
                    this._changeActivation(true, 'Предложения опубликованы.');
                },

                _onInactivateSelected: function (e) {
                    e.preventDefault();
                    this._changeActivation(false, 'Предложения сняты с публикации на сайте.');
                },

                _changeActivation: function (active, message) {
                    var self = this;
                    var selectedModels = this.Grid.getSelectedModels();
                    var collection = this.collection;

                    var selectedCnt = selectedModels.length;
                    var operationsCnt = 0;
                    var errors = false;
                    var offer = Backbone.Model.extend({
                        urlRoot: 'rest/v0/offer'
                    });
                    _.each(selectedModels, function (model) {
                        var m = new offer({id: model.get('id')});
                        m.save({active: active}, {
                            patch: true,
                            success: function () {
                                var mod = collection.get(model.get('id'));
                                mod.set('active', active);
                                operationsCnt++;
                                if (selectedCnt <= operationsCnt) {
                                    self.collectionRefresh();
                                    if (errors === true) {
                                        message = "Произошли ошибки обновления некоторых данных. Пожалуйста, проверьте список";
                                    }
                                    require(["bundle/modal/modal"], function (Modal) {
                                            new Modal.View({
                                                text: '<h5>' + message + '</h5>',
                                                _template: "message",
                                                _static: false
                                            });
                                        }
                                    );
                                }
                            },
                            error: function () {
                                operationsCnt++;
                                errors = true;
                            }
                        });
                    });
                },

                _onDeleteSelected: function (e) {
                    e.preventDefault();
                    var self = this;
                    var selectedModels = this.Grid.getSelectedModels();
                    var collection = this.collection;

                    var selectedCnt = selectedModels.length;
                    var operationsCnt = 0;
                    var errors = false;
                    var message = "Все выделенные предложения успешно удалены из ассортимента.";

                    var offer = Backbone.Model.extend({
                        urlRoot: 'rest/v0/offer'
                    });
                    _.each(selectedModels, function (model) {
                        var m = new offer({id: model.get('id')});
                        m.destroy({
                            wait: true,
                            success: function () {
                                collection.remove(model);
                                operationsCnt++;
                                if (selectedCnt <= operationsCnt) {
                                    self.collectionRefresh();
                                    if (errors === true) {
                                        message = "Произошли ошибки во время удаления товаров из списка. Пожалуйста, проверьте правильность данных и при необходимости повторите операцию.";
                                    }
                                    require(["bundle/modal/modal"], function (Modal) {
                                            new Modal.View({
                                                text: '<h5>' + message + '</h5>',
                                                _template: "message",
                                                _static: false
                                            });
                                        }
                                    );
                                }
                            },
                            error: function () {
                                operationsCnt++;
                                errors = true;
                            }
                        });
                    });
                }
            });

        });
    }
);

define([
        "app",
        "bundle/trader/model/bids",
        "text!bundle/trader/view/bid/all-container.html",
        "text!view/product-link.html",
        "bundle/modal/modal",
        "moment",

        "model/state",
        "backgrid.select"
    ],
    function (App,
              Data,
              containerTpl,
              viewProductLink,
              Modal,
              moment) {
        App.module("AllBids", function (AllBids, App, Backbone, Marionette, $, _) {
            'use strict';
            this.Container = Marionette.LayoutView.extend({

                Grid: null,
                template: _.template(containerTpl),
                backGridVent: Backgrid.Row.extend({
                    events: {
                        'click .btn--edit': 'onDetail'
                    },
                    onDetail: function (e) {
                        e.preventDefault();
                        var selfModel = this.model;
                        require(['bundle/trader/bids-detail'], function (BidsDetail) {
                            App.dialogRegion.show(new BidsDetail.BidView({model: selfModel}));
                        });
                    }
                }),
                regions: {
                    list: "#trader-bids-list",
                    pagination: "#trader-bids-pagination"
                },
                initialize: function () {
                    var self = this;
                    this.collection = new Data.TraderBidsCollection();
                    this.collection.fetch({reset: true}).done(function () {
                        self.collection.onChange();
                        self.Grid = new Backgrid.Grid({
                            className: "table table-hover",
                            columns: self.columns,
                            collection: self.collection,
                            emptyText: "Нет новых заявок",
                            row: self.backGridVent
                        });
                        self.list.show(self.Grid);

                        self.listenTo(self.collection, "change", function () {
                            self.collection.onChange();
                        });


                        var pagination = new App.Pagination({collection: self.collection});
                        self.pagination.show(pagination);
                        self._setTooltip();
                    });

                    this.listenTo(self.collection, "sync", function(){
                        self._setTooltip();
                    });

                    this.listenTo(this.collection, "backgrid:sort", function(){
                        self._setTooltip();
                    });
                },
                _setTooltip: function(){
                    App.tooltip('.sortable a', 'top', 'Сортировка');
                    App.tooltip('.btn--tooltip', 'top', 'Открыть');
                    App.tooltip();
                },
                columns: [
                    {
                        name: "name",
                        label: "№ заявки",
                        editable: false,
                        cell: 'htmlright',
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<a class="btn--tooltip btn--orders btn--edit" href="#">'+ rawValue +'</a>';
                            }
                        })
                    },
                    {
                        name: "creationTime",
                        label: "Размещено",
                        editable: false,
                        cell: 'htmlcenter',
                        sortable: true
                    },
                    {
                        name: "deliveryDate",
                        label: "Дата доставки",
                        editable: false,
                        cell: 'htmlcenter',
                        sortable: true
                    },
                    {
                        name: "validUntil",
                        label: "Окончание",
                        editable: false,
                        cell: 'htmlcenter',
                        sortable: true
                    },
                    {
                        name: "product.barCode",
                        label: "Штрих-код",
                        editable: false,
                        cell: 'string',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return App.barCode(model.attributes.product.barCode);
                            }
                        })
                    },
                    {
                        name: "product.name",
                        label: "Товар",
                        editable: false,
                        cell: 'html',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                var template = _.template(viewProductLink);
                                return template(model.attributes.product);
                            }
                        })
                    },
                    {
                        name: "quantity",
                        label: "Кол-во",
                        editable: false,
                        cell: 'integer'
                    },
                    {
                        name: "unitPrice",
                        label: "Цена",
                        editable: false,
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        })
                    },
                    {
                        name: "totalPrice",
                        label: "Сумма",
                        editable: false,
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        })
                    },
                    {
                        name: "buyer.name",
                        label: "Покупатель",
                        editable: false,
                        cell: 'html',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.buyer.name;
                            }
                        })
                    },
                    {
                        name: "regionName",
                        label: "Регион",
                        editable: false,
                        cell: 'string'
                    }
                ]

            });


        });

        return App.AllBids;
    }
);
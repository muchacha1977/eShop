/**
 * Created by GOODPROFY on 30.07.2015.
 */

define([
    "app",
    'text!view/product-link.html',
    'text!view/region-link.html',
    'text!bundle/catalog/view/product/bids.html',
    'text!view/shipment-types.html',
    'moment',
    'model/regions',
    'model/state',
    'model/bid',
    'model/shipments'
], function(
    App,
    viewProductLink,
    viewRegionLink,
    viewBids,
    viewShipmentTypes,
    moment,
    DataRegions,
    Data
) {
    "use strict";
    return App.module("Catalog.Product.Bids", function(Bids, App, Backbone, Marionette, $, _) {

        this.onStart = function(options){
            console.log('Catalog.Product.Bids >>> Start');
        };

        this.onStop = function(){
            console.log('Catalog.Product.Bids >>> Stop');
        };

        this.Container = Marionette.LayoutView.extend({

            template: _.template(viewBids),
            regions: {
                birdCurrentAskListRegion: "#bird-list",
                birdCurrentAskPagerRegion: "#bird-pagination"
            },
            initialize: function (options) {
                options || ( options = {} );
                var self = this;
                DataRegions.start();
                Bids = new Data.Bid.ActiveCurrentBids({id: options.id});
                Bids.on('change', Bids.onChange);
                $.when(
                    DataRegions.Collection.fetch({reset: true}),
                    Bids.fetch({reset: true})
                ).done(function(){
                        Bids.trigger('change');
                        var columns = [
                            {
                                name: "name",
                                label: "№",
                                cell: "htmlright",
                                editable: false,
                                sortable: false,
                                formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                    fromRaw: function (rawValue, model) {
                                        return '<a class="btn-link btn--tooltip btn--asks" href="#birds/asks/' + model.get('id') + '">' + rawValue + '</a>'; //todo--href="#birds/asks/?
                                    }
                                })
                            },
                            {
                                name: "creationTime",
                                label: "Размещено",
                                editable: false,
                                cell: 'htmlcenter',
                                direction: "descending",
                                formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                    fromRaw: function (rawValue, model) {
                                        return '<span data-toggle="tooltip" data-original-title="' + moment(rawValue).format('DD.MM.YY HH:mm') + '" data-placement="top"  id="creationTime' + model.get('id') + '">' + moment(rawValue).format('DD.MM.YY') + '</span>';
                                    }
                                })

                            },
                            {
                                name: "validUntil",
                                label: "Окончание",
                                cell: "htmlcenter",
                                editable: false,
                                formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                    fromRaw: function (rawValue) {
                                        return moment(rawValue).format('DD.MM.YY');
                                    }
                                })
                            },
                            {
                                name: "product.barCode",
                                label: "Штрихкод",
                                cell: "string",
                                editable: false,
                                formatter: {
                                    fromRaw: function (rawValue, model) {
                                        return model.attributes.product.barCode;
                                    }
                                }
                            },
                            {
                                name: "quantity",
                                label: "Кол-во",
                                cell: "integer",
                                sortable: true,
                                editable: false
                            },
                            {
                                name: "unitPrice",
                                label: 'Цена',
                                cell: Backgrid.NumberCell.extend({
                                    orderSeparator: ' ',
                                    decimalSeparator: ','
                                }),
                                editable: false
                            },
                            {
                                name: 'totalPrice',
                                label: 'Стоимость',
                                cell: Backgrid.NumberCell.extend({
                                    orderSeparator: ' ',
                                    decimalSeparator: ','
                                }),
                                editable: false
                            },
                            {
                                name: 'region',
                                label: 'Регион',
                                cell: "html",
                                editable: false,
                                formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                    fromRaw: function (rawValue, model) {
                                        var find = DataRegions.Collection.findWhere({id: rawValue});
                                        if (typeof find === 'undefined') return '';
                                        var template = _.template(viewRegionLink);
                                        return template({name: find.get('name')});
                                    }
                                })
                            },
                            {
                                name: 'shipmentTypes',
                                label: 'Доставка',
                                cell: "htmlcenter",
                                editable: false,
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
                            },
                            {
                                name: 'asks',
                                label: 'Откликов',
                                cell: "integer",
                                sortable: false,
                                editable: false
                            },
                            {
                                name: "asks",
                                label: "Откликнуться",
                                editable: false,
                                sortable: false,
                                cell: 'html',
                                formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                    fromRaw: function (rawValue, model) {
                                        return '<button typ="button" id="createAskBtn" class="btn btn-primary btn-block">' + 'Откликнуться' +
                                            '</button>';
                                    }
                                })

                            }

                        ];

                        var clickByLinkAsks = Backgrid.Row.extend({
                            events: {
                                "click .btn--asks": "onClick",
                                'click #createAskBtn': 'onDetail'

                            },
                            onClick: function (e) {
                                return false;
                            },
                            onDetail: function (e) {
                                console.log("onDetail");

                                var selfModel = this.model;
                                console.log(selfModel);

                                require(['bundle/trader/bids-detail'], function (BidsDetail) {
                                    App.dialogRegion.show(new BidsDetail.BidView({model: selfModel}));

                                });
                                return false;
                            }
                        });

                        var backGrid = new Backgrid.Grid({
                            className: "table table-hover",
                            columns: columns,
                            collection: Bids,
                            emptyText: "Заявок нет",
                            row: clickByLinkAsks
                        });

                        self.birdCurrentAskListRegion.show(backGrid);
                        self.birdCurrentAskPagerRegion.show(new App.Pagination({collection: Bids}));

                        self._setTooltip();
                        DataRegions.stop();
                    });

                this.listenTo(Bids, "backgrid:sort", this._setTooltip);

                this.listenTo(Bids, "sync", this._setTooltip);
            },
            _setTooltip: function () {
                App.tooltip();
            }
        });


    });

});

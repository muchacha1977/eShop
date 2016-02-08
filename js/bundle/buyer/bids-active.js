/**
 * Заявки текущие со статусом active
 * @version 0.0.3
 * Created by Yuriy Dolganov(GOODPROFY) on 19.05.2015.
 * @TODO Добавить валидацию
 * @TODO Требудет рефакторинга
 */
define([
        "app",
        "model/user",
        "text!bundle/buyer/view/bids/active.html",
        "text!view/btn-change.html",
        "moment",
        "text!view/button-state.html",
        "model/regions",
        "text!view/product-link.html",
        "text!view/region-link.html",
        "text!view/shipment-types.html",

        "model/state",
        'model/bid',
        'model/shipments',
],
    function(
        App,
        Data,
        buyerCurrentAsksTpl,
        btnChangeTpl,
        moment,
        viewBtnState,
        DataRegions,
        viewProductLink,
        viewRegionLink,
        viewShipmentTypes
) {

    return App.module("Buyer.Bids.Active", function(Active, App, Backbone, Marionette, $, _) {


        Active.ContainerView = Marionette.LayoutView.extend({

            template: _.template(buyerCurrentAsksTpl),
            regions: {
                buyerCurrentAskListRegion: "#buyer-asks-list",
                buyerCurrentAskPagerRegion: "#buyer-asks-pagination"
            },
            initialize: function(){
                App.loadCss('bundle/buyer/css/buyer.css');
            },
            onBeforeShow: function() {
                DataRegions.start();

                var self = this;
                var Bids = new Data.Bid.Active();

                $.when(
                    DataRegions.Collection.fetch({reset:true}),
                    Bids.fetch({reset:true}))
                    .done(function(){
                    var columns = [{
                            name: "name",
                            label: "№",
                            cell: "html",
                            editable: false,
                            sortable: false,
                            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function (rawValue, model) {
                                    return '<a class="btn-link btn--tooltip btn--asks" href="#buyer/bids/active?bid=' +model.get('id')+ '">'+ rawValue +'</a>';
                                }
                            })
                        },
                        {
                            name: "creationTime",
                            label: "Размещено",
                            editable: false,
                            cell: 'html',
                            direction: "descending",
                            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function (rawValue, model) {
                                    return '<span data-toggle="tooltip" data-original-title="'+moment(rawValue).format('DD.MM.YY HH:mm')+'" data-placement="top"  id="creationTime'+model.get('id')+'">'+moment(rawValue).format('DD.MM.YY')+'</span>';
                                }
                            })

                        },
                        {
                            name: "validUntil",
                            label: "Окончание",
                            cell: "datetime",
                            editable: false,
                            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function (rawValue) {
                                    return moment(rawValue).format('DD.MM.YY');
                                }
                            })
                        },
                        /*{
                            name: "product.barCode",
                            label: "Штрихкод",
                            cell: "string",
                            editable: false,
                            formatter: {
                                fromRaw: function (rawValue, model) {
                                    return model.attributes.product.barCode;
                                }
                            }
                        },*/
                        {
                            name: "product.name",
                            label: "Товар",
                            cell: 'html',
                            editable: false,
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
                            className: 'text-right',
                            editable: false
                        },
                        {
                            name: 'totalPrice',
                            label: 'Стоимость',
                            className: 'text-right',
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
                                    if ( typeof find === 'undefined' ) return '';
                                    var template = _.template(viewRegionLink);
                                    return template({name: find.get('name')});
                                }
                            })
                        },
                        {
                            name: 'shipmentTypes',
                            label: 'Доставка',
                            cell: "html",
                            editable: false,
                            sortable: false,
                            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function (rawValue, model) {
                                    if ( typeof model.attributes.shipmentTypes === 'undefined' ) return;
                                    var shipment = new Backbone.Collection();
                                    _.each(Data.ShipmentsPrototype.toJSON() , function(value, key, list){
                                        if ( model.attributes.shipmentTypes[value.id] == true ){
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
                            sortable: true,
                            editable: false
                        },
                        /*{
                            name: 'state',
                            label: 'Статус',
                            editable: false,
                            sortable: false,
                            cell: "html",
                            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function (rawValue) {
                                    var state = Data.State.findWhere({state: rawValue});
                                    var template = _.template(viewBtnState);
                                    return template(state.toJSON());
                                }
                            })
                        }*/
                    ];

                    var backGrid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : columns,
                        collection : Bids,
                        emptyText: "Нет данных для отображения."
                    });

                    self.buyerCurrentAskListRegion.show( backGrid );
                    self.buyerCurrentAskPagerRegion.show( new App.Pagination({collection: Bids}) );

                    DataRegions.stop();
                    self.setTooltip();
                    Bids.on('sync', function(){
                        self.setTooltip();
                    });

                });



            },
            setTooltip: function(){

                App.tooltip('.btn--tooltip', 'top', 'Открыть');
                App.tooltip('.sortable a', 'top', 'Сортировка');
                App.tooltip();
            }
        });

        Active.onStart = function() {
            console.log("Buyer.Bids.Active view started");
        };

        Active.onStop = function() {
            console.log("Buyer.Bids.Active view stopped");
        };
    });

});
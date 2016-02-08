/**
 * Выводим список откликов
 * Created by GOODPROFY on 18.06.2015.
 */

define([
    'app',
    'model/shipments',
    "moment",
    "text!view/shipment-types.html",
    "model/regions",
    'text!view/shop-rating.html',
    "text!bundle/buyer/view/asks/asks.html",
    'model/bid'
], function(
    App,
    Data,
    moment,
    viewShipmentTypes,
    DataRegions,
    viewShopRating,
    viewAsks
){
    return App.module("Buyer.Asks", function (Asks, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;
        this.onStart = function (options) {
            console.log("Buyer.Asks >>> view started");
            var options = options || {};
            var bid = new Data.Bid.Model({id: options.id});
            bid.fetch().done(function(){
                App.dialogRegion.destroy();
                App.dialogRegion.show(new Dialog({model: bid, subTab: options.subTab}));
            });

            $('.modal').one('hidden.bs.modal', function (e) {
                Asks.stop();
                App.navigate(App.getPathFromUrl(), true);
            });
        };

        this.onStop = function () {
            console.log("Buyer.Asks <<< view stopped");
        };

        var Dialog = Marionette.LayoutView.extend({
            template: _.template(viewAsks),
            events: {
                'click #modal-btn-yes': 'backView'
            },
            initialize: function(options){
                this.subTab = options.subTab || (options.subTab = null);
            },
            subTab: null,
            onShow: function(options){
                console.log(this.model.toJSON());
                var self = this;
                var columns = [{
                        name: "shop.name",
                        label: "Магазин",
                        cell: "html",
                        editable: false,
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<a class="btn-link" target="_blank" href="#prodlist/-/' +model.attributes.shop.id+ '/-">'+ model.attributes.shop.name +'</a>';
                            }
                        })
                    },
                    {
                        name: "shop.rate",
                        label: "Рейтинг",
                        editable: false,
                        cell: 'html',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                var template = _.template(viewShopRating);
                                return template({shop: {ratig: model.attributes.shop.rating}});
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
                    }

                ];

                if ( self.subTab == 'active' ){
                    columns.push(

                        {
                            name: "",
                            label: "Выбрать",
                            cell: "html",
                            sortable: false,
                            editable: false,
                            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function (raw, model) {
                                    return '<a href="#'+ App.getCurrentRoute() +'&ask='+ model.get('id') +'" class="btn btn-primary">Выбрать</button>';
                                }
                            })
                        }

                    );
                }

                var clickByOrder = Backgrid.Row.extend({
                    events: {
                        "click .btn-primary": "onClick"
                    },
                    onClick: function (e) {
                        Asks.stop();
                    }
                });

                var asksCollection = App.PageableCollection.extend({
                    url:'rest/v0/bid/'+self.model.get('id')+'/ask',
                    state: {
                        pageSize: 10
                    }
                });

                var asks = new asksCollection();

                asks.fetch({reset: true}).done(function(){

                    self.model.set({
                        regionData: DataRegions.Collection.toJSON(),
                        shipmentsData: Data.ShipmentsPrototype.toJSON()
                    },{silent:true});

                    var backGrid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : columns,
                        collection : asks,
                        emptyText: "Откликов пока не было.",
                        row: clickByOrder
                    });

                    self.$('#buyer-asks-list').append(backGrid.render().$el);
                    var pagination = new App.Pagination({collection: asks});
                    console.log(asks);
                    console.log(pagination.el);
                    self.$('#modal-btn-closed').before( pagination.el );

                    self.setTooltip();
                    Asks.on('sync', function(){
                        self.setTooltip();
                    });
                });


            },

            backView: function(options){
                App.navigate(App.getPathFromUrl()+'?bid='+this.model.get('id'), true);
                Asks.stop();
            },

            setTooltip: function(){
                App.tooltip();
                App.tooltip('.btn--tooltip', 'top', 'Открыть');
                App.tooltip('.sortable a', 'top', 'Сортировка');
            }

        });
    });
});

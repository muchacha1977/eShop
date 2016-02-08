/**
 * Created by GOODPROFY on 18.07.2015.
 */
define([
        "app",
        "text!bundle/trader/view/ordergroups/ordergroups.html",
        "text!view/button-state.html",
        "text!view/shipment-types.html",
        "text!view/comment.html",
        'common/state-change',
        'common/bulk-actions',
        "model/state",

        'model/shipments',
        'model/ordergroup',
        'backgrid.select'
    ],
    function (
        App,
        viewOrdersGroups,
        viewBtnState,
        viewShipmentTypes,
        viewComment,
        StateChange,
        BulkActions,

        Data
    ) {

        return App.module("Trader.Orders.OrderGroups", function (OrderGroups, App, Backbone, Marionette, $, _) {

            this.onStart = function () {
                console.log("Trader.Orders.OrderGroups >>> start");
            };

            this.onStop = function () {
                console.log("Trader.Orders.OrderGroups <<< stop");
            };

            this.View = Marionette.LayoutView.extend({
                template: _.template(viewOrdersGroups),
                regions: {
                    list: "#list",
                    pagination: "#pagination",
                    bulkActions: "#region-bulk-actions"
                },
                events: {
                    'click #vent-refresh': function(){
                        this.collection.fetch({reset:true});
                    }
                },
                _Grid: null,
                _Columns: [
                    {
                        name: "",
                        cell: "select-row",
                        headerCell: "select-all"
                    },

                    {
                        name: "name",
                        label: "№ заказа",
                        editable: false,
                        cell: 'htmlright',
                        sortable: true,

                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<a data-id="'+ model.attributes.id +'" class="btn--tooltip btn--orders btn--edit" href="#trader/orders/ordergroups?ordergroup='+ model.attributes.id +'">'+ model.attributes.name +'</a>';
                            }
                        })

                    },

                    {
                        name: "shipmentDate",
                        label: "Дата доставки",
                        editable: false,
                        cell: 'htmlcenter',
                        direction: "descending"

                    },

                    {
                        name: "shipmentType",
                        label: "Доставка",
                        editable: false,
                        cell: 'htmlcenter',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                if ( typeof model.attributes.shipmentType === 'undefined' ) return;
                                var shipment = new Backbone.Collection();
                                _.each(Data.ShipmentsPrototype.toJSON(), function(value, key, list){
                                    if ( model.attributes.shipmentType == Data.ShipmentsPrototype.at(key).id ){
                                        shipment.add(Data.ShipmentsPrototype.at(key));
                                    }
                                });
                                var template = _.template(viewShipmentTypes);
                                return template({shipmentsTypes: shipment.toJSON()});
                            }
                        })

                    },

                    {
                        name: "buyer.name",
                        label: "Покупатель",
                        cell: "string",
                        editable: false,
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.buyer.name;
                            }
                        })

                    },

                    {
                        name: "itemCount",
                        label: "Товаров",
                        editable: false,
                        cell: 'integer'
                    },

                    {
                        name: "itemPrice",
                        label: "Сумма покупок",
                        editable: false,
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        })

                    },

                    {
                        name: "shipmentPrice",
                        label: "Сумма доставки",
                        editable: false,
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        })

                    },

                    {
                        name: "totalPrice",
                        label: "Сумма к оплате",
                        editable: false,
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        })

                    },

                    {
                        name: 'state',
                        label: 'Статус',
                        editable: false,
                        sortable: false,
                        cell: "html",
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                var stateTrader = Data.StateTrader.findWhere({state: rawValue});
                                var template = new StateChange.Group({model: stateTrader, collection: Data.StateTrader,  selectedId: model.get('id'), execute: 'trader:orders:ordergroups:fetch', urlRoot: 'ordergroup'});
                                template.render();
                                return template.el;
                            }
                        })
                    },

                    {
                        name: "comment",
                        label: "Комментарий",
                        editable: false,
                        cell: 'htmlcenter',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                var tmpl = _.template(viewComment);
                                if ( rawValue == '' ) return;
                                return tmpl({comment: rawValue});
                            }
                        })

                    }
                ],
                _GridVent: Backgrid.Row.extend({
                    events: {
                        "click .btn--edit": "_edit"
                    },
                    _edit: function (e) {
                        var groupId = this.model.attributes.id;
                        require(['bundle/trader/ordergroup'], function(OrderGroup){
                            OrderGroup.start({id: groupId});
                        });
                        return false;
                    }
                }),
                initialize: function(){
                    var self = this;

                    this.collection = new Data.Ordergroup.PageableCollection();

                    this.collection.fetch({reset: true}).done(function(collection){
                        console.log(collection);

                        self._Grid = new Backgrid.Grid({
                            className: "table table-hover",
                            columns : self._Columns,
                            collection : self.collection,
                            emptyText: "Нет данных для отображения",
                            row: self._GridVent
                        });

                        self.list.show( self._Grid );

                        var pagination = new App.Pagination({collection: self.collection});
                        self.pagination.show( pagination );

                        var BulkActionsTrader = Data.StateTrader.where({bulkActions: true});

                        self.bulkActions.show( new self.bulkActionsView({collection: new Backbone.Collection(BulkActionsTrader), Grid: self._Grid}) );

                        self.setTooltip();
                        self.collection.on('sync', function(){
                            self.setTooltip();
                        });
                    });

                    App.Wreqr.setHandler("trader:orders:ordergroups:fetch", function () {
                        self.collection.fetch({reset: true});
                    });
                },
                bulkActionsView: BulkActions.View.extend({
                    onChildviewDoSelect: function(child, model){
                        var selectedModels = this.options.Grid.getSelectedModels();
                        this.bulkActions({execute: 'trader:orders:ordergroups:fetch', selectedModels: selectedModels, urlRoot: 'ordergroup', model: model.model, params: {id: 'state', cmd: model.model.get('state')}});
                        return false;
                    }
                }),
                setTooltip: function(){
                    App.tooltip();
                    App.tooltip('.sortable a', 'top', 'Сортировка');
                    App.tooltip('.btn--tooltip', 'top', 'Открыть');
                }
            });

        });
    });

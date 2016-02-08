define([
        "app",
        "text!bundle/trader/view/order/current.html",
        "text!view/product-link.html",
        "text!view/button-state.html",
        "text!view/button-state-change.html",
        'common/state-change',
        'common/bulk-actions',
        'moment',
        "model/order",
        "model/state",
        "backgrid.select"
    ],
    function (
        App,
        View,
        viewProductLink,
        viewBtnState,
        viewBtnStateChange,
        StateChange,
        BulkActions,
        moment,
        Data
    ) {

        return App.module("Trader.Orders.Current", function (Current, App, Backbone, Marionette, $, _) {

            this.View = Marionette.LayoutView.extend({
                Grid: null,
                columns: [
                    {
                        name: "",
                        cell: "select-row",
                        headerCell: "select-all"
                    },

                    {
                        name: "name",
                        label: "№ покупки",
                        editable: false,
                        cell: 'integer',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return parseInt(rawValue);
                            }
                        })

                    },

                    {
                        name: "creationTime",
                        label: "Дата покупки",
                        editable: false,
                        cell: 'htmlcenter',
                        direction: "descending",
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<span data-toggle="tooltip" data-original-title="'+moment(rawValue).format('DD.MM.YY HH:mm')+'" data-placement="top"  id="creationTime'+model.get('id')+'">'+moment(rawValue).format('DD.MM.YY')+'</span>';
                            }
                        })

                    },

                    {
                        name: "group.name",
                        label: "№ заказа",
                        editable: false,
                        cell: 'htmlright',
                        sortable: true,

                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<a data-id="'+ model.attributes.group.id +'" class="btn--tooltip btn--orders btn--edit" href="#trader/orders/current?ordergroup='+ model.attributes.group.id +'">'+ model.attributes.group.name +'</a>';
                            }
                        })

                    },

                    {
                        name: "group.date",
                        label: "Дата доставки",
                        editable: false,
                        cell: 'date',
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.group.date;
                            }
                        })

                    },

                    /*{
                     name: "product.barCode",
                     label: "Штрихкод",
                     editable: false,
                     formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                     fromRaw: function (rawValue, model) {
                     return '---';
                     }
                     })

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
                        editable: false,
                        cell: 'integer'
                    },

                    /*{
                     name: "creationTime",
                     label: "Оплачено бонусами",
                     editable: false,
                     cell: 'date',
                     direction: "descending"

                     },*/

                    {
                        name: "linePrice",
                        label: "Стоимость",
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

                    /*{
                     name: "creationTime",
                     label: "Сумма к оплате",
                     editable: false,
                     cell: 'date',
                     direction: "descending"

                     },*/

                    {
                        name: 'state',
                        label: 'Статус',
                        editable: false,
                        sortable: false,
                        cell: "html",
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                var stateTrader = Data.StateTrader.findWhere({state: rawValue});
                                var template = new StateChange.View({ model: stateTrader, collection: Data.StateTrader,  selectedId: model.get('id'), execute: 'trader:orders:current:fetch', urlRoot: 'order'});
                                template.render();
                                return template.el;
                            }
                        })
                    },

                    {
                        name: "buyer.name",
                        label: "Покупатель",
                        cell: "html",
                        editable: false,
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return model.attributes.buyer.name;
                            }
                        })

                    }


                ],
                backGridVent: Backgrid.Row.extend({
                    events: {
                        "click .btn--edit": "_edit"
                    },
                    _edit: function (e) {
                        var groupId = this.model.attributes.group.id;
                        require(['bundle/trader/ordergroup'], function(OrderGroup){
                            OrderGroup.start({id: groupId});
                        });
                        return false;
                    }
                }),
                template: _.template(View),
                regions: {
                    list: "#list",
                    pagination: "#pagination",
                    bulkActions: "#region-bulk-actions"
                },
                events: {
                    'click #vent-orders-fetch': function(){
                        this.collection.fetch({reset: true});
                    }
                },
                initialize: function(){
                    var self = this;

                    this.collection = new Data.Orders();
                    this.collection.fetch({reset: true}).done(function(){
                        console.log(self.collection);
                        self.Grid = new Backgrid.Grid({
                            className: "table table-hover",
                            columns : self.columns,
                            collection : self.collection,
                            emptyText: "Заказов не было",
                            row: self.backGridVent
                        });

                        self.list.show( self.Grid );
                        var pagination = new App.Pagination({collection: self.collection});
                        self.pagination.show( pagination );

                        var BulkActionsTrader = Data.StateTrader.where({bulkActions: true});

                        self.bulkActions.show( new self.bulkActionsView({collection: new Backbone.Collection(BulkActionsTrader), Grid: self.Grid}) );

                        self.setTooltip();
                        self.listenTo(self.collection, "backgrid:sort", function(){
                            self.setTooltip();
                        });

                        self.listenTo(self.collection, "sync", function(){
                            self.setTooltip();
                        });
                    });

                    App.Wreqr.setHandler("trader:orders:current:fetch", function () {
                        self.collection.fetch({reset: true});
                    });
                },
                setTooltip: function(){

                    App.tooltip('.sortable a', 'top', 'Сортировка');
                    App.tooltip('.btn--tooltip', 'top', 'Открыть');
                    App.tooltip();
                },
                bulkActionsView: BulkActions.View.extend({
                    onChildviewDoSelect: function(child, model){
                        var selectedModels = this.options.Grid.getSelectedModels();
                        this.bulkActions({execute: 'trader:orders:current:fetch', selectedModels: selectedModels, urlRoot: 'order', model: model.model, params: {id: 'state', cmd: model.model.get('state')}});
                        return false;
                    }
                })

            });

            this.onStart = function () {
                console.log("Trader.Orders.Current >>> view start");
            };
            this.onStop = function () {
                console.log("Trader.Orders.Current <<< view stop");
            };

        });
    });
define([
        "app",
        "text!bundle/trader/view/order/history.html",
        "text!view/product-link.html",
        "text!view/button-state.html",
        "model/order",
        "model/state"
    ],
    function(
        App,
        buyerHistoryOrdersListTpl,
        viewProductLink,
        viewBtnState,
        Data
    ) {

        return App.module("Buyer.Orders.History", function(History, App, Backbone, Marionette, $, _) {
            this.startWithParent = false;

            this.onStart = function(options){
                console.log('Buyer.Orders.History >>> Start');
            };

            this.onStop = function(options){
                console.log('Buyer.Orders.History <<< Stop');
            };

            this.View = Marionette.LayoutView.extend({
                Grid: null,
                columns: [
                    {
                        name: "group.name",
                        label: "№ доставки",
                        editable: false,
                        cell: 'html',
                        sortable: true,

                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<a data-id="'+ model.attributes.group.id +'" class="btn-link btn--tooltip btn--orders btn--edit" href="#buyer/orders/current?ordergroup='+ model.attributes.group.id +'">'+ model.attributes.group.name +'</a>';
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

                    {
                        name: "name",
                        label: "№ заказа",
                        editable: false,
                        cell: 'string'

                    },

                    {
                        name: "creationTime",
                        label: "Дата заказа",
                        editable: false,
                        cell: 'string',
                        direction: "descending"

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
                        cell: 'string'
                    },

                    /*{
                     name: "creationTime",
                     label: "Оплачено бонусами",
                     editable: false,
                     cell: 'date',
                     direction: "descending"

                     },*/

                    {
                        name: "totalPrice",
                        label: "Стоимость",
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
                        name: "shop.name",
                        label: "Магазин",
                        cell: "html",
                        editable: false,
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<a class="btn-link" title="Открыть '+ model.attributes.shop.name +'" target="_blank" href="#prodlist/-/' +model.attributes.shop.id+ '/-">'+ model.attributes.shop.name +'</a>';
                            }
                        })

                    },

                    {
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
                    }


                ],
                backGridVent: Backgrid.Row.extend({
                    events: {
                        "click .btn--edit": "_edit"
                    },
                    _edit: function (e) {
                        var groupId = this.model.attributes.group.id;
                        require(['bundle/buyer/ordergroup'], function(OrderGroup){
                            OrderGroup.start({id: groupId});
                        });
                        return false;
                    }
                }),
                template: _.template(buyerHistoryOrdersListTpl),
                regions: {
                    list: "#list",
                    pagination: "#pagination"
                },
                events: {
                    'click #vent-orders-fetch': function(){
                        this.collection.fetch({reset: true});
                    },
                    'click #REJECTED_BY_BUYER': '_bulk_reject'
                },
                _bulk_reject: function(e){
                    var collection = this.collection;
                    var selectedModels = this.Grid.getSelectedModels();
                    console.log(selectedModels);
                    var order = Backbone.Model.extend({
                        urlRoot: 'rest/v0/order'
                    });
                    _.each(selectedModels, function(model){
                        var m = new order({id: model.get('id')});
                        m.save({state: 'REJECTED_BY_BUYER'},{
                            patch: true,
                            success: function(){
                                var mod = collection.get(model.get('id'));
                                mod.set('state', 'REJECTED_BY_BUYER');
                            }
                        });
                    });
                    return false;
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
                        self.setTooltip();
                        self.listenTo(self.collection, "backgrid:sort", function(){
                            self.setTooltip();
                        });

                        self.listenTo(self.collection, "sync", function(){
                            self.setTooltip();
                        });
                    });

                    App.Wreqr.setHandler("orders-current:fetch", function () {
                        self.collection.fetch({reset: true});
                    });
                },
                setTooltip: function(){

                    App.tooltip('.sortable a', 'top', 'Сортировка');
                    App.tooltip('.btn--tooltip', 'top', 'Открыть');
                    App.tooltip();
                }

            });
        });

    });
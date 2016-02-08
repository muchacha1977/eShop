/**
 * Created by GOODPROFY on 25.06.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/ordergroup/ordergroup.html',
    "text!view/product-link.html",
    'common/state-change',
    'common/bulk-actions',
    'moment',
    'model/state',
    'model/shipments',
    'model/ordergroup'
], function(
    App,
    viewOrderGroup,
    viewProductLink,
    StateChange,
    BulkActions,
    moment,
    Data
){
    return App.module("Buyer.Ordergroup", function (Ordergroup, App, Backbone, Marionette, $, _) {
        'use strict';
        this.startWithParent = false;

        var Model = null;

        this.onStart = function(options){
            console.log('Buyer.Ordergroup >>> Start');
            var self = this;
            Model = Data.Ordergroup.Model;
            Model = new Model({id: options.id});

            Model.fetch().done(function(model){

                var shipments = new Data.Shipments({id: model.shop.id});
                shipments.fetch({reset:true}).done(function(){
                    shipments = shipments.findWhere({type: model.shipmentType});
                    Model.set('shipmentDescr', shipments.get('description'));

                    App.dialogRegion.show(new Ordergroup.Dialog({model: Model}));
                });

            });

            $('.modal').on('hidden.bs.modal', function (e) {
                App.Wreqr.execute("buyer:orders:current:fetch");
                App.Wreqr.execute("buyer:orders:ordergroups:fetch");
                self.stop();
            });
        };

        this.onStop = function(options){
            console.log('Buyer.Ordergroup <<< Stop');
            Ordergroup.Model = null;
            App.Wreqr.removeHandler("buyer:orders:current:fetch");
            App.Wreqr.removeHandler("buyer:orders:ordergroups:fetch");
            App.Wreqr.removeHandler("buyer:orders:ordergroup:fetch");
        };

        this.Dialog = Marionette.LayoutView.extend({
            template: _.template(viewOrderGroup),
            regions: {
                list: '#buyer-orders-list',
                bulkActions: "#region-bulk-actions",
                regionState: '#region-state'
            },
            events: {
                'click #callback': '_callback',
                'click #vent-ordergroup-shipped': '_shipped'
            },
            _shipped: function(){
                var self = this;
                var order = Backbone.Model.extend({
                    urlRoot: 'rest/v0/ordergroup'
                });
                var o = new order({id: 'state'});

                App.Dialog.confirm({
                    size: 'small',
                    message: 'Подтвердить получение заказа?',
                    callback: function(result){
                        if ( result ){
                            o.save(_.extend({cmd: 'SHIP'}, {items: [self.model.get('id')]}), {
                                success: function(response){
                                    Model.fetch().done(function(){
                                        self.render();
                                    });
                                },
                                error: function(response){
                                    console.log(response);
                                }
                            });
                        }

                    }
                });
            },
            _callback: function(){

                App.Dialog.alert({
                    size: 'small',
                    message: "Функционал в разработке"
                });
            },
            Grid: null,
            initialize: function(){
                var self = this;
                App.Wreqr.setHandler("buyer:orders:ordergroup:fetch", function () {
                    Model.fetch().done(function(model){
                        self.render();
                    });
                });
            },
            onRender: function(){
                var self = this;

                var columns = [
                    {
                        name: "",
                        cell: "select-row",
                        headerCell: "select-all"
                    },

                    {
                        name: "name",
                        label: "№",
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
                        label: "Создан",
                        editable: false,
                        cell: 'htmlcenter',
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<span data-toggle="tooltip" data-original-title="'+moment(rawValue).format('DD.MM.YY HH:mm')+'" data-placement="top"  id="creationTime'+model.get('id')+'">'+moment(rawValue).format('DD.MM.YY')+'</span>';
                            }
                        })

                    },

                    /*{
                        name: "name",
                        label: "Штрихкод",
                        editable: false,
                        cell: 'string'

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
                        label: "Стоимость",
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
                        cell: "html",
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                var stateBuyer = Data.StateBuyer.findWhere({state: rawValue});
                                var template = new StateChange.View({ model: stateBuyer, collection: Data.StateBuyer,  selectedId: model.get('id'), execute: 'buyer:orders:ordergroup:fetch', urlRoot: 'order'});
                                template.render();
                                return template.el;
                            }
                        })
                    }
                ];

                this.collection = new Backbone.Collection(this.model.get('orders'));

                this.Grid = new Backgrid.Grid({
                    className: "table table-hover",
                    columns : columns,
                    collection : this.collection,
                    emptyText: "Нет данных для отображения"
                });

                this.list.show( this.Grid );
                this.listenTo(this.collection, "backgrid:sort", function(){
                    self.setTooltip();
                });

                var BulkActionsTrader = Data.StateBuyer.where({bulkActions: true});

                this.bulkActions.show( new this.bulkActionsView({collection: new Backbone.Collection(BulkActionsTrader), Grid: this.Grid}) );

                var stateBuyer = Data.StateBuyer.findWhere({state: Model.get('state')});
                var template = new StateChange.Group({tmpl: true, model: stateBuyer, collection: Data.StateBuyer,  selectedId:  Model.get('id'), execute: 'buyer:orders:ordergroup:fetch', urlRoot: 'ordergroup'});

                self.regionState.show(template);

                this.setTooltip();
            },
            setTooltip: function(){
                App.tooltip('.sortable a', 'top', 'Сортировка');
                App.tooltip('.btn--tooltip', 'top', 'Открыть');
                App.tooltip();
            },
            bulkActionsView: BulkActions.View.extend({
                onChildviewDoSelect: function(child, model){
                    var selectedModels = this.options.Grid.getSelectedModels();
                    this.bulkActions({execute: 'buyer:orders:ordergroup:fetch', selectedModels: selectedModels, urlRoot: 'order', model: model.model, params: {id: 'state', cmd: model.model.get('state')}});
                    return false;
                }
            })
        });




    });
});
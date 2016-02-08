/**
 * Created by GOODPROFY on 25.06.2015.
 */
define([
    'app',
    'text!bundle/trader/view/ordergroup/ordergroup.html',
    "text!view/product-link.html",
    'common/state-change',
    'common/bulk-actions',
    'moment',
    'model/state',
    'model/shipments',
    'model/ordergroup',
    'datetimepicker'
], function(
    App,
    viewOrderGroup,
    viewProductLink,
    StateChange,
    BulkActions,
    moment,
    Data
){
    return App.module("Trader.Ordergroup", function (Ordergroup, App, Backbone, Marionette, $, _) {
        'use strict';
        this.startWithParent = false;

        var Model = null;

        this.onStart = function(options){
            console.log('Trader.Ordergroup >>> Start');
            var self = this;

            Model = new Data.Ordergroup.Model({id: options.id});

            Model.fetch().done(function(model){

                var shipments = new Data.Shipments({id: model.shop.id});
                shipments.fetch({reset:true}).done(function(){
                    var shipmentsOne = shipments.findWhere({type: model.shipmentType});
                    Model.set('shipmentDescr', shipmentsOne.get('description'));
                    Model.set('shipments', shipments.toJSON());
                    console.log(Model.toJSON());
                    App.dialogRegion.show(new Ordergroup.Dialog({model: Model}));
                });

            });

            $('.modal').on('hidden.bs.modal', function (e) {
                App.Wreqr.execute("trader:orders:current:fetch");
                App.Wreqr.execute("trader:orders:ordergroups:fetch");
                self.stop();
            });
        };

        this.onStop = function(options){
            console.log('Trader.Ordergroup <<< Stop');
            Ordergroup.Model = null;
            App.Wreqr.removeHandler("trader:orders:current:fetch");
            App.Wreqr.removeHandler("trader:orders:ordergroups:fetch");
            this.stopListening();
        };

        this.Dialog = Marionette.LayoutView.extend({
            template: _.template(viewOrderGroup),
            regions: {
                list: '#list',
                bulkActions: "#region-bulk-actions",
                regionState: '#region-state'
            },
            initialize: function(){
                var self = this;
                this.model.on('change', function(){
                    self.$('#vent-save').show();
                });
                App.Wreqr.setHandler("trader:orders:ordergroup:fetch", function () {
                    Model.fetch().done(function(model){
                       self.render();
                    });
                });
                /*
                $('.modal').one('hidden.bs.modal', function (e) {
                    if (self.model.hasChanged()) {
                        App.Dialog.dialog({
                            message: "Вы не сохранили изменения в доставке заказа.",
                            title: "Внимание!",
                            onEscape: function() {},
                            show: true,
                            backdrop: true,
                            closeButton: false,
                            animate: true,
                            className: "",
                            buttons: {
                                success: {
                                    label: "Сохранить",
                                    className: "btn-success",
                                    callback: function() {
                                        self.model.save();
                                    }
                                },
                                "Не сохранять": {
                                    className: "btn-danger",
                                    callback: function() {

                                    }
                                }
                            }
                        });
                    }
                });
                */
            },
            events: {
                'click .ordergroup-shipmentType-menuitem': '_onShipmentType',
                'click #vent-save': '_onSave',
                'keyup #shipmentDateInp': '_onShipmentDate',
                'change #shipmentDateInp': '_onShipmentDate'
            },
            _onShipmentDate: function(e){
                var selectedDate = this.$('#shipmentDateInp').val();
                this.model.set({shipmentDate: selectedDate});
            },
            _onSave: function(){
                var self = this;
                console.log(this.model.toJSON());


                if ( Data.getAccessEdit(Data.StateTrader, this.model.get('state')) ){
                    this.model.save({
                        shipmentDate: this.model.get('shipmentDate'),
                        shipmentType: this.model.get('shipmentType'),
                        shipmentPrice: this.model.get('shipmentPrice'),
                        shipmentAddress: this.model.get('shipmentAddress')
                    },{patch: true, success: function(){
                        self.$('#vent-save').hide();
                        App.alert({ message: 'Заказ обновлен' });

                    }});
                }else{
                    App.alert({ message: 'Статус заказа не позволяет обновить заказ.' });
                }
            },
            _onShipmentType: function(e){
                var el = e.target || e.srcElement;
                var shipmentType = $(el).data('shipmentsType');
                var shipmentDays = $(el).data('shipmentsDays');
                var shipmentPrice = $(el).data('shipmentsPrice');
                shipmentDays = moment().add(shipmentDays, 'days').format("DD.MM.YY");
                this.model.set({shipmentType: shipmentType, shipmentPrice: shipmentPrice, shipmentDate: shipmentDays});
                this._changeTotalPrice();
                return false;
            },
            _onShipmentAddress: function(){
                var shipmentAddress = this.$('#shipmentAddress').val();
                this.model.set({shipmentAddress: shipmentAddress});
            },
            _onShipmentPrice: function(){
                var shipmentPrice = this.$('#shipmentPrice').val();
                this.model.set({shipmentPrice: shipmentPrice});
                this._changeTotalPrice();
            },
            _changeTotalPrice: function(){
                this.model.set('totalPrice', Number(this.model.get('shipmentPrice'))+Number(this.model.get('itemPrice')));
                this.render();
            },
            Grid: null,
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
                        direction: "descending",
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
                                var stateTrader = Data.StateTrader.findWhere({state: rawValue});
                                var template = new StateChange.View({ model: stateTrader, collection: Data.StateTrader,  selectedId: model.get('id'), execute: 'trader:orders:ordergroup:fetch', urlRoot: 'order'});
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
                    self._setTooltip();
                });
                this.$('#shipmentDate').datetimepicker({
                    format: 'DD.MM.YY',
                    defaultDate: moment(self.model.get('shipmentDate'), "DD.MM.YYYY")
                });
                this.$('#shipmentDate').on("dp.change",function (e) {
                    self._onShipmentDate(e);
                });
                this.$('#shipmentDate').mask("99.99.99");

                this.$("#shipmentAddress").bind('input propertychange', function(){
                    self._onShipmentAddress();
                });

                this.$("#shipmentPrice").bind('change', function(){
                    self._onShipmentPrice();
                });
                var BulkActionsTrader = Data.StateTrader.where({bulkActions: true});

                self.bulkActions.show( new self.bulkActionsView({collection: new Backbone.Collection(BulkActionsTrader), Grid: self.Grid}) );

                var stateTrader = Data.StateTrader.findWhere({state: Model.get('state')});
                var template = new StateChange.Group({tmpl: true, model: stateTrader, collection: Data.StateTrader,  selectedId:  Model.get('id'), execute: 'trader:orders:ordergroup:fetch', urlRoot: 'ordergroup'});

                self.regionState.show(template);

                this._setTooltip();
            },
            onShow: function(){
                this.$('#vent-save').hide();
            },
            _setTooltip: function(){
                App.tooltip('.sortable a', 'top', 'Сортировка');
                App.tooltip('.btn--tooltip', 'top', 'Открыть');
                App.tooltip();
            },
            bulkActionsView: BulkActions.View.extend({
                onChildviewDoSelect: function(child, model){
                    var selectedModels = this.options.Grid.getSelectedModels();
                    this.bulkActions({execute: 'trader:orders:ordergroup:fetch', selectedModels: selectedModels, urlRoot: 'order', model: model.model, params: {id: 'state', cmd: model.model.get('state')}});
                    return false;
                }
            })
        });




    });
});
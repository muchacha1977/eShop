define([
        "app",
        "text!bundle/buyer/view/ordergroups/ordergroups.html",
        "text!view/button-state.html",
        "text!view/shipment-types.html",
        "text!view/comment.html",
        'common/state-change',
        'common/bulk-actions',
        "model/state",

        'model/shipments',
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

    return App.module("Buyer.Orders.Group", function (Group, App, Backbone, Marionette, $, _) {

        this.onStart = function () {
            console.log("Buyer.Orders.Group >>> start");
        };

        this.onStop = function () {
            console.log("Buyer.Orders.Group <<< stop");
        };

        this.ContainerView = Marionette.LayoutView.extend({
            template: _.template(viewOrdersGroups),
            regions: {
                list: "#buyer-ordergroups-list",
                pagination: "#buyer-ordergroups-pagination",
                bulkActions: "#region-bulk-actions"
            },
            events: {
                'click #vent-refresh': function(){
                    this.collection.fetch({reset:true});
                },
                'click #vent-callback': '_callback',
                'click #vent-export': '_export'
            },
            _export: function(){
                var self = this;
                //self.$('#buyer-ordergroups-list').prev().remove();
                require(['bundle/export/export'], function(Export){
                    var _export = new Export.View();
                    _export.render();
                    self.$('#buyer-ordergroups-list').before(_export.$el);
                });
            },
            _callback: function(){
                App.Dialog.alert({
                    size: 'small',
                    message: "Функционал в разработке",
                });
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
                            return '<a data-id="'+ model.attributes.id +'" class="btn--tooltip btn--orders btn--edit" href="#buyer/orders/ordergroups?ordergroup='+ model.attributes.id +'">'+ model.attributes.name +'</a>';
                        }
                    })

                },

                {
                    name: "shipmentDate",
                    label: "Дата",
                    editable: false,
                    cell: 'stringcenter',
                    direction: "descending"

                },

                {
                    name: "shipmentType",
                    label: "Тип",
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
                    name: "itemCount",
                    label: "Заказов",
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
                            var stateBuyer = Data.StateBuyer.findWhere({state: rawValue});
                            var template = new StateChange.Group({model: stateBuyer, collection: Data.StateBuyer,  selectedId: model.get('id'), execute: 'buyer:orders:ordergroups:fetch', urlRoot: 'ordergroup'});
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
                    require(['bundle/buyer/ordergroup'], function(OrderGroup){
                        OrderGroup.start({id: groupId});
                    });
                    return false;
                }
            }),
            initialize: function(){
                var self = this;
                var groups = App.PageableCollection.extend({
                    url: 'rest/v0/ordergroup' //TODO вынести
                });

                this.collection = new groups();

                this.collection.fetch({reset: true}).done(function(collection){
                    console.log(collection);

                    self._Grid = new Backgrid.Grid({
                        className: "table table-hover table-responsive",
                        columns : self._Columns,
                        collection : self.collection,
                        emptyText: "Нет данных для отображения",
                        row: self._GridVent
                    });

                    self.list.show( self._Grid );

                    var pagination = new App.Pagination({collection: self.collection});
                    self.pagination.show( pagination );

                    var BulkActionsTrader = Data.StateBuyer.where({bulkActions: true});

                    self.bulkActions.show( new self.bulkActionsView({collection: new Backbone.Collection(BulkActionsTrader), Grid: self._Grid}) );

                    self.setTooltip();
                    self.collection.on('sync', function(){
                        self.setTooltip();
                    });
                });

                App.Wreqr.setHandler("buyer:orders:ordergroups:fetch", function () {
                    self.collection.fetch({reset: true});
                });
            },
            setTooltip: function(){
                App.tooltip();
                App.tooltip('.sortable a', 'top', 'Сортировка');
                App.tooltip('.btn--tooltip', 'top', 'Открыть');


            },
            bulkActionsView: BulkActions.View.extend({
                onChildviewDoSelect: function(child, model){
                    var selectedModels = this.options.Grid.getSelectedModels();
                    this.bulkActions({execute: 'buyer:orders:ordergroups:fetch', selectedModels: selectedModels, urlRoot: 'ordergroup', model: model.model, params: {id: 'state', cmd: model.model.get('state')}});
                    return false;
                }
            })
        });

    });
});
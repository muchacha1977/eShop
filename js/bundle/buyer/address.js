define([
        "app",
        "text!bundle/buyer/view/address/address.html",
        "text!bundle/buyer/view/address/modal.html",
        "text!bundle/buyer/view/address/modal-item.html",
        "text!view/region-link.html",
        "model/regions",
        "model/address",
        'backgrid.select'

    ],
    function (
        App,
        viewAddress,
        buyerShipingModalTpl,
        buyerShipingModalItemTpl,
        viewRegionLink,
        DataRegions,
        Data
    ) {

        return App.module("Buyer.Address", function (Address, App, Backbone, Marionette, $, _) {

            var columns = [
                {
                    name: "",
                    cell: "select-row",
                    headerCell: "select-all"
                },
                {
                    name: "name",
                    label: "Название",
                    cell: "html",
                    editable: false,
                    sortable: true,
                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                        fromRaw: function (rawValue, model) {
                            return '<a data-id="'+ model.get('id') +'" class="btn-link btn--tooltip btn--address btn--edit" href="#">'+ rawValue +'</a>';
                        }
                    })
                },

                {
                    name: 'region',
                    label: 'Регион',
                    cell: "html",
                    editable: false,
                    sortable: true,
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
                    name: "data",
                    label: "Адрес",
                    editable: false,
                    sortable: true,
                    cell: 'string'
                },

                {
                    name: 'deflt',
                    label: 'По умолчанию',
                    editable: false,
                    sortable: true,
                    direction: 'descending',
                    cell: "html",
                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                        fromRaw: function (rawValue, model) {
                            if ( rawValue ){
                                return '<button type="button" data-toggle="tooltip" data-placement="top" title="Адрес по умолчанию" class="btn btn-success "><span class="glyphicon glyphicon-star"></span></button>';
                            }else{
                                return '<button data-toggle="tooltip" data-placement="top" title="Изменить на адрес по умолчанию" type="button" class="btn btn-default btn--setDflt"><span class="glyphicon glyphicon-star-empty"></span></button>';
                            }
                        }
                    })
                }

            ];

            var backGridVent = Backgrid.Row.extend({
                events: {
                    "click .btn--edit": "edit",
                    "click .btn--setDflt": "setDeflt"
                },
                edit: function (e) {
                    App.dialogRegion.show(new Address.ContainerViewModal({id: this.model.get('id')}));
                    return false;
                },
                setDeflt: function(){
                    var collection  = this.model.collection;
                    var find = collection.findWhere({deflt: true});
                    if ( find )
                        find.set('deflt', false);
                    find = collection.get(this.model.get('id'));
                    find.set('deflt', true);
                    Data.Address.save(collection.toJSON());
                }
            });

            var Grid = null;

            Address.ContainerView = Marionette.LayoutView.extend({
                template: _.template(viewAddress),
                regions: {
                    list: '#buyer-address-list',
                    actions: '#actions'
                },
                events: {
                    'click #btn-address-add': function(){
                        App.dialogRegion.show(new Address.ContainerViewModal());
                    },
                    'click #btn-address-remove': 'removeSelect'
                },
                removeSelect: function(){
                    var selectedModels = Grid.getSelectedModels();
                    this.collection.remove(selectedModels);
                    if ( typeof this.collection.findWhere({deflt: true}) === 'undefined'  ){
                        var model = this.collection.at(0);
                        model.set('deflt', true);
                    }

                    Data.Address.save(this.collection.toJSON());

                },
                initialize: function(){
                    var self = this;
                    this.collection = Data.Address;
                    $.when(
                        DataRegions.Collection.fetch({reset:true}),
                        this.collection.fetch({reset: true})
                    ).done(function(){
                            Grid = new Backgrid.Grid({
                                className: "table table-hover",
                                columns : columns,
                                collection : self.collection,
                                emptyText: "Добавьте адрес.",
                                row: backGridVent
                            });

                            self.list.show( Grid );

                            self.setTooltip();
                            self.listenTo(self.collection, "backgrid:sort", function(){
                                self.setTooltip();
                            });
                        });
                },
                setTooltip: function(){
                    App.tooltip();
                    App.tooltip('.sortable a', 'top', 'Сортировка');
                    App.tooltip('.btn--tooltip', 'top', 'Открыть редактирование');
                }
            });

            // модальная форма контейнера
            var ModalItem = Marionette.ItemView.extend({
                template: _.template(buyerShipingModalItemTpl)
            });

            Address.ContainerViewModal = Marionette.LayoutView.extend({
                template: _.template(buyerShipingModalTpl),
                regions: {
                    buyerShipping: '#buyer-shipping'
                },
                events: {
                    'click .yes': 'yes',
                    'click .no': 'no',
                    'click .close': 'onClose'
                },
                no: function (e) {
                    var self = this;
                    require(['serializejson'], function () {
                        var address = self.$('form').serializeJSON();
                        if (self.$('form #deflt').prop('checked') == true) {
                            self.$('form #deflt').val(true);
                            address.deflt = true;
                            var find = Data.Address.findWhere({deflt: true});
                            if ( find )
                                find.set('deflt', false);
                        } else {
                            self.$('form #deflt').val(false);
                            address.deflt = false;
                        }



                        find = Data.Address.findWhere({id: address.id});
                        if (typeof find !== 'undefined') {
                            find.set(address);
                            find.unset('regionData');
                        } else {
                            Data.Address.add(address);

                        }

                        $.ajax({
                            url: Data.Address.url,
                            data: JSON.stringify(Data.Address.toJSON()),
                            headers: {"Content-Type": "application/json"},
                            dataType: 'json',
                            type: 'POST',
                            success: function () {
                                App.Wreqr.execute("modal:no");
                                self.close();
                            }
                        });
                    });
                },
                close: function () {
                    $('.modal').modal('hide');
                },

                onClose: function () {
                    App.Wreqr.execute("modal:close");
                },
                initialize: function (options) {
                    options || (options = {});
                    var self = this;
                    Data.Address.fetch().done(function (model) {
                        var regionData = DataRegions.Collection;
                        regionData.fetch().done(function () {
                            if (typeof options.id !== 'undefined') {
                                Data.Address.get(options.id).set({regionData: regionData.toJSON()});
                                console.log(Data.Address.get(options.id));
                                self.buyerShipping.show(new ModalItem({model: Data.Address.get(options.id)}));
                            } else {
                                var address = new Backbone.Model({
                                    data: "",
                                    deflt: true,
                                    name: "",
                                    region: "",
                                    id: "",
                                    regionData: regionData.toJSON()
                                });

                                self.buyerShipping.show(new ModalItem({model: address}));
                            }
                        });

                    });
                }
            });

            Address.onStart = function () {
                console.log("buyer Address view started");
            };

            Address.onStop = function () {
                Address.stopListening();
                console.log("buyer Address view stopped");
            };

        });
    });
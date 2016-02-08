/**
 * Выводим одну заявку
 * Created by GOODPROFY on 17.06.2015.
 */
define([
    'app',
    "text!bundle/buyer/view/bid/bid.html",
    "text!bundle/buyer/view/bid/closed.html",
    "text!view/shipment-types.html",
    "moment",
    "text!view/button-state.html",
    "model/regions",
    'model/shipments',

    "model/state",
    "model/bid",
    'backgrid',
    "lib/bootstrap-datetimepicker"
], function(
    App,
    viewBid,
    viewClosed,
    viewShipmentTypes,
    moment,
    viewBtnState,
    DataRegions,
    Data
){
    return App.module("Buyer.Bids.Bid", function(Bid, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;
        this.onStart = function (options) {
            console.log("Buyer.Bids.Bid >>> view started");
            var bid = new Data.Bid.Model({id: options.id});
            var subTab = options.subTab;
            bid.fetch().done(function(){
                App.dialogRegion.show(new Dialog({model: bid, subTab: subTab}));
            });
        };

        this.onStop = function () {
            console.log("Buyer.Bids.Bid <<< view stopped");
        };

        var Dialog = Marionette.LayoutView.extend({
            template: _.template(viewBid),
            events: {
                'click #modal-btn-yes': 'saveBid',
                'click #modal-btn-no': 'closeBid',
                'change #shipmentsData': 'changeShipmentsData',
                'change #regionData': 'changeRegionData',
                'click #modal-btn-asks': 'asksShow',
                'click #modal-btn-new': 'newBid'
            },
            regions:{
                bodyRegion: '.modal-body',
                footerRegion: '.modal-footer'
            },

            newBid: function(){
                var self = this;
                require(['bundle/bid/bid'], function (Bid) {
                    Bid.Start(self.model.attributes.product.id);
                });
            },
            closeBid: function(){
                this.model.set('state', 'CLOSED');
                this.model.save(this.model.toJSON(),{
                    success: function(){
                        require(["bundle/modal/modal"],
                            function(Modal) {
                                new Modal.View({text: "Вы закрыли заявку", _template: 'message'});
                            }
                        );
                    }
                });
            },
            changeRegionData: function(){
                this.model.set({region: this.$('#regionData').val()}, {silent: true});
                self.$('#modal-btn-yes').show();
            },
            changeShipmentsData: function(){
                var shipmentTypes = this.model.get('shipmentTypes');
                this.$('input#shipmentsData').each(function(i, el){
                    shipmentTypes[el.value] = el.checked;
                });
                self.$('#modal-btn-yes').show();
            },
            changePrice: function(){
                this.model.set('unitPrice', Number(this.$('#unitPrice').val()),{silent:true});
                this.$('#modal-btn-yes').show();
                this.changeTotalPrice();
                self.$('#modal-btn-yes').show();
            },
            changeQuantity: function(){
                this.model.set('quantity', Number(this.$('#quantity').val()),{silent:true});
                this.$('#modal-btn-yes').show();
                this.changeTotalPrice();
                self.$('#modal-btn-yes').show();
            },
            changeTotalPrice: function(){
                var m = this.model;
                var totalPrice = m.get('unitPrice')*m.get('quantity');
                m.set({totalPrice: totalPrice}, {silent:true});
                this.$('#totalPrice').val(totalPrice);
                return totalPrice;
            },
            saveBid: function(){
                var self = this;
                this.model.unset('shipmentsData');
                this.model.unset('regionData');
                console.log(this.model.toJSON());
                this.model.save(this.model.toJSON(),{
                    success: function(){
                        require(["bundle/modal/modal"],
                            function(Modal) {
                                new Modal.View({text: "Заявка успешно сохранена", _template: 'message'});
                            }
                        );
                    }
                });
            },
            initialize: function(options){
                if ( options.subTab == 'closed' ){
                    this.template = _.template(viewClosed);
                }
                var self = this;
                var bid = this.model;

                console.log(bid);
                var shipmentTypes = {
                    SHIPMENT_TYPE_1: false,
                    SHIPMENT_TYPE_2: false,
                    SHIPMENT_TYPE_3: false,
                    SHIPMENT_TYPE_4: false,
                    SHIPMENT_TYPE_5: false
                };


                var product = bid.get('product');
                product.barCode = App.barCode(bid.attributes.product.barCode);
                self.model.set({
                    _validUntil: moment(bid.get('validUntil')).format('DD.MM.YY HH:mm'),
                    _creationTime: moment(bid.get('creationTime')).format('DD.MM.YY HH:mm'),
                    _deliveryDate: moment(bid.get('deliveryDate')).format('DD.MM.YY HH:mm'),
                    regionData: null,
                    shipmentsData: null,
                    shipmentTypes: bid.get('shipmentTypes')? bid.get('shipmentTypes'): shipmentTypes,
                    totalPrice: self.changeTotalPrice()
                },{silent:true});

                DataRegions.Collection.fetch({reset:true}).done(function(){
                    bid.set({
                        regionData: DataRegions.Collection.toJSON(),
                        shipmentsData: Data.ShipmentsPrototype.toJSON()
                    },{silent:true});
                    self.render();
                });

                this.model.once('change', function(){
                    self.$('#modal-btn-yes').show();
                });
                $('.modal').one('hidden.bs.modal', function (e) {
                    self.destroy();
                    Bid.stop();
                    App.navigate(App.getPathFromUrl(), true);
                });
            },
            asksShow: function(){
                App.getDialogRegion().destroy();
                Bid.stop();
                App.navigate(App.getCurrentRoute()+'&asks=Y', true);
            },
            onShow: function(){
                this.$('#modal-btn-yes').hide();
            },
            onRender: function(){
                var self = this;
                this.$("#quantity").bind("change paste keyup", function() {
                    self.changeQuantity();
                });

                this.$("#unitPrice").bind("change paste keyup", function() {
                    self.changePrice();
                });
                this.$('#modal-btn-yes').hide();
                this.$('#validUntil').datetimepicker({
                    format: 'DD.MM.YY HH:mm'

                });

                this.$('#deliveryDate').datetimepicker({
                    format: 'DD.MM.YY HH:mm'
                });

                this.$('#validUntil').on('dp.change',function(){
                    self.model.set('validUntil', Number(moment(self.$('#validUntil').val(), "DD.MM.YY HH:mm").format('x')),{silent:true});
                    self.$('#modal-btn-yes').show();
                });

                this.$('#deliveryDate').on('dp.change',function(){
                    self.model.set('deliveryDate', Number(moment(self.$('#deliveryDate').val(), "DD.MM.YY HH:mm").format('x')),{silent:true});
                    self.$('#modal-btn-yes').show();
                });
            }
        });
    });
});
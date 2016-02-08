/**
 * Выводим один отклик
 * Created by GOODPROFY on 18.06.2015.
 */
define([
    'app',
    "text!bundle/buyer/view/ask/ask.html",
    'model/bid',
    'lib/jquery.serializejson'
], function(
    App,
    viewAsk,
    Data
){
    return App.module("Buyer.Asks.Ask", function (Ask, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;

        this.onStart = function (options) {
            console.log(options);
            console.log("Buyer.Asks.Ask >>> view started");
            var ask = Backbone.Model.extend({
                url: 'rest/v0/bid/'+ options.bid +'/ask/'+ options.id
            });

            ask = new ask();

            var bid = new Data.Bid.Model({id: options.bid});

            $.when(ask.fetch(), bid.fetch()).done(function(){

                ask.set('bid', bid.toJSON());

                require(['model/address', 'model/shipments'], function(Data){
                    var shipments = new Data.Shipments({id: ask.attributes.shop.id});
                    $.when(
                        Data.Address.fetch({reset: true}),
                        shipments.fetch({reset: true})
                    ).done(function(){
                            ask.set('address', Data.Address.toJSON());
                            ask.set('shipments', shipments.toJSON());
                            App.getDialogRegion().destroy();
                            App.getDialogRegion().show(new Dialog({model: ask}));
                        });
                });
            });

            $('.modal').one('hidden.bs.modal', function (e) {
                Ask.stop();
                App.navigate(App.getPathFromUrl(), true);
            });
        };

        this.onStop = function () {
            console.log("Buyer.Asks.Ask <<< view stopped");
        };


        var Dialog = Marionette.ItemView.extend({
            template: _.template(viewAsk),
            events: {
                'click #modal-btn-back': 'backView',
                'click #modal-btn-order': 'done'
            },

            initialize: function(){

            },

            done: function(){

                var data = this.$('form').serializeJSON();

                _.extend(data,{
                    items: [
                        {
                            id: this.model.get('id'),
                            unitPrice: this.model.get('unitPrice'),
                            quantity: this.model.get('quantity')
                        }
                    ],
                    type: 'ASK'
                });

                var order = Backbone.Model.extend({
                    url: "rest/v0/ordergroup"
                });

                (new order()).save(data,{
                    dataType: "text",
                    success: function(model, response, options) {

                        require(["bundle/modal/modal"],
                            function (Modal) {
                                new Modal.View({text: "Заказ успешно оформлен. Продавец свяжется с Вами.", _template: "message", _static: false});
                            }
                        );
                    }
                });
            },
            backView: function(){
                App.navigate(App.getPathFromUrl()+'?bid='+this.model.attributes.bid.id+'&asks=Y', true);
                Ask.stop();
            }
        });
    });
});
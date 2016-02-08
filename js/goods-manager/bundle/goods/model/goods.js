define(["app", "bundle/common/collection/pageable-collection"], function(App, Pageable) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var GoodsInfo = Backbone.Model.extend({
            defaults: {
                categoryId: null,
                categoryName: '',
                totalCount: 0
            }
        });

        var Goods = Pageable.Collection.extend({

            url: function () {
                if (!this.id) {
                    throw new Error('Request without id!');
                }
                return "rest/v0/product?c=" + this.id;
            },

            initialize: function () {
                //_.bindAll(this, '_onSync');
                this.on('sync', this._onSync);
            },

            _onSync: function() {
                _.map(this.models, function(model){
                    model.set({
                        barCode: App.barCode(model.get('barCode'))
                    });
                }.bind(this));
            }
        });



        Data.Goods = new Goods();
        Data.GoodsInfo = new GoodsInfo();
    });
});
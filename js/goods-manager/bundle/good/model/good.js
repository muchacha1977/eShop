define(["app", "bundle/common/collection/pageable-collection"], function(App, Pageable) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var CurrentCategory = Backbone.Model.extend({
            defaults: {
                id: null,
                name: '',
                totalCount: 0,
                characteristics: []
            }
        });

        var Good = Backbone.Model.extend({

            defaults: {
                id: null,
                name: "",
                category_id: null,
                categoryName: '',
                media: ["unknown"],
                description: "",
                code: "",
                barCode: "",
                characteristics: []
            },

            url: function () {
                return "rest/v0/product/" + this.get('id');
            },

            onSync: function () {
                this.set('barCode', App.barCode(model.get('barCode')));
            }
        });

        Data.Good = new Good();
        Data.GoodCurrentCategory = new CurrentCategory();
        Data.GoodCharacteristics = new Backbone.Collection();
    });
});
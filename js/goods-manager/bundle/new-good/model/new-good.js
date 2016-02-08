define(["app", "bundle/common/collection/pageable-collection"], function(App, Pageable) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var CurrentCategory = Backbone.Model.extend({
            defaults: {
                id: null,
                name: '',
                totalCount: 0,                
                characteristics: []
            },
            
            url: function() {
                return "rest/v0/catalog/category/" + this.get('id');
            }
        });

        var NewGood = Backbone.Model.extend({
            defaults: {
                name: '',
                barCode: '',
                description: '',
                images: [],
                categoryId: null,
                characteristics: []
            }
        });

        Data.NewGoodCurrentCategory = new CurrentCategory();
        Data.NewGood = new NewGood();
    });
});
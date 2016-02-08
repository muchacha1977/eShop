define(["app", "bundle/common/collection/pageable-collection"], function(App, Pageable) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var ShopMessages = Pageable.Collection.extend({
            url: '/rest/v0/managers'
        });
        
        Data.ShopMessages = new ShopMessages();
    });
});
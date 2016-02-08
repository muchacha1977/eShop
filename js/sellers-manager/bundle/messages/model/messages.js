define(["app", "bundle/common/collection/pageable-collection"], function(App, Pageable) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Messages = Pageable.Collection.extend({
            url: '/rest/v0/managers'
        });
        
        Data.Messages = new Messages();
    });
});
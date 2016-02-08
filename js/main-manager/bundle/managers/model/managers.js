define(["app", "bundle/common/collection/pageable-collection"], function(App, Pageable) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Managers = Pageable.Collection.extend({
            url: '/rest/v0/managers'
        });
        
        Data.Managers = new Managers();
    });
});
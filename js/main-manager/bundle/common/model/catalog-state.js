define(["app"], function(App) {
    App.module("CatalogState", function(CatalogState, App, Backbone, Marionette, $, _) {

        var CatalogStateModel = Backbone.Model.extend({
            defaults: {
                category: null,
                shop: null,
                query: null
            }
        });
        if (!App.stateItems.catalogState) {
            App.stateItems.catalogState = new CatalogStateModel();
        }
    });
    return  App.stateItems.catalogState;
});
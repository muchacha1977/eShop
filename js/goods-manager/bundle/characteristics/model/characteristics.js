define(["app"], function(App) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Characteristics = Backbone.Collection.extend({
            url: "rest/v0/characteristics/"
        });

        Data.Characteristics = new Characteristics();
    });
});


define(["app"], function(App) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Categories = Backbone.Collection.extend({
            url: function () {
                return (this.id ? "rest/v0/catalog/branches/" + this.id : "rest/v0/catalog/branches");
            }
        });

        var CategoriesWithChars = Backbone.Collection.extend({
            url: function () {
                return (this.id ? "rest/v0/catalog/branches/" + this.id : "rest/v0/catalog/branches");
            }
        });        

        Data.Categories = new Categories();
        Data.CategoriesWithChars = new CategoriesWithChars();
    });
});

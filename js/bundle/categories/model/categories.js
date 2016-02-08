define(["app"], function(App) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Categories = Backbone.Collection.extend({
            url: "rest/v0/catalog/branches"
        });

        Data.Categories = new Categories();
        
        var CategoriesNameCollection = Backbone.Collection.extend({
            model:  Data.Categories 
        });


        var CatNodeCollection = Backbone.Collection.extend({
               model:  Data.Categories 
        });


        Data.CategoriesToNodeCollection  = {
            CategoriesNameCollection: new CatNodeCollection(),
            NodesCollection: new CatNodeCollection(),
            CategoriesToNode : []
           
        };

    });
});


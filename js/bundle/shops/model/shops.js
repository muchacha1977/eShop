define(["app"], function(App) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Shop = Backbone.Model.extend({});

        var Shops = Backbone.Collection.extend({
            model: Shop,
            url: "rest/v0/shops"
        });

        Data.Shops = new Shops();

        //Define status of application
         var ShopStatus = Backbone.Model.extend({
	         	 defaults: {
	                currentCategory:{},
	                currentSubcategory: {},
	                currentProduct: { }
	            }
          });
        Data.ShopStatus = new ShopStatus(); 

    });
});
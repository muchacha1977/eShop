define([
    'app'
], function(App){
    return App.module("Data", function (Data, App, Backbone, Marionette, $, _) {
        
		Data.TraderInfo = Backbone.Model.extend({
			url: "rest/v0/shop/state",
            defaults: {
                balance: '-',
				active: false
            }
		});
		
		//Data.TraderInfo = new TraderInfo();

    });
});
define(["app", 
    "text!bundle/managers/view/managers.html", 
    "text!bundle/managers/view/manager-item.html", 
    "bundle/managers/model/managers"
    ], function(App, managersTpl, itemTpl, Data) {
    return App.module("Managers", function(Managers) {

    	var ManagerView = Marionette.ItemView.extend({
    		className: 'manager-item row',

    		template: _.template(itemTpl),
			
			events: {
				'click .js-give-shops': "giveShops"
			},
			
			giveShops: function() {
				var self = this;
				require(['bundle/managers/shops-transfer'], function(shopsTransfer){
                    App.mainRegion.show(new shopsTransfer.Container(self.model));
                });
			}
			
    	});
        
        var ManagersListView = Marionette.CollectionView.extend({
        	tagName: 'div',

        	className: 'managers-list-wrapper',

        	collection: Data.Managers,

        	childView: ManagerView
        });

        Managers.View = Marionette.LayoutView.extend({
            className: 'managers-page',

            template: _.template(managersTpl),

            regions: {
            	home: '.js-managers'
            },

            onRender: function () {
                console.log(Data.Managers)
            	this.home.show(new ManagersListView());
            }
        });
        
    });
});

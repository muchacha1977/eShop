define(["app", 
    "text!bundle/messages/view/messages.html", 
    "text!bundle/messages/view/message-item.html", 
    "bundle/messages/model/messages"
    ], function(App, messagesTpl, itemTpl, Data) {
    return App.module("Messages", function(Messages) {

    	var MessageView = Marionette.ItemView.extend({
    		className: 'message-item row',

    		template: _.template(itemTpl)
    	})
        
        var MessagesListView = Marionette.CollectionView.extend({
        	tagName: 'div',

        	className: 'messages-list-wrapper',

        	collection: Data.Messages,

        	childView: MessageView
        });

        Messages.View = Marionette.LayoutView.extend({
            className: 'messages-page',

            template: _.template(messagesTpl),

            regions: {
            	home: '.js-messages'
            },

            onRender: function () {

            	this.home.show(new MessagesListView());
            }
        });
        
    });
});

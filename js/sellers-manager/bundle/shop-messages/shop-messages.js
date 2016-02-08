define(["app", 
    "text!bundle/shop-messages/view/shop-messages.html",
    "text!bundle/shop-messages/view/shop-message-item.html",
    "bundle/shop-messages/model/shop-messages",
    "model/shop"
    ], function(App, shopMessagesTpl, Data) {
    return App.module("ShopMessages", function(ShopMessages) {

        ShopMessages.View = Marionette.LayoutView.extend({
            className: 'shop-messages-page',

            template: _.template(shopMessagesTpl),

            model: Data.Shop
            
        });
        
    });
});

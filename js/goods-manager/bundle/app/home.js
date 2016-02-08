define(["app", "text!bundle/app/view/home.html"], function(App, homeTpl) {
    App.module("Home", function(Home) {
        Home.View = Marionette.ItemView.extend({
            template: _.template(homeTpl)
        });
        
    });
    return App.Home;
});

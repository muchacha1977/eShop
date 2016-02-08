define(["app", "text!bundle/app/view/home.html"], function(App, homeTpl) {
    App.module("Home", function(Home) {
        this.View = Marionette.LayoutView.extend({
            template: _.template(homeTpl),
            initialize: function(){
                App.loadCss('bundle/app/css/home.css');
            },
            events: {
                'click #trader-action': '_traderAction'
            },
            _traderAction: function(){
                App.navigate(this.$('#trader-action a').attr('href'), true);
            }
        });
        
    });
    return App.Home;
});

define([
	"app",
	"text!bundle/new-good/view/good-saved.html"
  ], 
	function(App, goodSavedTpl) {
    return App.module("GoodSaved", function(GoodSaved) {


        GoodSaved.View = Marionette.LayoutView.extend({
            template: _.template(goodSavedTpl),

           	ui: {
              addGoodBtn: '.js-add-good'
           	},

           	events: {
           		'click @ui.addGoodBtn': '_addGood'
           	},

            initialize: function() {
              if (!localStorage.getItem('newGoodFlag')) {
                return App.Router.navigate('home', {trigger: true});
              }  

              localStorage.removeItem('newGoodFlag');  
            },

            _addGood: function() {
              App.Router.navigate('new-good', {trigger: true});
              return false;
            }
        });
        
    });
});

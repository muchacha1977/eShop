define(["app", "text!bundle/app/view/footer.html" ], function(App, footerTpl) {
    return App.module("Footer", function(Footer, App, Backbone, Marionette, $, _) {

        Footer.View = Marionette.ItemView.extend({
            template: _.template(footerTpl)
        })

        Footer.onStart = function() {
            console.log("footer started");
        }

        Footer.onStop = function() {
            console.log("footer stopped");
        }

    });
});
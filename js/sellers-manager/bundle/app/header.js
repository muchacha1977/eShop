define(["app",
        "model/user",
        "text!bundle/app/view/header.html"
    ],

    function (
        App,
        Data,
        headerTpl
    ) {

        App.module("Header", function (Header, App, Backbone, Marionette, $, _) {

            Header.View = Marionette.LayoutView.extend({
                template: _.template(headerTpl)
            });

			
            /*Header.onStart = function () {
                console.log("header started");
            };

            Header.onStop = function () {
                Header.stopListening(Data.user);
                console.log("header stopped");
            };*/

        });

        return App.Header;

    }
);
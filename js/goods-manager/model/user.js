define(["app", "backbone", 'localstorage'],
    function (App) {
        App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

            Data.user = App.User;

        });

        return App.Data;
    }
);


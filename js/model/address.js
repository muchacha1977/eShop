/**
 * Created by GOODPROFY on 13.05.2015.
 */
define(["app"], function (App) {

    App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

        Data.Address = Backbone.Collection.extend({
            url: "rest/v0/buyer/address",
            save: function (){
                this.sync("create",this,{"url":this.url});
            },
            comparator: function(model) {
                return -model.get("deflt");
            }
        });
        Data.Address = new Data.Address();

    });

    return App.Data;

});
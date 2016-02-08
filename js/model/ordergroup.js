/**
 * Created by GOODPROFY on 18.07.2015.
 */
define([
    'app'
], function(
    App
){
    return App.module('Data.Ordergroup', function(Ordergroup, App, Backbone, Marionette, $, _){
        this.Model = Backbone.Model.extend({
            urlRoot: 'rest/v0/ordergroup'
        });

        this.PageableCollection = App.PageableCollection.extend({
            url: 'rest/v0/ordergroup'
        });
    });
});
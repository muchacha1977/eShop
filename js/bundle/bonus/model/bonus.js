/**
 * Created by GOODPROFY on 17.07.2015.
 */
define([
    'app'
], function(App){
    return App.module("Data.Bonus", function (Bonus, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;

        this.onStart = function(options){

        };

        this.onStop = function(options){

        };

        this.Bonus = {

            DAY_OF_COUNT: App.PageableCollection.extend({
                url: 'js/bundle/bonus/mock/count.json',
                mode: 'client', //TODO server
                state: {
                    pageSize: 5,
                    sortKey: "num",
                    order: -1,
                }
            }),
            DAY_OF_SUM: App.PageableCollection.extend({
                url: 'js/bundle/bonus/mock/sum.json',
                mode: 'client', //TODO server
                state: {
                    pageSize: 5,
                    sortKey: "num",
                    order: -1,
                }
            }),
            MONTH_OF_COUNT: App.PageableCollection.extend({
                url: 'js/bundle/bonus/mock/count.json',
                mode: 'client', //TODO server
                state: {
                    pageSize: 5,
                    sortKey: "num",
                    order: -1,
                }
            }),
            MONTH_OF_SUM: App.PageableCollection.extend({
                url: 'js/bundle/bonus/mock/sum.json',
                mode: 'client', //TODO server
                state: {
                    pageSize: 5,
                    sortKey: "num",
                    order: -1,
                }
            })
        };


    });
});
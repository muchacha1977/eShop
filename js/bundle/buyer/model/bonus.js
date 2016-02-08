/**
 * Created by GOODPROFY on 19.05.2015.
 */
define([
    'app'
], function(App){
    return App.module("Data.Buyer.Bonus", function (Bonus, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;

        this.onStart = function(options){

        };

        this.onStop = function(options){

        };

        this.Referrals = App.PageableCollection.extend({
            url: 'js/bundle/buyer/mock/referral-statistic.json',
            mode: 'client',
            state: {
                pageSize: 10
            }
        });

        this.ReferralsLevel = App.PageableCollection.extend({
            url: 'js/bundle/buyer/mock/referral-stastic-level.json',
            mode: 'client'
        });

        this.ReferralsLevelSum = App.PageableCollection.extend({
            url: 'js/bundle/buyer/mock/referral-stastic-level-sum.json',
            mode: 'client'
        });

        this.Referral = Backbone.Model.extend({
            url: 'js/bundle/buyer/mock/referral.json'
        });

        this.Traffic = App.PageableCollection.extend({
            url: 'js/bundle/buyer/mock/referral-traf.json',
            mode: 'client',
            state: {
                pageSize: 10
            }
        });

        this.AffiliateLevels = Backbone.Model.extend({
            url: 'js/bundle/buyer/mock/referral-network.json'
        });

        this.Predicted = {
            Model: Backbone.Model.extend({
                defaults:{
                    programCount: 4,
                    programArgs: [
                        {
                            programType: 'DAY_OF_COUNT',
                            period: {
                                start: '01.07.2015 00:00',
                                end: '01.07.2015 23:59'
                            },
                            fond:{
                                qwer: 70000,
                                members: 2563
                            },
                            my: {
                                "level": 142,
                                "nick": "Я",
                                "orderCount": 5,
                                "bonus": 1500,
                                "delivered": 84,
                                "position": 5
                            }
                        },
                        {
                            programType: 'DAY_OF_SUM',
                            period: {
                                start: '01.07.2015 00:00',
                                end: '01.07.2015 23:59'
                            },
                            fond:{
                                qwer: 70000,
                                members: 2563
                            },
                            my: {
                                "level": 142,
                                "nick": "Я",
                                "orderCount": 5,
                                "bonus": 1500,
                                "delivered": 84,
                                "position": 5
                            }
                        },
                        {
                            programType: 'MONTH_OF_COUNT',
                            period: {
                                start: '01.07.2015 00:00',
                                end: '31.07.2015 23:59'
                            },
                            fond:{
                                qwer: 70000,
                                members: 6563
                            },
                            my: {
                                "level": 142,
                                "nick": "Я",
                                "orderCount": 5,
                                "bonus": 1500,
                                "delivered": 84,
                                "position": 5
                            }
                        },
                        {
                            programType: 'MONTH_OF_SUM',
                            period: {
                                start: '01.07.2015 00:00',
                                end: '31.07.2015 23:59'
                            },
                            fond:{
                                qwer: 70000,
                                members: 7563
                            },
                            my: {
                                "level": 142,
                                "nick": "Я",
                                "orderCount": 5,
                                "bonus": 1500,
                                "delivered": 84,
                                "position": 5
                            }
                        }
                    ]
                }
            }),
            DAY_OF_COUNT: App.PageableCollection.extend({
                url: 'js/bundle/buyer/mock/predicted-day-count.json',
                mode: 'client', //TODO server
                state: {
                    pageSize: 10
                }
            }),
            DAY_OF_SUM: App.PageableCollection.extend({
                url: 'js/bundle/buyer/mock/predicted-day-sum.json',
                mode: 'client', //TODO server
                state: {
                    pageSize: 10
                }
            }),
            MONTH_OF_COUNT: App.PageableCollection.extend({
                url: 'js/bundle/buyer/mock/predicted-day-count.json',
                mode: 'client', //TODO server
                state: {
                    pageSize: 10
                }
            }),
            MONTH_OF_SUM: App.PageableCollection.extend({
                url: 'js/bundle/buyer/mock/predicted-day-sum.json',
                mode: 'client', //TODO server
                state: {
                    pageSize: 10
                }
            })
        };


    });
});
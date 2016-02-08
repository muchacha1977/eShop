/**
 * Покупатель
 * @version 0.0.1
 * Created by Yuriy Dolganov on 19.05.2015.
 */
define([
    "app"
], function(App) {
    'use strict';
    return App.module("Controller", function(Controller, App, Backbone, Marionette, $, _) {

        this.showBuyerView = function(tab, subTab, queryString){
            var params = App.QUERY_STRING(queryString);

            if(params.bid && !params.ask && !params.asks){
                require(['bundle/buyer/bid'], function(Bid){
                    Bid.start({id: params.bid, subTab: subTab});
                });
            }

            if(params.bid && params.ask && params.asks){
                require(['bundle/buyer/ask'], function(Ask){
                    Ask.start({id: params.ask, bid: params.bid});
                });
            }

            if(params.bid && !params.ask && params.asks){
                require(['bundle/buyer/asks'], function(Asks){
                    Asks.start({id: params.bid, subTab: subTab});
                });
            }

            require(["bundle/buyer/buyer"], function(Buyer) {
                App.getMainRegion().show(new Buyer.ContainerView( {"tab":tab, "subTab":subTab} ));
            });

        };
        this.showBuyerReferralStats = function(level, date){
            require(["bundle/buyer/bonus-referral-referrals-level"], function(Buyer) {
                App.getMainRegion().show(new Buyer.ContainerView( {level: level, date: date} ));
            });
        };
        this.showBuyerReferralStatsSum = function(level, start, end){
            require(["bundle/buyer/bonus-referral-referrals-level-sum"], function(Buyer) {
                App.getMainRegion().show(new Buyer.ContainerView( {level: level, start: start, end: end} ));
            });
        };


        App.appRoutes.set({
            "buyer(/:tab)" : "showBuyerView",
            "buyer/:tab(/:subTab)" : "showBuyerView",
            "buyer/:tab(/:subTab)?*queryString" : "showBuyerView",
            "buyer/bonus/referral/:level/:date" : "showBuyerReferralStats",
            "buyer/bonus/referral/:level/:start/:end" : "showBuyerReferralStatsSum"
        });

    });

});



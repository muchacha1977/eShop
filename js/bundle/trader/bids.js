define([
        "app",
        "bundle/common/paginator",
        "bundle/trader/model/bids",
        "text!bundle/trader/view/bid/container.html",
        "bundle/modal/modal",
		"moment",
		//"model/user",
		
        "model/state",
        'backgrid.select',
		
        "jquery.tablesorter",
        "jquery.tablesorter.widgets"
	],
    function (App,
              Paginator,
              Data,
              containerTpl,
              Modal,
			  moment
			 // User
    ) {
        'use strict';
        App.module("Bids", function (Bids, App, Backbone, Marionette, $, _) {
			
			this.View = Marionette.LayoutView.extend({
                template: _.template(containerTpl),

                regions: {
                    bidPagerRegion: "#shop-bids-pagination",
                    bidListAllRegion: "#shop-bids-list-all",
                    myAsksListRegion: "#shop-my-asks-list"
                },
                templateHelpers: {
                    state: Data.State.toJSON()
                },
                events: {
					'click #bid-list-all-tab a': '_onBidsShow',
					'click #my-asks-tab a': '_onMyAsksShow'
                },
                onBulkAction: function(e){
                },
                initialize: function() {
                    this._onBidsShow();
                },
				_onMyAsksShow: function() {
					var self = this;
					require(['bundle/trader/myasks'], function (myAsks) {
						//self.myAsksListRegion.show(new myAsks.myAskListView({collection: myAsks.myAsksCollection}));
						self.myAsksListRegion.show(new myAsks.Container());
					});
				},
				_onBidsShow: function() {
					var self = this;
					
					require(['bundle/trader/bids-all'], function (AllBids) {
						self.bidListAllRegion.show(new AllBids.Container());
					});
					/*
                    var traderBids = new Data.TraderBidsCollection();
                    traderBids.fetch({
                        reset:true,
                        success: function(collection, response, options) {
                            if (traderBids.length == 0) {
                                console.log("no any bids");
                            } else {
								//var collection = new Data.TraderBidsCollection(traderBids.where({state: 'CREATED'}));//.where({state: 'CREATED'}));
								//self.bidListRegion.show(new BidListView({ collection: collection  }));
								self.bidListAllRegion.show(new BidListView({ collection: traderBids  }));
								if (traderBids.state.totalPages > 1 ){
									var paginator = new Paginator.Paginator({collection: traderBids});
									self.bidPagerRegion.show(paginator);
								}
                            }
                        }
                    });*/
				}

            });
			
		});

        return App.Bids;
    }
);
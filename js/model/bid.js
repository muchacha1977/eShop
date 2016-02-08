/**
 * Created by Root on 27.05.2015.
 */
define(['app', "model/regions"], function(App, DataRegions) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {
        Data.Bid = {
            Model: Backbone.Model.extend({
                urlRoot: 'rest/v0/bid',
                initialize: function() {
                    console.log('Data.Bid.Model >>> init');
                },
                defaults: {
                    unitPrice: null,
                    quantity: 1,
                    productId: null,
                    shipmentTypes: null,
                    validUntil: null,
                    region: null
                }
            }),
            Collection: Backbone.Collection.extend({
                url: 'rest/v0/bid',
                initialize: function() {
                    console.log('Data.Bid.Collection >>> init');
                }
            }),
            PageableCollection: App.PageableCollection.extend({
                url: 'rest/v0/bid',
                state: {
                    pageSize: 10,
                    sortKey: "creationTime",
                    order: -1
                }
            }),
            Active: App.PageableCollection.extend({
                url: 'rest/v0/bid',
                state: {
                    pageSize: 10,
                    sortKey: "creationTime",
                    order: -1,
                    q: 'active'
                }
            }),
            ActiveCurrentBids: App.PageableCollection.extend({
				//model: Data.Bid.Model,
                initialize: function(options){
                    options || ( options = {} );
                    var self = this;
                    this.url = "rest/v0/product/" + options.id + "/bids";
                    this.on('sync', function(collection) {
                        _.each(collection.models, function(model, idx, models){
                            if ( _.isUndefined(model.get('validUntil')) ){
                                model.set({"validUntil": 0}, {silent: true});
                            }
                        });
                    });

                },
                state: {
                    pageSize: 10,
                    sortKey: "creationTime",
                    order: -1,
                    q: 'active'
                },
                onChange: function() {
                    var self = this;
                    var Regions = DataRegions.Collection;
                    _.each(this.models, function(bid) {
                        var region = bid.get('region');
                        if (typeof region !== 'undefined') {
                            bid.set({
                                regionName: Regions.get(region).get('name')
                            }, {
                                silent: true
                            });
                        } else {
                            console.log("regionName Не указано!");
                        }
                    });
                }
            }),
            Closed: App.PageableCollection.extend({
                url: 'rest/v0/bid',
                state: {
                    pageSize: 10,
                    sortKey: "creationTime",
                    order: -1,
                    q: 'closed'
                }
            })
        };
    });
});
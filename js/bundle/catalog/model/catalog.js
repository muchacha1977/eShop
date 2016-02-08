/**
 * Created by GOODPROFY on 30.07.2015.
 */

define([
    "app"
], function(App) {
    "use strict";
    return App.module("Catalog.Model", function(Model, App, Backbone, Marionette, $, _) {

        var Nodes = Backbone.Model.extend({
            urlRoot: App.getRest('catalog/node')
        });

        var Branches = Backbone.Collection.extend({
            url: App.getRest('catalog/branches'),
            initialize: function(){
                this.on('sync', function(collection){
                    _.each(collection.models, function(model){
                        if (_.isUndefined(model.icon)){
                            model.set({icon: 'fa fa-cubes fa-2x'}, {silent: true});
                        }
                    });
                });
            }
        });

        var Params = App.PageableCollection.extend({
            url: 'mock/details-fullList.json'
        });

        var Product = Backbone.Model.extend({
            urlRoot:  App.getRest('product')
        });

        var Products = App.PageableCollection.extend({
            model: Product,
            url: App.getRest('product'),
            initialize: function( options ){
                options || ( options = {} );
                if(!_.isUndefined(options.state)){
                    _.extend(this.state, options.state);
                }
                if(!_.isUndefined(options.queryParams)){
                    _.extend(this.queryParams, options.queryParams);
                }
            },
            state: {
                firstPage: 1,
                pageSize: 10,
                c: null,
                s: null
            },
            queryParams: _.extend(App.PageableCollection.prototype.queryParams, {
                c: function () { return this.state.c; }, //categoriID
                s: function () { return this.state.s; } //shopID
            }),
            parse: function (resp, options) {
                var newState = this.parseState(resp, _.clone(this.queryParams), _.clone(this.state), options);
                if (newState) this.state = this._checkState(_.extend({}, this.state, newState));
                this.tree = resp.tree;
                return this.parseRecords(resp, options);
            }
        });

        var Shop = Backbone.Model.extend({
            defaults:{
                id: null,
                name: null,
                alias: null
            }
        });

        var Shops = Backbone.Collection.extend({
            url: App.getRest('shops'),
            initialize: function(){
                this.on('sync', this._addons);
            },
            _addons: function(collection){
                _.each(collection.models, function(model){
                    if ( _.isUndefined(model.get('alias')) ) model.set({alias: model.get('id')}, {silent: true});
                });
            }
        });

        var Filter = Backbone.Collection.extend({

        });

        var Offers = App.PageableCollection.extend({
            initialize: function( options ){
                options || ( options = {} );
                this.url = App.getRest('offer/p/'+options.id);
            },
            state: {
                pageSize: 10,
                sortKey: "unitPrice",
                order: 1
            }
        });

        this.Nodes = new Nodes();
        this.Branches = new Branches();
        this.Product = Product;
        this.Products = Products;
        this.Shop = new Shop();
        this.Shops = new Shops();
        this.Filter = new Filter();
        this.Offers = Offers;
        this.Params = new Params();

        this.onStart = function(){
            console.log('Catalog.Model >>> Start');
            Model.Branches.fetch({reset: true});
            Model.Shops.fetch({reset: true});
        };

        this.onStop = function(){
            // never stop!
        };

    });

});
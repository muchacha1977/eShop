
define(["app", "backbone", "bundle/common/collection/pageable-collection"], function(App, Backbone, Pageable) {

    return App.module("Data", function (Data, App, Backbone, Marionette, $, _) {

        var CatNode = Backbone.Model.extend({

            initialize: function() {
                var nodes = this.get("nodes");
                if(nodes) {
                    this.nodes = new CatNodeCollection(nodes);
                    this.unset("nodes");
                }
            }
        });

        var CatNodeCollection = Backbone.Collection.extend({
            model: CatNode
        });

        var TotalAmountProductsModel = Backbone.Model.extend({
            defaults: {
                total: 0,
                categoriesAmount: 0
            }
        });

        var ProductFilterModel = Backbone.Model.extend({
            defaults: {
                name: null,
                options: []
            }
        });

        var ProductFilterCollection = Backbone.Collection.extend({
            model: ProductFilterModel
        });

        var CurrentShopModel = Backbone.Model.extend({
            defaults: {
                id: null, 
                name:null
            }
        });

        var ProdListCollection = Pageable.Collection.extend({

            initialize: function(options){

                _.bindAll(this, '_onSync');

                this.url = function(){
                    if (!this.query && !this.category && !this.shop) {
                        return;
                    } else {
                        var q = "?";
                        if (this.query) {
                            q += "q=" + this.query;
                            if (this.category) {
                                q += "&c=" + this.category;
                                if (this.shop) {
                                    q += "&s=" + this.shop;
                                }
                            } else if (this.shop) {
                                q += "&s=" + this.shop;
                            }

                        } else if (this.category) {
                            q += "c=" + this.category;
                            if (this.shop) {
                                q += "&s=" + this.shop;
                            }
                        } else if(this.shop) {
                            q += "s=" + this.shop;
                        }
                    }

                    return "rest/v0/product" + q;
                };

                this.on('sync', this._onSync);
            },

            _onSync: function() {
                console.log(this);
                _.map(this.models, function(model){
					var description =  model.get("description") || "";
                    model.set({
						preview: (typeof model.get("preview") == 'undefined') ?(description.substr(0,(description.length>=150) ?150: description.length)+"...") : model.get('preview'), // TODO: убрать, когда preview будет прилетать от сервера
                        barCode: App.barCode(model.get('barCode')),
                        shop: this.shop
                    });
                }.bind(this));
            }
        });

        Data.Catalog = {
            CatNodeCollection: new CatNodeCollection(),
            ProductFilterCollection: new ProductFilterCollection(),
            TotalAmountProductsModel: new TotalAmountProductsModel,
            CurrentShopModel: new CurrentShopModel(),
            ProdListCollection: new ProdListCollection(),
            Model: null
        };
    });

});


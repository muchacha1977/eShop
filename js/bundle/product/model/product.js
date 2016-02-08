define(["app", "bundle/common/collection/pageable-collection"], function(App, Pageable) {
    return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        var Offer = Backbone.Model.extend({
            defaults: {
                price:"0.0",
                shipmentTypes: {},
                shop: { id: "", name: "" }
            }
        });

        var Offers = App.PageableCollection.extend({
            model: Offer,

            id: "",

            url: function() {
                return "rest/v0/offer/p/" + this.id;
            }
        });
		
		var BreadcrumbNode = Backbone.Model.extend();
		var Breadcrumbs = Backbone.Collection.extend({
			model: BreadcrumbNode
		});
		
		var Detail = Backbone.Model.extend();
		var Details = App.PageableCollection.extend({
			model: Detail,
			url: 'mock/details-fullList.json'
		});

        var Product = Backbone.Model.extend({
            url: function(){
                return "rest/v0/product/" + this.get('id');
            },
			initialize: function() {
				var self = this;
				this.set({
					detailCollection: new Details((typeof self.get('details') != 'undefined') ? self.get('details') : null)
				});
				var details = this.get('detailCollection');
				/*if(details.length < 1) {
					details.fetch({
						url : "mock/details-shortList.json",
						success: function() {
							//console.log(self.toJSON());
						}
					});
				}/**/
			}
        });

        var Bid = Backbone.Model.extend({

            defaults: {
                productId: "",
                unitPrice: "",
                quantity: 1,
                validUntil: ""
            },

            url: function () {
                return "rest/v0/bid";
            },

            validate: function() {
                console.log( this.get('validUntil') );
                console.log( moment(this.get('validUntil'), "DD.MM.YY HH:mm").format('x') );
                this.set('validUntil', moment(this.get('validUntil'), "DD.MM.YY HH:mm").format('x'));
            }

        });

        Data.OfferModel = new Offer();
        Data.OffersCollection = new Offers();
        Data.Product = new Product();
		Data.Details = new Details();
        Data.Bid = new Bid();
		Data.Breadcrumbs = new Breadcrumbs();
    });
});
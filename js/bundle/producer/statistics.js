define(["app",
       // "bundle/producer/model/statistics",
        "text!bundle/producer/view/statistics/container.html"
    ],
    function (App,
         //     Data,
              containerTpl) {
		return App.module("Producer.Statistics", function (Statistics, App, Backbone, Marionette, $, _) {


			var Model = Backbone.Model.extend({
				defaults: {
					"brandsQuantity"	: "0",
					"sellersQuantity"	: "0",
					"productsQuantity"	: "0"
				},
				url : 'mock/producer/generalInfo.json'
			});
					
			this.View = Marionette.LayoutView.extend({
                template: _.template(containerTpl),
				model : new Model(),
				regions: {
                    brandsRegion: "#brands",
                    productsRegion: "#products",
                    sellersRegion: "#sellers",
                    reportsRegion: "#reports"
                },
				events: {
					'click #brands-tab': '_onShowBrands',
					'click #products-tab': '_onShowProducts',
					'click #sellers-tab': '_onShowSellers',
					'click #reports-tab': '_onShowReports'
				},
                initialize: function() {
					var self = this; 
					this.model.fetch({
						success: function() {
							self.render();
							self._onShowBrands();
						}
					});
                },
				_onShowBrands: function() {
					var self = this;
					require(['bundle/producer/brands'], function (Brands) {
						self.brandsRegion.show(new Brands.Container());
					});
				},
				_onShowProducts: function() {
					App.navigate('#categories', true);
				},
				_onShowSellers: function() {
					var self = this;
					require(['bundle/shops/shops'], function (Shops) {
						self.sellersRegion.show(new App.Shops.ProducerView());
					});
				},
				_onShowReports: function() {
					var self = this;
					require(['bundle/producer/reports'], function (Reports) {
						self.reportsRegion.show(new Reports.Container());
					});
				}
			});

        });
    }
);



define(['app',
        'model/catalog',
        'text!bundle/prodlist/view/prodlist-container.html',
        'text!bundle/prodlist/view/prodlist-prod-item.html',
        'text!bundle/prodlist/view/prodlist-prod-list.html',
        'text!bundle/prodlist/view/prodlist-cat-item.html',
        'text!bundle/prodlist/view/product-filter.html',
        'text!bundle/prodlist/view/product-filter-list.html',
        'text!bundle/prodlist/view/pagination-control.html',
        'text!bundle/prodlist/view/total-amount.html',
        'text!bundle/prodlist/view/logo.html',
        'text!bundle/prodlist/view/shop-description.html',
        'text!bundle/prodlist/view/empty-list.html',
        'bundle/shop-info/shop-info',
        "bundle/shops/model/shops"
        ],
    function(
        App,
        Data,
        containerTpl,
        prodItemTpl,
        prodListTpl,
        catItemTpl,
        productFilterTpl,
        productFilterListTpl,
        pagerTpl,
        totalAmountTpl,
        logoTpl,
        shopDescriptionTpl,
        emptyListTpl
    ) {

        return App.module('ProdList', function(ProdList, App, Backbone, Marionette, $, _) {

            var CatTreeView = Marionette.CompositeView.extend({

                template: _.template(catItemTpl),

                tagName: 'ul',

                model: Data.Catalog.CatNodeCollection.model,

                initialize: function() {
                    this.collection = this.model.nodes;
                    if(window.location.href.search("/-/")==-1&&this.collection!=null&&this.collection.length==1){
                            this.collection.each(function (index) {
                                if(index.get('count')!=null && index.get('flag')===true){
                                    Data.ShopStatus.currentSubcategory=index.get('id');                                    
                                }
                                else{
                                    Data.ShopStatus.currentCategory=index.get('id');                                
                                }

                        });
                    }
                    else if (window.location.href.search("/-/")!=-1){
                        Data.ShopStatus.currentCategory = null; 
                        Data.ShopStatus.currentSubcategory= null;
                    }
                }
            });

            var CatRootView = Marionette.CollectionView.extend({
                childView: CatTreeView
            });

            var ProductFilterView = Marionette.ItemView.extend({
                template: _.template(productFilterTpl),

                tagName: 'div',

                className: 'product-filter',

                initialize: function() {
                    this.collection = this.model.nodes;
                }
            });

            var ProductFilterListView = Marionette.CollectionView.extend({
                tagName: 'div',

                template: _.template(productFilterListTpl),

                collection: Data.Catalog.ProductFilterCollection,

                childView: ProductFilterView
            });

            var ProdItemView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'media list-group-item',

                template: _.template(prodItemTpl),

                ui: {
                    toCart: '.js-to-basket button',
                    addOffer: 'button#addOffer'
                },

                events: {
                    'click @ui.toCart': '_toCart',
                    'click @ui.addOffer': '_addOffer'
                },

                _toCart: function(event) {
                    App.vent.trigger('cart:add', event);
                },
                _addOffer: function() {
                    var self = this;
                    require(['bundle/trader/offer-add'], function (Offer) {
                        App.dialogRegion.show(new Offer.offerLayout(self.model));
                    });
                },
                serializeData: function(){
                    return _.extend(this.model.toJSON(), {
						traderViewing: (App.User.isTrader() &&!App.User.isProducer()) ? true : false
					});
                }
            });

            var ProdListView = Marionette.CollectionView.extend({
                tagName: 'ul',
                className: 'list-group',
                initialize: function() {
                    var self = this;
                    App.User.once('change', function(){
                        if (self.isDestroyed === true) {
                            return;
                        }
                        self.render();
                    });
                },
           
               
                template: _.template(prodListTpl),

                collection: Data.Catalog.ProdListCollection,

                childView: ProdItemView

            });

            var TotalAmountView = Marionette.ItemView.extend({
                template: _.template(totalAmountTpl),
                model: Data.Catalog.TotalAmountProductsModel,

                modelEvents: {
                    'change': '_onChange'
                },

                _onChange: function(){
                    this.render();
                }
            });

            var LogoView = Marionette.ItemView.extend({
                template: _.template(logoTpl),
                model: Data.Catalog.CurrentShopModel,
                ui: {
                    logotype: '#logoType',
                    logotypeText: '#logoTypeText'
                },
               onShow: function() {
                     $( '#logoType' ).error
                        (
                            function ()
                            {
                                 $( '#logoType' ).hide();
                            }
                        );
                   
                }
             
            });

            var ShopDescriptionView = Marionette.ItemView.extend({
                template: _.template(shopDescriptionTpl),
                model: Data.Catalog.CurrentShopModel,
                initialize:function(model){
                    console.log("Data.Catalog.CurrentShopModel" + JSON.stringify(Data.Catalog.CurrentShopModel));
                }
            });

            ProdList.Container = Marionette.LayoutView.extend({
                template: _.template(containerTpl),

                ui: {
                    filtersRegion: '.js-filters-region'
                },

                regions: {
                    treeHeaderRegion: '.js-tree-header',
                    categoriesRegion: '.js-search-categories-region',
                    filtersRegion: '.js-filters-region',
                    shopDescriptionRegion: '.js-shop-description-region',
                    productsRegion: '.js-search-products-region',
                    prodPagerRegion: '.js-search-paginator'
                },

                onShow: function() {

                    if (Data.Catalog.ProdListCollection.shop) {
                        this.treeHeaderRegion.show(new LogoView());
                        this.shopDescriptionRegion.show(new ShopDescriptionView());
                    } else {
                        this.treeHeaderRegion.show(new TotalAmountView());
                        this.shopDescriptionRegion.reset();
                    }

                    if (Data.Catalog.ProductFilterCollection.models.length) {
                        this.ui.filtersRegion.show();
                        this.filtersRegion.show(new ProductFilterListView());
                    } else {
                        this.ui.filtersRegion.hide();
                        this.filtersRegion.reset();
                    }

                    this.productsRegion.show(new ProdListView());
                    this.categoriesRegion.show(new CatRootView({collection: Data.Catalog.CatNodeCollection}));
                    this.prodPagerRegion.show(new App.Pagination({collection: Data.Catalog.ProdListCollection}));
                }
            });

            ProdList.Empty = Marionette.ItemView.extend({
                template: _.template(emptyListTpl)
            });
        });
    });

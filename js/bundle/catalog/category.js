/**
 * Created by GOODPROFY on 25.08.2015.
 */
define([
    'app',
    'text!bundle/catalog/view/category/category.html',
    'text!bundle/catalog/view/category/product.html',
    'text!bundle/catalog/view/category/filter.html',
    'text!bundle/catalog/view/category/node.html'
], function(
    App,
    viewCategory,
    viewProduct,
    viewFilter,
    viewNode
){
    "use strict";
    return App.module("Catalog.Category", function (Category, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;
        this.onStart = function( options ){
            console.log('Catalog.Category >>> Start');
            console.log(options);
            try {
                var Products = new App.Catalog.Model.Products({ state: {c: options.id, q: options.q, s: options.s} });
                Products.fetch({ reset: true }).done(function(){
                    if ( Products.length > 0 ){
                        App.getMainRegion().show( new Category.Container({ collection: Products }) );
                    }else{
                        App.getMainRegion().show(new Category.Empty());
                    }
                    App.Catalog.Category.stop();
                });
            } catch (err) {
                console.log(err);
            }
        };

        this.onStop = function(){
            // never stop!
        };

        /**
         * Гланый по тарелочкам
         */

        this.Empty = Marionette.ItemView.extend({
            template: _.template('<div><h4>К сожалению, по вашему запросу ничего не найдено.</h4> </div>'),
            onShow: function(){
                App.Catalog.Category.stop();
                App.Breadcrumbs.add({url: 'catalog', title: 'Каталог товаров'});
            }
        });

        this.Container = Marionette.LayoutView.extend({
            template: _.template( viewCategory ),
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
            state: function(){
                return this.collection.state;
            },
            tree: function(){
                if (_.isUndefined(this.collection.tree) ) return {};
                return this.collection.tree;
            },
            nodesLength: function(){
                if (_.isUndefined( this.tree().nodes) ) return 0;
                return  this.tree().nodes[0].nodes.length;
            },
            initialize: function(){
                this.listenTo(App.User, 'change', this.render);
                this.listenTo(this.collection, 'change', this.render);
                this.listenTo(this.collection, 'sync', function(){
                    if ( App.viewport.width > 1023 ) {
                        $(window).scrollTop(117);
                    }else{
                        $(window).scrollTop(0);
                    }
                });
            },
            onRender: function() {
                this.productsRegion.show(new Category.Products({collection: this.collection}));
                this.prodPagerRegion.show(new App.Pagination({collection: this.collection}));
                this.treeHeaderRegion.show(new Category.Total({model: new Backbone.Model({
                    prefix: App.getNumEnding(this.state().totalRecords, ['Найден', 'Найдено', 'Найдено']),
                    total: {n: this.state().totalRecords, s: App.getNumEnding(this.state().totalRecords, ['товар', 'товара', 'товаров'])},
                    category: {n: this.nodesLength(), s: App.getNumEnding(this.nodesLength(), ['категории', 'категориях', 'категориях'])}
                })}));
                if (App.Catalog.Model.Filter.models.length) {
                    this.ui.filtersRegion.show();
                    this.filtersRegion.show(new Category.Filters());
                } else {
                    this.ui.filtersRegion.hide();
                    this.filtersRegion.reset();
                }
                this.categoriesRegion.show(new Category.Nodes({collection: new Backbone.Collection(this.tree())}));
            },
            onShow: function(){
                App.Catalog.Category.stop();
            }
        });


        /**
         * Сколько и где нашли?
         */
        this.Total = Marionette.ItemView.extend({
            template: _.template('<%- prefix %> <%- total.n %> <%- total.s %> в <%- category.n %> <%- category.s %>')
        });

        /**
         * Дерево категорий
         */
        this.Node = Marionette.CompositeView.extend({

            template: _.template(viewNode),

            tagName: 'ul',

            initialize: function() {
                var self = this;
                this.collection = new Backbone.Collection(this.model.get('nodes'));
                _.each(this.collection.models, function(model){
                    model.set( {href: self.model.get('href')+'/'+model.get('id')}, {silent: true} );
                    if ( model.get('flag') ) App.Breadcrumbs.add([{url: model.get('href'), title: model.get('name')}]);
                });
            }
        });

        this.Nodes = Marionette.CollectionView.extend({
            childView: Category.Node,
            initialize: function(){
                App.Breadcrumbs.reset();
                _.each(this.collection.models, function(model){
                    model.set( {href: 'catalog'}, {silent: true} );
                    if ( model.get('flag') ) App.Breadcrumbs.add([{url: model.get('href'), title: model.get('name')}]);
                });
            }
        });



        /**
         * Преаью продукта
         */
        this.Product = Marionette.ItemView.extend({
            tagName: 'div',
            className: 'media list-group-item',

            template: _.template(viewProduct),

            events: {
                'click .js-to-basket button': '_toCart',
                'click button#addOffer': '_addOffer'
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

                var paths = '';
                _.each(this.model.get('path'), function(path, idx){
                    if ( idx == 0 ) {
                        paths += 'catalog';
                        App.Breadcrumbs.add([{url: paths, title: path.name}]);
                    }else{
                        paths += '/'+path.id;
                        App.Breadcrumbs.add([{url: paths, title: path.name}]);
                    }

                });
                var categoryHref = paths;
                var categoryName = _.last(this.model.get('path')).name;
                paths += '/'+this.model.get('id')+'.html';
                App.Breadcrumbs.add([{url: paths, title: this.model.get('name')}]);


                /**
                 *
                 * TODO Вынести
                 */
                var BCollection = new Backbone.Collection(this.model.get('path'));

                var path = '';

                var BColItem = Marionette.ItemView.extend({
                    template: _.template('<a href="#<%-id%>"><%-name%></a>'),
                    tagName: 'li',
                    serializeData: function(){
                        path+='/';
                        path+= this.model.get('id');
                        return _.extend(this.model.toJSON(), {id: path});
                    }
                });

                var BColView = Marionette.CompositeView.extend({
                    collection: BCollection,
                    template: _.template('<ol style="padding: 0;margin: 0;" class="breadcrumb hidden-xs"></ol>'),
                    childViewContainer: 'ol',
                    childView: BColItem
                });

                var BColHtml = new BColView();
                BColHtml.render();

                return _.extend(this.model.toJSON(), {
                    traderViewing: (App.User.isTrader() &&!App.User.isProducer()) ? true : false,
                    href: paths,
                    breadcrumbs: BColHtml.el.innerHTML
                });
            }
        });

        this.Products = Marionette.CollectionView.extend({
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

            childView: Category.Product

        });

        /**
         * Фильтр. Сейчас пуст
         */
        this.Filter = Marionette.ItemView.extend({
            template: _.template(viewFilter),

            tagName: 'div',

            className: 'product-filter',

            initialize: function() {
                this.collection = this.model.nodes;
            }
        });

        this.Filters = Marionette.CollectionView.extend({
            tagName: 'div',

            collection: App.Catalog.Model.Filter,

            childView: Category.Filter
        });


    });
});

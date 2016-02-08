/**
 * Created by GOODPROFY on 13.04.2015.
 */

define([
    "app",
    "text!bundle/shops/view/button.html",
    "text!bundle/shops/view/shop.html",
    "text!bundle/shops/view/producer.html",
    "bundle/shop-info/model/shop-info",
    "bundle/shops/model/shops"
], function (App, buttonTpl, shopItemTpl, producerTpl) {
    "use strict";
    return App.module("Shops", function(Shops, App, Backbone, Marionette, $, _) {

        /**
         * @param id or alias
         */
        this.setShop = function(id){
            localStorage.setItem('shop', String(id));
            App.Catalog.Model.Shop.set({id: id});
            return true;
        };

        /**
         * return String ShopId or Alias
         */
        this.getShop = function(){
            if ( String(localStorage.getItem('shop'))!='' && localStorage.getItem('shop') != null ) return String(localStorage.getItem('shop'));
            return '';
        };

        /**
         * @returns {boolean}
         */
        this.delShop = function(){

            if (localStorage.setItem('shop', '')) {
                App.Catalog.Model.Shop.set({id: null});
                return true;
            }
            return false;
        };

        /**
         * @returns {string shop name}
         */
        this.getName = function () {
            var find = App.Catalog.Model.Shops.findWhere({alias: this.getShop()});
            if ( _.isUndefined(find) ) return false;
            return String(find.get('name'));
        };


        var Shop = Marionette.ItemView.extend({
            ui: {
                shopItem: '.js-shop-href'
            },

            template: _.template(shopItemTpl),

            onRender: function(){
                this.$el = this.$el.children();
                this.$el.unwrap();
                this.setElement(this.$el);
            }
        });

        var ShopsContainer = Marionette.CollectionView.extend({

            childView: Shop
          
        });

        Shops.Button = Marionette.LayoutView.extend({
            ui: {
                button:       '#shops-button',
                shopsPopover: '.js-shops-popover',
                breadcrumbUri: '#breadcrumbToShop',
                shopnameinbutton : '#shopNameInButton',
                closeshop: '#closeShop'
               
            },

            events: {
                'click @ui.button': '_onButtonClick',
                'click @ui.closeshop' : '_onCloseShop'
            },

            regions: {
                shopsContainer: '.js-shops-container'
            },

            template: _.template(buttonTpl),

            _filters: { },

            initialize: function(){
                _.bindAll(this,
                    '_onCollectionSuccessFetch',
                    '_setUIAfterPopoverShow',
                    '_onShowPopover',
                    '_onShopsSearch',
                    '_onShopItemClick',
                    '_onDocumentClick',
                    '_onFilterTypeClick',
                    '_onSubFilterTriggerClick',
                    '_onFilterActionClick',
                    '_useFilters',
                    '_useSearch',
                    '_onCloseClick',
                    '_onCloseShop',
                    '_switchBreadCrumbVisible'
                );



                App.Catalog.Model.Shop.on('change', this.render);

            },

            onRender: function(){
                this._switchBreadCrumbVisible(0);
                if ( Shops.getShop() ) {
                    this.$('#breadcrumbToShop').attr('href', '#'+Shops.getShop());
                    this.$('#breadcrumbToShop').text(Shops.getName());
                    this._switchBreadCrumbVisible(1);
                }
                App.Catalog.Model.Shops.on('sync', this._onCollectionSuccessFetch());
            },
            onShow: function(){
                this._switchBreadCrumbVisible(0);
                if ( Shops.getShop() ) {
                    this.$('#breadcrumbToShop').attr('href', '#'+Shops.getShop());
                    this.$('#breadcrumbToShop').text(Shops.getName());
                    this._switchBreadCrumbVisible(1);
                }
            },
            _onCollectionSuccessFetch: function(){

                _.each(App.Catalog.Model.Shops.models, function(model){
                    model.attributes.rating = Math.ceil(Math.random() * 100);
                });

                this.shopsContainer.show(new ShopsContainer({
                    collection: App.Catalog.Model.Shops
                }));
                var html = this.ui.shopsPopover.html();
                this.ui.button.popover({
                    html: true,
                    container: '.app-shops .container',
                    content: function(){
                        return html;
                    }
                });
             
                this.ui.button.on('show.bs.popover', this._onShowPopover);
            },

            _setUIAfterPopoverShow: function(){
                this.ui = _.extend(this.ui, {
                    shopsContainer: $('.popover .js-shops-container'),
                    searchInput: $('.popover .js-search-shops-input'),
                    shopItemsWrappers: $('.popover .js-shop-item'),
                    shopItems: $('.popover .js-shop-item a'),
                    alphabetFilter: $('.popover .js-alphabet-filter'),
                    alphabetSubFilter: $('.popover .js-alphabet-filter .sub-filter-trigger'),
                    filterButtons: $('.popover .js-filter-button'),
                    filterActions: $('.popover .filter-action'),
                    closeBtn: $('.popover .close')
                });
            },

            _onShowPopover: _.debounce(function(){
                this._setUIAfterPopoverShow();
                //TODO: ne raboratet
                this.ui.searchInput.on('keyup input', this._onShopsSearch);
                this.ui.filterActions.on('click', this._onFilterActionClick);
                this.ui.filterButtons.on('click', this._onFilterTypeClick);
                this.ui.alphabetSubFilter.on('click', this._onSubFilterTriggerClick);

                this._onFilterTypeClick();
                this.ui.closeBtn.on('click', this._onCloseClick);
                $(document).on('click', this._onDocumentClick)
            }, 1),

            _onShopItemClick: function(e){
                this.ui.button.popover('hide');
                $(document).off('click', this._onDocumentClick);
            },
            _onCloseClick:function(e){
                this.ui.button.popover('hide');
                $(document).off('click', this._onDocumentClick);
            },
            
            _onDocumentClick: function(e) {
                var target = $(e.target);
                var tooltip = $('.popover[role="tooltip"]');
                if (!tooltip.has($(e.target)).length && target != tooltip[0]){
                    $(document).off('click', this._onDocumentClick);
                    this.ui.button.popover('hide');
                }
            },
            _switchBreadCrumbVisible: function(value){
                if(value === 0){
                    $('#breadcrumbToShopLi').hide();
                    $('#closeShop').hide();
                }else{
                    $('#breadcrumbToShopLi').show();
                    $('#closeShop').show();
                }
            },
            _onShopsSearch: function(e){
                this._filters.searchValue = e.target.value.trim();
                this._useSearch();
            },

            _onFilterActionClick: function(e){
                var target = $(e.target);
                this.ui.filterActions.removeClass('active');
                target.addClass('active');
                this._filters.actionValue = target.text().toLowerCase();
                this._useSearch();
            },

            _onFilterTypeClick: function(e){
                var target = e ? $(e.currentTarget) : this.ui.filterButtons.filter('.active');
                this.ui.filterButtons.removeClass('active');
                target.addClass('active');
                this._filters.currentFilterType = target.data('id');
                if (this._filters.currentFilterType == 'alphabet')  {
                    this.ui.alphabetFilter.show();
                } else {
                    this.ui.alphabetFilter.hide();
                }

                this._filters.actionValue = '';
                this._useFilters();

                this.ui.shopItems.on('click', this._onShopItemClick);
            },
            //РѕР±РЅРѕРІР»СЏРµС‚ prodlist РїСЂРё РѕС‚РјРµРЅРµ С„РёР»СЊС‚СЂР° РјР°РіР°Р·РёРЅР° РІ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё РѕС‚ РїР°СЃР°Р¶РµРЅРЅРѕР№ РєР°С‚РµРіРѕСЂРёРё, РїРѕРґРєР°С‚РµРіРѕСЂРёРё РёР»Рё С‚РѕРІР°СЂР°
            _onCloseShop : function(e){
                this._switchBreadCrumbVisible(0);
                Shops.delShop();
            },

            _onSubFilterTriggerClick: function(e){
                var target = $(e.currentTarget);
                this.ui.alphabetSubFilter.removeClass('hidden');
                target.addClass('hidden');

                $('.sub-filter-block').addClass('hidden');
                target.next().removeClass('hidden');

                this._filters.actionValue = '';
                this.ui.filterActions.removeClass('active');
                this._useSearch();
            },

            _useFilters: function(){

                if (this._filters.currentFilterType == 'alphabet') {
                    var elements = _.sortBy(this.ui.shopItemsWrappers, function(item){
                        return $(item).children('a').text();
                    });
                } else {
                    elements =  _.sortBy(this.ui.shopItemsWrappers, function(item){
                        return -1 * $(item).children('a').data('rating');
                    });
                }

                this.ui.shopsContainer.html('');
                _.each(elements, function(item){
                    this.ui.shopsContainer[0].appendChild(item);
                }.bind(this));

                this.ui.shopItemsWrappers = $('.popover .js-shop-item');
                this.shopItems = $('.popover .js-shop-item a');

                this._useSearch();
            },

            _useSearch: function(){
                this.ui.shopItemsWrappers.show();

                _.each(this.ui.shopItems, function(item){
                    var _item = $(item);
                    var text = _item.text().toLowerCase();
                    if (this._filters.searchValue) {
                        if (text.indexOf(this._filters.searchValue.toLowerCase()) == -1) {
                            _item.parent().hide();
                        }
                    }
                    if (this._filters.actionValue) {
                        if (text.indexOf(this._filters.actionValue) != 0) {
                            _item.parent().hide();
                        }
                    }
                }.bind(this));
            }
        });
		
		Shops.ProducerView = Marionette.LayoutView.extend({
			template: _.template(producerTpl),
			regions: {
                shopsContainer: '#producerShopContainer'
            },
			_filters: { },
			ui: {
				shopsContainer: '#producer .js-shops-container',
				searchInput: '#producer-search-input',				
				alphabetFilter: '.js-alphabet-filter',
				alphabetSubFilter: '.sub-filter-trigger',
				filterButtons: '.js-filter-button',
				filterActions: '.filter-action',
				closeBtn: '.popover .close'
			},
			initialize: function() {
				_.bindAll(this,
                    '_onCollectionSuccessFetch',
                    '_onShopsSearch',
					'_onSubFilterTriggerClick',
					'_onFilterTypeClick',
					'_useFilters',
					'_onFilterActionClick'
                );
			},
			onRender: function(){
				var self = this;


				// TODO: Вот здесь нужна отдельная коллекция, заточенная под производителя
                App.Catalog.Model.Shops.on('sync', this._onCollectionSuccessFetch());
            },

            _onCollectionSuccessFetch:  _.debounce(function(){
				var self = this;
                _.each(App.Catalog.Model.Shops.models, function(model){
                    model.attributes.rating = Math.ceil(Math.random() * 100);
                   
                });

                this.shopsContainer.show(new ShopsContainer({
                    collection: App.Catalog.Model.Shops
                }));
				
				
				this.ui.searchInput.on('keyup', self._onShopsSearch);
                this.ui.filterActions.on('click', self._onFilterActionClick);
                this.ui.filterButtons.on('click', self._onFilterTypeClick);
                this.ui.alphabetSubFilter.on('click', self._onSubFilterTriggerClick);

                //this._onFilterTypeClick();
				
				
				
            }, 1),
			
            _onShopsSearch: function(e){
                this._filters.searchValue = e.target.value.trim();
                this._useSearch();
            },

			_onFilterTypeClick: function(e){
                var target = e ? $(e.currentTarget) : this.ui.filterButtons.filter('.active');
                this.ui.filterButtons.removeClass('active');
                target.addClass('active');
                this._filters.currentFilterType = target.data('id');
                if (this._filters.currentFilterType == 'alphabet')  {
                    this.ui.alphabetFilter.show();
                } else {
                    this.ui.alphabetFilter.hide();
                }

                this._filters.actionValue = '';
                this._useFilters();
            },

            _onFilterActionClick: function(e){
                var target = $(e.target);
                this.ui.filterActions.removeClass('active');
                target.addClass('active');
                this._filters.actionValue = target.text().toLowerCase();
                this._useSearch();
            },
			
            _onSubFilterTriggerClick: function(e){
                var target = $(e.currentTarget);
                this.ui.alphabetSubFilter.removeClass('hidden');
                target.addClass('hidden');

                $('.sub-filter-block').addClass('hidden');
                target.next().removeClass('hidden');

                this._filters.actionValue = '';
                this.ui.filterActions.removeClass('active');
                this._useSearch();
            },

            _useFilters: function(){

                if (this._filters.currentFilterType == 'alphabet') {
                    var elements = _.sortBy(this.ui.shopItemsWrappers, function(item){
                        return $(item).children('a').text();
                    });
                } else {
                    elements =  _.sortBy(this.ui.shopItemsWrappers, function(item){
                        return -1 * $(item).children('a').data('rating');
                    });
                }

                this.ui.shopsContainer.html('');
                _.each(elements, function(item){
                    this.ui.shopsContainer[0].appendChild(item);
                }.bind(this));

                this._useSearch();
            },

            _useSearch: function(){
				
				var shopItemsWrappers = $('#sellers .js-shop-item');
				var shopItems = $('#sellers .js-shop-item a');
				
                shopItemsWrappers.show();

                _.each(shopItems, function(item){
                    var _item = $(item);
                    var text = _item.text().toLowerCase();
                    if (this._filters.searchValue) {
                        if (text.indexOf(this._filters.searchValue.toLowerCase()) == -1) {
                            _item.parent().hide();
                        }
                    }
                    if (this._filters.actionValue) {
                        if (text.indexOf(this._filters.actionValue) != 0) {
                            _item.parent().hide();
                        }
                    }
                }.bind(this));
            }
			
		});

    });
});



define([
    "app",
    "model/catalog",
    "text!bundle/search/view/search.html"
], function (
    App,
    Data,
    viewSearch
) {
    "use strict";
    return App.module("Search", function (Search, App, Backbone, Marionette, $, _) {

        Search.View = Marionette.ItemView.extend({

            template: _.template(viewSearch),

            regions: {
                categoryListRegion: "#category-list"
            },

            ui: {
                searchInput: '#q-search',
                searchGroup: '.js-search-group',
                searchInShop: '#search-in-shop',
                searchEverywhere: '#search-everywhere',
                doSearch: '#do-search',
                doCategories: '#do-categories',
                clearBtn: '.js-clear-btn'
            },

            events: {
                'click @ui.doSearch': '_search',
                'click @ui.searchInShop': '_search',
                'keydown @ui.searchInput': '_searchProductKbd',
                'click @ui.doCategories': '_showCategories',
                'click @ui.clearBtn': '_clearInput'
            },

            initialize: function () {

            },

            onRender: function(){
            },

            _search: function () {
                var query = this.ui.searchInput.val();
                if ( query != '' ){
                    App.Router.navigate('catalog?q='+query, {trigger: true});
                }else{
                    App.Router.navigate('catalog', {trigger: true});
                }
            },

            _searchProductKbd: function (e) {
                if ( this.ui.searchInput.val() !='' ){
                    this.$('.clear-btn').show();
                }
                var code = e.keyCode || e.which;
                if (code == 13) {
                    this._search();
                }
            },

            _clearInput: function () {
                this.ui.searchInput.val('');
                this.$('.clear-btn').hide();
            }
        });
    });
});
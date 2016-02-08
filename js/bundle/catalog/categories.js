/**
 * Created by GOODPROFY on 30.07.2015.
 */
define([
    'app',
    'text!bundle/catalog/view/categories/item.html'
], function(
    App,
    tmplItem
){
    "use strict";
    return App.module("Catalog.Categories", function (Categories, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;
        this.onStart = function(){
            console.log('Catalog.Categories >>> Start');
            try {

                App.getMainRegion().show( new Categories.Container() );

                App.Breadcrumbs.add({url: 'catalog', title: 'Каталог товаров'});

            } catch (err) {
                console.log(err);
            }
        };

        this.onStop = function(){
            console.log('Catalog.Categories <<< Stop');
        };

        var Item = Marionette.ItemView.extend({
            tagName: "div",

            className: "catalog-collection-item",

            template: _.template(tmplItem)
        });

        this.Container = Marionette.CollectionView.extend({
            tagName: 'div',

            className: "all-catalog-wrapper",

            childView: Item,

            collection: App.Catalog.Model.Branches,

            initialize: function(){
                this.collection.on('change', "render");
            },
            onShow: function(){
                App.Catalog.Categories.stop();
            }
        });

    });
});

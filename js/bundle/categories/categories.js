define([
    "app",
    "bundle/categories/model/categories",
    "text!bundle/categories/view/categories-list.html",
    "text!bundle/categories/view/category-set.html"],
    function(App, Data, containerTpl, setTpl) {

        return App.module("Categories", function(Categories, App, Backbone, Marionette, $, _) {

            var CategorySetView = Marionette.ItemView.extend({
                tagName: "div",

                className: "catalog-collection-item",

                template: _.template(setTpl)
            });

            Categories.Container = Marionette.CollectionView.extend({
                tagName: 'div',

                className: "all-catalog-wrapper",

                childView: CategorySetView
            });
        });

    }
);

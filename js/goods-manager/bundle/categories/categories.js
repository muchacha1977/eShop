define([
    "app",
    "model/categories",
    "text!bundle/categories/view/category-set.html"],
    function(App, Data, setTpl) {

        return App.module("Categories", function(Categories, App, Backbone, Marionette, $, _) {

            var CategorySetView = Marionette.ItemView.extend({
                tagName: "div",

                className: "category-collection-item",

                template: _.template(setTpl)
            });

            Categories.View = Marionette.CollectionView.extend({
                tagName: 'div',

                className: "all-categories-wrapper",

                childView: CategorySetView
            });
        });

    }
);

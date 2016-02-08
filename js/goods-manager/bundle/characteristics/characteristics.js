define([
    "app",
    "validator",
    "bundle/categories/model/categories",
    "text!bundle/categories/view/categories.html",
    "text!bundle/categories/view/category-set.html",
    "text!bundle/categories/view/add-category-dialog.html"],
    function(App, Validator, Data, containerTpl, setTpl, addCategoryTpl) {

        return App.module("Categories", function(Categories, App, Backbone, Marionette, $, _) {            

            var CategorySetView = Marionette.LayoutView.extend({
                tagName: "li",

                ui: {
                    addBtn: '.js-add-sub',
                    removeBtn: '.js-remove'        
                },

                // TODO: Разобраться почему здесь события срабатывает дважды
                //events: {
                //    'click @ui.addBtn': '_add',
                //    'click @ui.removeBtn': '_remove'    
                //},

                regions: {
                    subCategories: '.js-subcontainer'
                },

                className: "category-item",

                template: _.template(setTpl),

                initialize: function () {
                    _.bindAll(this, '_getSubCategories', '_onCategoryAdd', '_add', '_remove');
                },

                _getSubCategories: function (callback) {
                    //TODO: Запрос на получение подкатегорий
                    this._collection = new Backbone.Collection();
                    this.subCategoriesView = new CategoriesListView({collection: this._collection});
                    this.subCategories.show(this.subCategoriesView);
                    callback();    
                },

                onRender: function () {
                    this.ui.addBtn.off('click').on('click', this._add);
                    this.ui.removeBtn.off('click').on('click', this._remove);
                },

                _add: function () {
                    console.trace();
                    var dialog = new AddCategoryView({
                        categoryId: event.currentTarget.getAttribute('data-id'),
                        callback:   this._onCategoryAdd      
                    });

                    if (!this._collection) {
                        this._getSubCategories(function () {
                            App.dialogRegion.show(dialog);
                        });                        
                    } else {
                        App.dialogRegion.show(dialog);
                    }            
                },

                _onCategoryAdd: function (category) {
                    this._collection.add(category);
                    this.subCategories.$el.addClass('has-items');
                },

                _remove: function (event) {
                    var id = event.currentTarget.getAttribute('data-id');
                    // TODO: Запрос на удаление категории
                    this.model.collection.remove(this.model);
                    this.$el.remove();                   
                }                 
            });

            var CategoriesListView = Marionette.CollectionView.extend({
                tagName: 'ul',

                className: "categories-wrapper",

                childView: CategorySetView
            });

            var AddCategoryView = Marionette.ItemView.extend({
                template: _.template(addCategoryTpl),

                ui: {
                    form: 'form',
                    input: '.js-input',
                    btn: '.js-add-btn'
                },

                events: {
                    'click @ui.btn': '_add'           
                },

                initialize: function (options) {
                    this.options = options;  
                    _.bindAll(this, '_add');      
                },

                onRender: function () {
                    this.ui.form.validator({
                        errors: {
                            delay: 300,
                            required: 'Поле должно быть заполнено'
                        }
                    });         
                },

                _add: function () {
                    var name = this.ui.input.val().trim();
                    var id = this.options.categoryId;
                    if (name) {
                        var newCategory = {
                            id: new Date().getTime(),
                            name: name,
                            nodesCount: 0,
                            characteristics: []
                        };
                        App.dialogRegion.empty();
                        this.options.callback(newCategory);  
                    }
                    //TODO: Отправка запроса на добавление категории
                    return false;  
                }        
            });

            Categories.View = Marionette.LayoutView.extend({
                template: _.template(containerTpl),

                className: "all-categories-container",

                ui: {
                    addBtn: '.js-add-category'
                },    

                events: {
                    'click @ui.addBtn': '_addCategory'
                },

                regions: {
                    container: '.js-container'        
                },

                initialize: function (options) {
                    this._collection = options._collection;   

                    _.bindAll(this, '_addCategory', '_onCategoryAdd');    
                },

                onRender: function () {
                    this.container.show(new CategoriesListView({collection: this._collection}));
                },

                _addCategory: function () {
                    var dialog = new AddCategoryView({
                        categoryId: null,
                        callback: this._onCategoryAdd        
                    });
                    App.dialogRegion.show(dialog);               
                },

                _onCategoryAdd: function (category) {
                    this._collection.add([category]);
                    this.container.show(new CategoriesListView({collection: this._collection}));                    
                }    
            });
        });
    }
);

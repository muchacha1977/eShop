define([
    "app",
    "validator",    
    "text!bundle/user-categories/view/user-categories.html",
    "text!bundle/user-categories/view/user-category-item.html",
    "text!bundle/user-categories/view/characteristic-item.html",
    "text!bundle/user-categories/view/add-user-category-dialog.html",
    "text!bundle/user-categories/view/add-characteristic-dialog.html",
    "text!bundle/user-categories/view/characteristic-dialog-item.html",
    "model/categories",
    "model/characteristics"], 
    function(App, Validator, containerTpl, categoryItemTpl, charItemTpl, addCategoryTpl, addCharTpl, charDialogItemTpl, Data) {

        return App.module("UserCategories", function(UserCategories, App, Backbone, Marionette, $, _) {  

            
            // Блок с характеристиками

            var CharView = Marionette.ItemView.extend({
                template: _.template(charItemTpl),

                ui: {
                    deleteChar: '.js-delete-char'
                },

                events: {
                    'click @ui.deleteChar': '_delete'
                },

                initialize: function (options) {
                    _.bindAll(this, '_delete');
                    this.parentView = options.parentView;
                },

                _delete: function () {
                    // TODO: Запрос на удаление (отвязки характеристики от категории)
                    var collection = this.model.collection;
                    collection.remove(this.model);
                    this.parentView.model.set('characteristics', collection.models);
                }
            });          

            var CharListView = Marionette.CollectionView.extend({                

                tagName: 'div',

                className: 'row char-wrapper',

                childView: CharView
            });

            // Конец блока с характеристиками



            // Блок - строка категории

            var CategorySetView = Marionette.LayoutView.extend({
                tagName: "li",

                ui: {
                    addBtn: '.js-add-sub',
                    removeBtn: '.js-remove',
                    addCharBtn: '.js-add-char-btn',
                    arrow: '.js-arrow'    
                },

                // TODO: Разобраться почему здесь события срабатывает дважды
                //events: {
                //    'click @ui.addBtn': '_add',
                //    'click @ui.removeBtn': '_remove'    
                //},

                regions: {
                    chars: '.js-chars-wrapper',
                    subCategories: '.js-subcontainer'
                },

                className: "category-item",

                template: _.template(categoryItemTpl),
                
                initialize: function (options) {
                    _.bindAll(this, 
                        '_renderSubCollection',
                        '_toggleSubCategories',
                        '_add', 
                        '_onCategoryAdd',
                        '_remove', 
                        '_addChar', 
                        '_onCharAdd' ,
                        '_refreshParentModel'                       
                        );
                    if (!this.model.get('characteristics')) {
                        this.model.set('characteristics', []);
                    }

                    this.parentView = options.parentView;
                    this.model.set('level', (options && options.level) ? options.level : 0);
                },                

                onRender: function () {
                    this.ui.addBtn.on('click', this._add);
                    this.ui.removeBtn.on('click', this._remove);
                    this.ui.addCharBtn.on('click', this._addChar);
                    this.ui.arrow.on('click', this._toggleSubCategories);

                    var chars = this.model.get('characteristics');
                    if (!chars) {
                        chars = [];
                    }

                    this.chars.show(new CharListView({
                        collection: new Backbone.Collection(chars),
                        childViewOptions: {
                            parentView: this
                        }
                    }));

                    this._renderSubCollection();
                },

                _renderSubCollection: function () {
                    var nodes = this.model.get('nodes');
                    if (nodes && nodes.length) {
                        this.subCategories.show(new CategoriesListView({
                            collection: new Backbone.Collection(nodes),
                            childViewOptions: {
                                level: this.model.get('level') + 2,
                                parentView: this
                            }
                        }));
                    }           
                },

                _refreshParentModel: function () {
                    if (this.parentView) {
                        var node = _.find(this.parentView.model.get('nodes'), function (_node) {
                            return _node.id == this.model.get('id');
                        }.bind(this));
                        node.nodes = this.model.get('nodes');
                        this.parentView._refreshParentModel();
                    }                    
                },

                _toggleSubCategories: function (event) {
                    var nodes = this.model.get('nodes');
                    if (nodes && nodes.length) {
                            var target = $(event.target);
                        if (target.hasClass('closed')) {
                            target.removeClass('closed glyphicon-chevron-right').addClass('glyphicon-chevron-down');                        
                            this.subCategories.$el.slideDown(300);
                        } else {
                            target.removeClass('glyphicon-chevron-down').addClass('closed glyphicon-chevron-right');
                            this.subCategories.$el.slideUp(300);
                        }
                    }                    
                },

                _add: function (event) {
                    if (this.model.get('characteristics').length) {
                        require(["bundle/modal/modal"],
                            function(Modal) {
                                new Modal.View({
                                    title: 'Невозможно добавить категорию',
                                    text: "Сначала необходимо удалить все характеристики у категории.",
                                    _template: 'dialog',
                                    yes: 'OK',
                                    no: ''
                                });
                            }
                        );
                        return false;
                    }
                    var dialog = new AddCategoryView({
                        categoryId: event.currentTarget.getAttribute('data-id'),
                        callback: this._onCategoryAdd      
                    });

                    App.dialogRegion.show(dialog);          
                },

                _onCategoryAdd: function (category) {
                    var nodes = this.model.get('nodes');
                    if (!nodes || !nodes.length) {
                        nodes = [];
                    } 

                    nodes.push(category);
                    this.model.set('nodes', nodes);
                    this._renderSubCollection();
                    this._refreshParentModel();                            

                    this.ui.arrow.removeClass('closed glyphicon-chevron-right').addClass('glyphicon-chevron-down');                        
                    this.subCategories.$el.slideDown(300);
                },

                _remove: function (event) {
                    var id = event.currentTarget.getAttribute('data-id');
                    // TODO: Запрос на удаление категории

                    var nodes = _.reject(this.parentView.model.get('nodes'), function (node) {
                        return node.id == id;
                    });
                    
                    this.parentView.model.set('nodes', nodes);

                    this.model.collection.remove(this.model);
                    this.$el.remove();  
                    this.parentView._refreshParentModel();                 
                },

                _addChar: function (event) {
                    var nodes = this.model.get('nodes');
                    if (nodes && nodes.length) {
                        require(["bundle/modal/modal"],
                            function(Modal) {
                                new Modal.View({
                                    title: 'Действие невозможно',
                                    text: "Невозможно добавить характеристики для категории, которая содержит вложенные подкатегории.",
                                    _template: 'dialog',
                                    yes: 'OK',
                                    no: ''
                                });
                            }
                        );
                        return false;
                    }
                    
                    // TODO: Запрос на получение всех характеристик
                    //Data.Characteristics.fetch({reset: true}).done(function() {
                    //
                    //}) 
                    Data.Characteristics.reset([
                        {
                            id: '1',
                            name: 'Производитель',
                            dimension: 'Текстовое поле'
                        },
                        {
                            id: '2',
                            name: 'Цена',
                            dimension: 'Текстовое поле'
                        },
                        {
                            id: '3',
                            name: 'Мощность',
                            dimension: 'л/с'
                        },
                        {
                            id: '4',
                            name: 'Цвет',
                            dimension: 'Текстовое поле'
                        }
                    ]);

                    var currentChars = this.chars.currentView ? this.chars.currentView.collection.models : []
                    var currentCharsIds = _.map(currentChars, function (char) {
                        return char.id;
                    });

                    _.each(Data.Characteristics.models, function (model) {                        
                        if (_.indexOf(currentCharsIds, model.get('id')) != -1) {
                            model.set('disabled', true);
                        } 
                    });

                    var dialog = new AddCharView({
                        callback: this._onCharAdd
                    });
                    App.dialogRegion.show(dialog);  
                },

                _onCharAdd: function (chars) {
                    var _models = _.union((this.chars.currentView ? this.chars.currentView.collection.models : []), chars);
                    this.model.set('characteristics', _models);

                    this.chars.show(new CharListView({
                        collection: new Backbone.Collection(_models),
                        childViewOptions: {
                            parentView: this
                        }
                    }));
                }              
            });

            var CategoriesListView = Marionette.CollectionView.extend({
                tagName: 'ul',

                className: "categories-wrapper",

                childView: CategorySetView
            });
            // Конец блока - строки категории



            // Диалог добавления категории

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

            // Конец диалога добавления категории
            

            // Диалог добавления характеристики

            var DialogCharItemView = Marionette.ItemView.extend({
                template: _.template(charDialogItemTpl)
            });

            var DialogSelectCharsView = Marionette.CollectionView.extend({
                tagName: 'div',
                className: 'char-item js-char-item',
                collection: Data.Characteristics,
                childView: DialogCharItemView
            });

            var AddCharView = Marionette.LayoutView.extend({
                template: _.template(addCharTpl),

                ui: {
                    addBtn: '.js-add-btn'        
                },

                events: {
                    'click @ui.addBtn': '_add'    
                },

                regions: {
                    charsSelect: '.js-chars-select'
                },

                initialize: function (options) {
                    this.options = options;
                    _.bindAll(this, '_add');
                },

                onRender: function () {
                    this.charsSelect.show(new DialogSelectCharsView());
                },

                _add: function () {
                    var chars = [];
                    _.each(this.charsSelect.$el.find('input[type="checkbox"]'), function (checkbox) {
                        if (checkbox.checked) {
                            chars.push({
                                id: checkbox.getAttribute('data-id'),
                                name: checkbox.getAttribute('data-name'),
                                dimension: checkbox.getAttribute('data-dimension')
                            })
                        }
                    });

                    if (chars.length) {
                        this.options.callback(chars);
                        App.dialogRegion.empty();
                        return;
                    }
                    return false;
                }
            });

            // Конец диалога добавления характеристики



            // View страницы

            UserCategories.View = Marionette.LayoutView.extend({
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

                initialize: function () {
                    _.bindAll(this, '_addCategory', '_onCategoryAdd');    
                },

                onRender: function () {
                    this.container.show(new CategoriesListView({collection: Data.CategoriesWithChars}));
                },

                _addCategory: function () {
                    var dialog = new AddCategoryView({
                        categoryId: null,
                        callback: this._onCategoryAdd        
                    });
                    App.dialogRegion.show(dialog);               
                },

                _onCategoryAdd: function (category) {
                    Data.CategoriesWithChars.add([category]);
                    this.container.show(new CategoriesListView({collection: Data.CategoriesWithChars}));                    
                }    
            });

            // Конец View страницы

        });
    }
);

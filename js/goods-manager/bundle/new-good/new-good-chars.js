define([
	"app",
  "validator", 
	"text!bundle/new-good/view/new-good-chars.html", 
  "text!bundle/new-good/view/current-category-chars.html", 
  "text!bundle/new-good/view/add-characteristic-dialog.html",
  "text!bundle/new-good/view/characteristic-dialog-item.html",
	"bundle/new-good/model/new-good",
  "bundle/characteristics/model/characteristics"
  ], 
	function(App, Validator, newGoodCharsTpl, categoryCharsTpl, addCharTpl, charDialogItemTpl, Data) {
    return App.module("NewGoodChars", function(NewGoodChars) {

        var CategoryView = Marionette.ItemView.extend({
            tagName: "div",

            ui: {
              chars: '.js-char-item'
            },

            events: {
              'keyup @ui.chars': '_onCharKeyup'
            },

            model: Data.NewGoodCurrentCategory,           

            className: "new-good-char-collection-item",

            template: _.template(categoryCharsTpl),

            initialize: function () {
              _.bindAll(this, '_onCharKeyup');
            },

            _onCharKeyup: function (event) {
              var target = event.target;
              var char = _.find(this.model.attributes.characteristics, function (char) {
                return char.id == target.getAttribute('data-id');
              });
              char.value = target.value.trim();
            }
        });


        NewGoodChars.View = Marionette.LayoutView.extend({
            template: _.template(newGoodCharsTpl),

            model: Data.NewGood,

            regions: {
           		currentCategory: '.js-current-category' 		
            },

           	ui: {
              addCharsBtn: '.js-add-chars',
              backBtn: '.js-back',
              saveBtn: '.js-save'
           	},

           	events: {
              'click @ui.addCharsBtn': '_addChar',
           		'click @ui.backBtn': '_back',
              'click @ui.saveBtn': '_save'
           	},

            initialize: function() {
              _.bindAll(this, '_addChar', '_onCharAdd', '_back', '_save');
              if (!this.model.get('name')) {
                return App.Router.navigate('new-good', {trigger: true});
              }           
            },

            onRender: function() {
              this.currentCategory.show(new CategoryView());
            },

            _back: function() {
              App.Router.navigate('new-good', {trigger: true});
              return false;
            },

            _save: function() {
              this.model.set('characteristics', Data.NewGoodCurrentCategory.get('characteristics'));
              
              // TODO: Сохранение на сервере нового товара
              this.model.set(this.model.defaults);
              localStorage.setItem('newGoodFlag', 1);
              App.Router.navigate('good-saved', {trigger: true});
              return false;
            },

            _addChar: function (event) {                    
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

              var currentChars = Data.NewGoodCurrentCategory.get('characteristics') || [];
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

              return false;
            },

            _onCharAdd: function (chars) {
                var currentChars = Data.NewGoodCurrentCategory.get('characteristics') || [];
                var _models = _.union(currentChars, chars);
                Data.NewGoodCurrentCategory.set('characteristics', _models);

                this.currentCategory.show(new CategoryView());
            }
        });

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
    });
});

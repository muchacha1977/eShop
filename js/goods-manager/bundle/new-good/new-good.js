define([
	"app",
  "validator", 
	"text!bundle/new-good/view/new-good.html",
  "text!bundle/new-good/view/category-item.html", 
  "model/categories",
	"bundle/new-good/model/new-good",

  "lib/fileuploader/vendor/jquery.ui.widget",
  "lib/fileuploader/jquery.iframe-transport",
  "lib/fileuploader/jquery.fileupload"  
  ], 
	function(App, Validator, newGoodTpl, categoryItemTpl, Data) {
    return App.module("NewGood", function(NewGood) {

        var CategoryItemView = Marionette.ItemView.extend({
            tagName: "div",

            ui: {
              names: '.js-category-name',
              items: '.js-category-item'
            },

            events: {
              'click @ui.items': '_onCategoryClick'
            },

            className: "new-good-collection-item",

            template: _.template(categoryItemTpl),

            initialize: function (options) {
              this.options = options;
              _.bindAll(this, '_onCategoriesFetch', '_onCurrentCategoryFetch');
            },

            _onCategoryClick: function(event) {
              this.currentId = event.currentTarget.getAttribute('data-id');
              Data.Categories.id = this.currentId;
              Data.Categories.fetch({reset: true}).done(this._onCategoriesFetch);              
            },

            _onCategoriesFetch: function (result) {
              if (result.length) {
                this.options.parent.render();    
              } else {
                Data.NewGood.set('categoryId', this.currentId);
                Data.NewGoodCurrentCategory.set('id', this.currentId);

                Data.NewGoodCurrentCategory.fetch({reset: true}).done(this._onCurrentCategoryFetch)
              
                // TODO: Перенести это в _onCurrentCategoryFetch когда будет готов rest
                Data.NewGoodCurrentCategory.set('name', 'Какая-то категория');
                Data.NewGoodCurrentCategory.set('characteristics', [
                    {
                      id: '123454321',
                      name: 'Вес',
                      dimension: 'тонны'   
                    },
                    {
                      id: '99999999',
                      name: 'Мощность двигателя',
                      dimension: 'л/с'
                    }
                  ]);
                $('#js-categories-modal').modal('hide');                
                App.Router.navigate('new-good-chars', {trigger: true});
              }   
            },

            _onCurrentCategoryFetch: function (result) {
              console.log(result);
            }
        });


        var CategoriesListView = Marionette.CollectionView.extend({
        	tagName: 'div',

        	collection: Data.Categories,

          childView: CategoryItemView,

          initialize: function () {
            this.childViewOptions = {
              parent: this
            }
          }
        });


        NewGood.View = Marionette.LayoutView.extend({
            template: _.template(newGoodTpl),

            model: Data.NewGood,

            regions: {
           		categoriesList: '#js-categories-list' 		
            },

           	ui: {
              form: '.js-new-good-form',
           		fields: '.js-field',
           		addImgInput: '#js-add-img input',
           		showCategories: '#js-good-category',
              categoriesModal: '#js-categories-modal',
              searchCategoriesInput: '.js-search-category'
           	},

           	events: {
           		'input @ui.fields': '_setValue',
              'keyup @ui.fields': '_setValue',
              'change @ui.fields': '_setValue',
           		'click @ui.showCategories': '_showCategories',
              'keyup @ui.searchCategoriesInput': '_searchCategory'
           	},

           	hasModal: false,

           	initialize: function() {
           		_.bindAll(this, 
                '_setValue', 
                '_showCategories', 
                '_onFetchCategories', 
                '_searchCategory', 
                '_enableCategoryButton',
                '_fileUpload',
                '_onFileUploadSuccess',
                '_onFileUploadFail'
              );

           		this.render();
           	},

           	onRender: function() {
              this.ui.form.validator({
                errors: {
                  delay: 300,
                  required: 'Поле должно быть заполнено'
                }
              });
              this._enableCategoryButton();
              this._fileUpload();    
           	},

           	_setValue: function(event) {
           		var target = event.currentTarget;
              var name = target.name == 'barcode' ? 'barCode' : target.name;
           		this.model.set(name, target.value.trim());		
              this._enableCategoryButton();
           	},

            _enableCategoryButton: function() {
              if (this.model.get('name') && this.model.get('barCode') && this.model.get('description')) {
                this.ui.showCategories.removeClass('disabled').removeAttr('disabled');
              } else {
                this.ui.showCategories.addClass('disabled').attr('disabled', 1);
              }
            },

           	_showCategories: function() {
              Data.Categories.id = null;
           		if (!this.hasModal) {
           			Data.Categories.fetch({reset: true}).done(this._onFetchCategories)		
           		} else {
                this.ui.categoriesModal.modal('show'); 
           		}  
              return false;		
           	},

           	_onFetchCategories: function(result, status) {
           		this.hasModal = true;
              this.categoriesList.show(new CategoriesListView());              
              this.ui.categoriesModal.modal();  
           	},

            _searchCategory: function(event) {
              var value = event.target.value.toLowerCase().trim();
              this.categoriesList.currentView.children.each(function(view){
                if (!value || view.ui.names.text().toLowerCase().indexOf(value) != -1) {
                  view.$el.show();
                } else {
                  view.$el.hide();
                }
              });
            },

            _fileUpload: function() {
              this.ui.addImgInput.fileupload({
                  url: 'rest/v0/offer/l',
                  add: function (event, data) {
                      data.submit();
                  },
                  done: this._onFileUploadSuccess,
                  fail: this._onFileUploadFail
              });
            },

            _onFileUploadSuccess: function(e, data) {
                require(["bundle/modal/modal"], function (Modal) {
                    if (data._response.jqXHR.status == 200) {
                        var result = data._response.result;
                        console.log(result);
                    } else {
                        new Modal.View({
                            text: '<h5>Файл не был загружен на сервер</h5>',
                            _template: "message",
                            _static: false
                        });
                    }
                }.bind(this));
            },

            _onFileUploadFail: function(e, data) {
                require(["bundle/modal/modal"], function (Modal) {
                    var responseJSON = data.response().jqXHR.responseJSON || {};
                    var errMessage = responseJSON.message || data.errorThrown;
                    new Modal.View({
                        text: '<h5>Файл не был загружен (' + errMessage + ')</h5>',
                        _template: "message",
                        _static: false
                    });
                });
            }
        });
        
    });
});

define(['app',
        'validator', 
        'bundle/modal/modal',
        'text!bundle/good/view/good.html',
        'text!bundle/good/view/characteristic-item.html',
        "text!bundle/new-good/view/add-characteristic-dialog.html",
        "text!bundle/new-good/view/characteristic-dialog-item.html",
        'bundle/good/model/good',
        "bundle/characteristics/model/characteristics",

        "lib/fileuploader/vendor/jquery.ui.widget",
        "lib/fileuploader/jquery.iframe-transport",
        "lib/fileuploader/jquery.fileupload"
    ],
    function (App, Validator, Modal, goodTpl, charItemTpl, addCharTpl, charDialogItemTpl, Data) {

        return App.module('Good', function (Good, App, Backbone, Marionette, $, _) {

            var GoodCharItem = Marionette.ItemView.extend({
                template: _.template(charItemTpl),

                ui: {
                    chars: '.js-char-item'
                },

                events: {
                    'input @ui.chars': '_onCharChange',
                    'keyup @ui.chars': '_onCharChange',
                    'paste @ui.chars': '_onCharChange'
                },

                initialize: function () {
                    _.bindAll(this, '_onCharChange');
                },

                _onCharChange: function (event) {
                    var target = event.target;
                    this.model.set('value', target.value.trim());
                } 
            });    

            var GoodCharsList = Marionette.CollectionView.extend({
                tahName: 'div',

                className: 'form-group clearfix',

                childView: GoodCharItem,

                collection: Data.GoodCharacteristics
            });

            Good.View = Marionette.LayoutView.extend({
                template: _.template(goodTpl),

                className: 'edit-good',

                model: Data.Good,

                ui: {
                    form: '.js-good-form',
                    fields: '.js-field',
                    addImgInput: '#js-add-img input',
                    deleteImgBtn: '.js-delete-img',
                    addCharsBtn: '.js-add-chars',
                    saveBtn: '.js-save',
                    backBtn: '.js-back'
                },

                events: {
                    'input @ui.fields': '_setValue',
                    'keyup @ui.fields': '_setValue',
                    'paste @ui.fields': '_setValue',                    
                    'click @ui.deleteImgBtn': '_deleteImg',
                    'click @ui.addCharsBtn': '_addChar',
                    'click @ui.saveBtn': '_save',
                    'click @ui.backBtn': '_back'
                },

                regions: {
                    chars: '.js-chars-container'
                },

                initialize: function () {
                    _.bindAll(this, '_setValue', '_deleteImg', '_onCharAdd', '_back', '_save');
                    this.model.set('categoryName', 'Категория_ответ_от_сервера');                    
                },


                onRender: function() {
                    this.ui.form.validator({
                        errors: {
                            delay: 300,
                            required: 'Поле должно быть заполнено'
                        }
                    });
                    this.chars.show(new GoodCharsList());
                    this._enableCategoryButton();
                    this._fileUpload();    
                },

                _setValue: function(event) {
                    var target = event.currentTarget;
                    var name = (target.name == 'barcode' ? 'barCode' : target.name);
                    this.model.set(name, target.value.trim());      
                    this._enableCategoryButton();
                },

                _enableCategoryButton: function() {
                    if (this.model.get('name') && this.model.get('barCode') && this.model.get('description')) {
                        this.ui.saveBtn.removeClass('disabled').removeAttr('disabled');
                    } else {
                        this.ui.saveBtn.addClass('disabled').attr('disabled', 1);
                    }
                },

                _deleteImg: function (event) {
                    var target = event.target;
                    this.model.attributes.media.splice(_.indexOf(this.model.get('media'), target.getAttribute('data-media')), 1);
                    $(target.parentNode).remove();
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

                    var currentChars = Data.GoodCharacteristics.models || [];
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
                    var currentChars = Data.GoodCharacteristics.models || [];
                    var _models = _.union(currentChars, chars);
                    Data.GoodCharacteristics.set(_models);
                },               

                _back: function() {
                    window.history.back();
                    return false;
                },

                _save: function() {
                    this.model.set('characteristics', _.map(Data.GoodCharacteristics.models, function (model) {
                        return model.attributes;
                    }));
                    // TODO: Сохранение на сервере нового товара
                    console.log(this.model);
                    return false;
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
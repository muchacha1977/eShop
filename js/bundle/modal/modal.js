/**
 * Modal v.0.0.2
 *
 * @example
    require(["bundle/modal/modal"],
        function(Modal) {
            App.Wreqr.setHandler("modal:yes", function(){
            console.log("Yes");
            });
            App.Wreqr.setHandler("modal:no", function(){
            console.log("No");
            });
            new Modal.View({text: "Очистить корзину?", yes:"Да!!!", no: "No"});
        }
    );
 *
 * @commands
     modal:yes - сработает по кнопке Yes
     modal:no - сработает по кнопке No
     modal:close - сработает по нажатию на крестик шаблона message
     modal:on:close - сработает после закрытия окна
 *
 * @var
    title:      Заголовок
    text:       Любой текст, включая HTML
    yes:        текст кнопки Yes || "" - не выведет кнопку
    no:         текст пнопки No || "" - не выведет кнопку
    classYes:   "btn-default" Можно переписать классы className для Yes
    classNo:    "btn-link" Можно переписать классы className для No
    _static:    true || false Запретить закрытие по клику на фоне
    _template:
                modal - маленькое окно, текст + 2 кнопки
                blank - пустой шаблон, выводит text
                dialog - большое окно, заголовок + текст + 2 кнопки
                message - Окно заголовок + крестик
    _focus:     yes || no || null на какой кнопке установить фокус
    _modalSize: md,lg,sm,xs  class="modal-md",
    _centerBtn: true || false - Центрировать кнопки
 *
 *
 */
define([
        "app",
        "text!bundle/modal/view/modal.html",
        "text!bundle/modal/view/message.html",
        "text!bundle/modal/view/dialog.html",
        "text!bundle/modal/view/blank.html"
    ],
    function (
        App,
        viewModal,
        viewMessage,
        viewDialog,
        viewBlank
    ) {

        return App.module("Modal", function(Modal, App, Backbone, Marionette, $, _) {

            Modal.View = Marionette.ItemView.extend({
                template : _.template(viewModal),

                options: {
                    title:  "Вам сообщение",
                    text:   "Вы уверены?",
                    yes:    "Да",
                    no:     "Нет",
                    classYes: "btn-default",
                    classNo: "btn-link",
                    _static: true,
                    _template: "modal",
                    _focus: "yes",
                    _modalSize: "md",
                    _centerBtn: false
                },

                events:{
                    'click .yes':'yes',
                    'click .no':'no',
                    'click .close': 'onClose'
                },

                onRender: function(){
                    var self = this;
                    if ( this.options._static )
                        $('.modal').modal({
                            backdrop: 'static'
                        });
                    $('.modal').on('hidden.bs.modal', function (e) {
                        self.commands.execute("modal:on:close");
                        self.destroy();
                    });
                },
                templateHelpers: function(){
                    return this.options;
                },
                initialize: function(options){
                    this.commands = App.Wreqr;
                    this.options = $.extend({},this.options, options);

                    switch(this.options._template){
                        case 'message':
                            this.template = _.template(viewMessage);
                            break;
                        case 'dialog':
                            this.template = _.template(viewDialog);
                            break;
                        case 'blank':
                            this.template = _.template(viewBlank);
                            break;
                        default:
                            this.template = _.template(viewModal);
                            break;
                    }

                    this.render();
                    App.dialogRegion.show(this);
                },

                yes:function(){
                    this.commands.execute("modal:yes");
                    this.close();
                },

                no:function(e){
                    this.commands.execute("modal:no");
                    this.close();
                },

                close:function(){
                    $('.modal').modal('hide');
                },
                onClose: function(){
                    this.commands.execute("modal:close");
                }
            });

        });
    }
);



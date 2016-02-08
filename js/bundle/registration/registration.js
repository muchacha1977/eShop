/**
 * Регистрация
 * @version 0.0.5
 *
 * @example <a href="#registration">Регистрация</a>
 * @example require(["bundle/registration/registration"], function(Registration) {  App.getRegion("dialogRegion").show(new Registration.AppLayoutView()); });
 */
define([
        "app",
        "model/user",
        "text!bundle/registration/view/registration.html",
        "serializejson"
    ],
    function (App, Data, registration) {
        return App.module("Registration", function(module, App, Backbone, Marionette, $, _) {
            'use strict';
            module.AppLayoutView = Marionette.LayoutView.extend({
                tagName: 'div',
                id: 'RegistrationLayoutView',
                template: _.template(registration),

                regions: {
                    'contentRegion' : '#registrationContent'
                },

                action: null,

                events: {
                    'click .registration' : 'onNavRegClicked',
                    'click .GoodprofyRegistrationSubmit' : 'onRegSubmit'
                },
                initialize: function(options){
                    options || (options = {});
                    if ( typeof options.action !== 'undefined' ){
                        this.action = options.action;
                    }
                },

                onRender: function() {
                    $('.modal').modal({ backdrop: 'static'})
                        .on('hidden.bs.modal', function () {
                            if ( Backbone.history.getFragment() == 'registration' ){
                                App.navigate('home', true);
                            }
                        });
                },

                onShow: function(){
                    this.contentRegion.show(new module.RegistrationLayoutView({action: this.action}));
                }
            });
            module.ChildLayoutView = Marionette.ItemView.extend({
                tagName: 'div',
                id: 'ChildRegistrationLayoutView',
                template: '#blank-Modal',
                events: {
                    'click a': 'changeBg'
            }
            });   
            module.formToJson = function (form){
                var data = {};
                $(form).find("input")
                    //.filter(":visible")
                    .filter(":enabled")
                    .each(function(i, inp) {
                        switch (inp.type) {
                            case "radio":
                                if (inp.checked) {
                                    data[inp.name] = inp.value;
                                }
                                break;
                            case "checkbox":
                                data[inp.name] = inp.checked;
                                break;
                            case "button":
                                break;
                            default:
                                data[inp.name] = inp.value;
                        }
                    });
                return JSON.stringify(data);
            };
           
            module.RegistrationLayoutView = Marionette.ItemView.extend({
                tagName: 'div',
                id: 'RegistrationLayoutView',
                childView: undefined,
                className: 'RegistrationLayoutView',
                template: '#template-RegistrationLayoutView',
                ui: {
                     "passwordField": "#inputPasswordCustumer",
                     "passwordCheckbox": "#showPasswordCheckbox",
                     "passwordRepeat": "#inputPasswordCustumerRepeat",
                     "termAcceptedCehckbox" : "#termsAccepted",
                      "closeBtnNestedModal": "#btnNestedModal",
                      "dialogNestedmodal": "#modal2",
                      "dialogModal": "#modalFirst",
                      "referCode" : "#myReferInput"
                      
                },
                events:{
                    'click #registration-customer': 'onRegistrationStep2CutomerNavigated',
                    'click #registration-seller': 'onRegistrationStep2SellerNavigated',
                    'click #registration-back': 'onBack',
                    'submit form' : 'onSubmit',
                    'click #registration-cabinet':'nav2cabinet',
                    'click #registration-catalog':'nav2catalog',
                    'click #showPasswordCheckbox':'onCheckboxClick',
                    'click #btnNestedModal' : 'closeModalShow',
                    'click #referId' : 'showMyRefer'
                    

                },
                initialize: function(options) {
                    this.childView = new module.ChildLayoutView(options);
                    this.action = options.action;
                    if ( this.action == 'trader' ){
                        this.onRegistrationStep2SellerNavigated();
                    }
                    if ( this.action == 'buyer' ){
                        this.onRegistrationStep2CutomerNavigated();
                    }


                },
    
                onRender: function(){
                    this.$("input[name=phone]").mask("+9999999999?99999999999999999999", {placeholder:""});
                    self.$('#registration-form-status').hide();
                },
                onShow: function(){
                    self.$('#registration-form-status').hide();
                },
                onRegistrationStep2CutomerNavigated: function() {
                    this.template = '#template-RegistrationLayoutViewStep2Custumer';
                    this.render();
                },

                onRegistrationStep2SellerNavigated: function() {
                    this.template = '#template-RegistrationLayoutViewStep2Seler';
                    this.render();
                },
                onBack: function(){
                    this.template = '#template-RegistrationLayoutView';
                    this.render();
                },
                nav2cabinet: function(){
                    $('.modal').modal('hide')
                        .on('hidden.bs.modal', function () {
                            if ( App.User.isTrader() ){
                                App.navigate('trader/profile',true);
                            }else{
                                App.navigate(App.User.get('roles')[0],true);
                            }

                        });
                },
                showMyRefer:function(){
                    var currentReferInput = this.$('#myReferInput').val();
                    self.$('#referStatusNick').text("");
                    if ( this.$('#myReferInput').val().length>0) {
                        var Client = Backbone.Model.extend({
                            defaults: {
                                id: '3456',
                                nick: "Ivan3"
                            },
                        });
                        var ClientCollection = Backbone.Collection.extend({

                        defaults: {
                            model: Client
                        },
                        model: Client,
                        url: 'js/bundle/registration/mock/referalcode.json',

                        parse: function(response){
                           return response.items;
                        }});
                                                       
                        this.collection = new ClientCollection();

                        this.collection.fetch({reset: true}).done(function(collection){

                        console.log("collection" + JSON.stringify(collection) + " currentReferInput " + currentReferInput);

                        var acceptId = _.findWhere(collection, {id: currentReferInput});

                        if ( acceptId!=undefined && acceptId.nick!=undefined && acceptId.nick.length>0){
                             console.log("acceptId.nick = " + JSON.stringify(acceptId.nick));
                             self.$('#referStatusNick').text("Мой реферер: " + acceptId.nick);
                        } else{
                              self.$('#referStatusNick').text("Введите правильный код реферерa");
                        }    
   
                        });
                           
                    }else{
                        self.$('#referStatusNick').text("Введите правильный код реферерa ");
                        
                    }

                    
                },
                nav2catalog: function(){
                    $('.modal').modal('hide')
                        .on('hidden.bs.modal', function () {
                            Backbone.history.navigate('#categories',true);
                        });
                },
                onCheckboxClick: function(){
                    var inputPassword = $(this.ui.passwordField);
                    var inputPasswordRepeat = $(this.ui.passwordRepeat);
                    var checkBox = $(this.ui.passwordCheckbox); 
                    if ( checkBox.prop('checked') == true ){
                        checkBox.val(1);
                        inputPassword.attr("type", "text");
                        inputPasswordRepeat.attr("type", "text");
                        
                    } else {
                         checkBox.val(0);
                         inputPassword.attr("type", "password");
                         inputPasswordRepeat.attr("type", "password");
                    }
                   
                },
                onSubmit: function(){
                    console.log("onSubmit!");
                    var self = this;
                    var statusClass = {
                        s: "has-success",
                        w: "has-warning",
                        e: "has-error"
                    };

                    this.$('.input-group')
                        .removeClass(statusClass.e)
                        .removeClass(statusClass.w)
                        .removeClass(statusClass.s);

                    this.$('.help-block').text('');

                    if ( this.$('#termsAccepted').prop('checked') == true ){
                        this.$('#termsAccepted').val(1);

                    }else{
                        this.$('#termsAccepted').val(0);
                    }


                    var _regModel = Backbone.Model.extend({
                        validate: function(attrs) {
                            self.$('#registration-form-status').hide();
                            if ( attrs.shopName.length < 2 ) {

                                return self.$('#shopNameStatus')
                                    .text('Напишите название магазина полностью')
                                    .parent().find('.input-group').addClass(statusClass.e);
                            }

                            if ( attrs.firstName.length < 2 ) {

                                return self.$('#firstNameStatus')
                                    .text('Напишите Ваше имя полностью')
                                    .parent().find('.input-group').addClass(statusClass.e);
                            }

                            var regPhone = /\d+/;
                            if ( !regPhone.test(attrs.phone) ) {
                                return self.$('#phoneStatus')
                                    .text('Напишите Ваш телефон правильно')
                                    .parent().find('.input-group').addClass(statusClass.e);
                            }

                            var regEmail = /^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/;
                            if (!regEmail.test(attrs.email)) {
                                return self.$('#emailStatus')
                                    .text('Напишите Ваш E-mail правильно')
                                    .parent().find('.input-group').addClass(statusClass.e);
                            }

                            //var password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/; //Используйте цифры, латинские алфавит верхнего и нижнего регистра.

                            if ( attrs.password.length < 6 ) {
                                return self.$('#passwordStatus')
                                    .text('Сделайте пароль надежнее(Не менее 6 символов)')
                                    .parent().find('.input-group').addClass(statusClass.e);
                            }
                            if (  attrs.passwordRepeat.length < 6 ) {
                                return self.$('#passwordStatusRepeat')
                                    .text('Сделайте пароль надежнее(Не менее 6 символов)')
                                    .parent().find('.input-group').addClass(statusClass.e);
                            }  
                            if (attrs.password.localeCompare(attrs.passwordRepeat)!= 0 ){
                                 return self.$('#passwordStatus')
                                    .text('Пароль и пароль повторнo должны совпадать!')
                                    .parent().find('.input-group').addClass(statusClass.e);

                            }
                            if ( attrs.role != 'trader' ){
                                var referCode = /\d+/;
                                if ( attrs.myRefer.length>0 && !referCode.test(attrs.myRefer) ) {
                                    return self.$('#referStatus')
                                        .text('Напишите Код реферера правильно')
                                        .parent().find('.input-group').addClass(statusClass.e);
                                }
                            }


                        },
                        url: 'rest/v0/user/register'
                    });

                    var regModel = new _regModel();
                    var data = this.$('form').serializeJSON();

                    if ( data.phone.charAt(0) == "+" ){
                        data.phone = data.phone.substr(1);
                    }

                    regModel.save(data,{
                            error: function(model, xhr){

                                console.log(xhr);
                                var values = [];
                                _.each(xhr.responseJSON, function(error){
                                    console.log(error);
                                    var i = error.path.lastIndexOf(".");
                                    var name = error.path.substring(i + 1);
                                    values.push(error.invalidValue);
                                    self.$('#'+ name +'Status').parent().find('.input-group').addClass(statusClass.e);

                                });
                                if ( xhr.status == 400 ){
                                    self.$('#registration-form-status p').text('Пользователь с такими данными '+values.join()+' уже зарегистрирован.');
                                }else{
                                    self.$('#registration-form-status p').text('Ошибка сервера, пожалуйста повторите попытку.');
                                }
                                self.$('#registration-form-status').show();

                            },

                            success : function (model, response) {
                                var tmp = {
                                    "first_name": model.get('firstName'),
                                    "last_name": model.get('lastName')
                                };
                                data = $.extend(tmp,response);
                                self.onSuccess(data);
                            }
                        }
                    );
                    return false;
                },

                onSuccess: function(data) {
                    App.User.set(data);
                    localStorage.setItem('Token', App.User.get('token'));
                    this.template = '#template-RegistrationLayoutViewStep3';
                    this.render();
                }

            });

        });
    }
);



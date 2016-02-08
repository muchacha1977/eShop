/**
 * Авторизация
 * @version 0.0.3
 *
 * @example <a href="#login">Войти</a> или <button class="authentication">Войти</button>
 */
define([
        "app",
        "model/user",
        "text!bundle/authentication/view/login.html"
    ],
    function (App, Data, login) {
        "use strict";
        App.module("Authentication", function(Authentication, App, Backbone, Marionette, $, _) {

            Authentication.View = Marionette.ItemView.extend({
                template: _.template(login),

                ui: {
                  "wrapper": "#login-form-wrapper",
                  "form": "#login-form-wrapper form",
                  "isPhone": "#login-form-phone",
                  "isEmail": "#login-form-email",
                  "inpName": "#login-form-name",
                  "inpPass": "#login-form-password",
                  "inpRemind": "#loging-form-remind",
                  "remind": "#login-form-remind",
                  "restoreSubmit": "#vent-login-form-action-remind",
                  "actionLoginWrapper": "#login-form-action-login",
                  "actionRemindWrapper": "#login-form-action-remind",
                  "actionLoginBack": "#login-form-action-remind-back",
                  "actionRegistration": "#registration",
                  "status": "#login-form-status",
                  "glyphicon": "#glyphicon",
                  "btnModal": ".btn-modal",
				  "producerLogin"	: "#producerLogin",

                    // TODO remove this
                   testBuyer: "#test-buyer",
                   testShop: "#test-shop",
                   testProducer: "#test-producer"
                },

                events: {
                    "submit form" : "loginSubmit",
                    "click @ui.isPhone": "isPhoneClicked",
                    "click @ui.isEmail": "isEmailClicked",
                    "click @ui.remind": "remind",
                    "click @ui.restoreSubmit": "restore",
                    "click @ui.actionLoginBack": "actionLoginBack",
                    "click @ui.actionRegistration": "registration",
                    "click @ui.btnModal": "modalShow",
                    "click @ui.producerLogin": "_onProducerLogin",

                    // TODO remove this
                    "click @ui.testBuyer": "fillTestBuyer",
                    "click @ui.testShop": "fillTestShop",
                    "click @ui.testProducer": "fillTestProducer"

                },
				
				_onProducerLogin: function() {
					require(['bundle/authentication/producer-login'], function(ProducerLogin){
						App.mainRegion.show(
								new ProducerLogin.View
								);
					});
					
				},
				
                isPhoneClicked: function(e){
                     console.log("isPhoneClicked");
                    if ( !$(this.ui.isPhone).hasClass('active') ){
                        $(this.ui.isPhone).addClass('active');
                        $(this.ui.inpName).val("");
                        $(this.ui.inpName).attr('placeholder','+7 Телефон без скобок');
                        $(this.ui.isEmail).removeClass('active');
                        $(this.ui.glyphicon)
                            .removeClass('glyphicon-envelope')
                            .addClass('glyphicon-earphone');
                        this.ui.status.hide();
                    }
                },

                isEmailClicked: function(e){
                    console.log("isEmailClicked");
                    if ( !$(this.ui.isEmail).hasClass('active') ){
                        $(this.ui.isEmail).addClass('active');
                        $(this.ui.inpName).val("");
                        $(this.ui.inpName).attr('placeholder','mail@example.com');
                        $(this.ui.isPhone).removeClass('active');
                        $(this.ui.glyphicon)
                            .removeClass('glyphicon-earphone')
                            .addClass('glyphicon-envelope');
                        this.ui.status.hide();
                    }
                },


                onRender: function(e) {

                    $(this.ui.isPhone).addClass('active');
                    this.ui.status.hide();
                    $(this.ui.inpName).attr('placeholder','+7 Телефон без скобок');
                    $(this.ui.isEmail).removeClass('active');
                    $(this.ui.glyphicon)
                        .removeClass('glyphicon-envelope')
                        .addClass('glyphicon-earphone');
                    $(this.ui.actionRemindWrapper).hide();

                    $('.modal').on('hidden.bs.modal', function () {
                        if ( Backbone.history.getFragment() == 'login' ){
                            App.navigate('home', true);
                        }
                    });

                },

                loginSubmit: function(e) {
                    this.ui.status.hide();
                    var self = this;
                    var form = this.$("form");

                    var url = "rest/v0/user/login";
                    var data = this.formToJson(form);
                    data = JSON.parse(data);
                    if ( data.name.charAt(0) == "+" ){
                        data.name = data.name.substr(1);
                    }
                    data = JSON.stringify(data);
                    console.log(data);

                    $.ajax({
                        url : url,
                        type : "POST",
                        headers: {"Content-Type" : "application/json"},
                        dataType : "json",
                        data : data,
                        success : function (data) {
                            self.onSuccess(data);
                        },
                        error : function(xhr, status, thrown) {
                            self.onError(xhr.status, xhr.responseText)
                        }
                    });

                    return false;
                },

                remind: function(e){
                    console.log("remind!");
                    $(this.ui.actionLoginWrapper).hide();
                    $(this.ui.actionRemindWrapper).show();

                    $(this.ui.inpPass)
                        .attr('disabled','disabled')
                        .parent().parent().hide();
                    $(this.ui.inpRemind)
                        .removeAttr('disabled')
                        .attr('enabled','enabled');
                },

                restore: function(){
                    var self = this;
                    require(["bundle/restorepassword/restorepassword"],
                        function(Restorepassword) {
                            Restorepassword.start({psb: self.$('#login-form-name').val()});
                        }
                    );
                },

                actionLoginBack: function(){
                    $(this.ui.actionLoginWrapper).show();
                    $(this.ui.actionRemindWrapper).hide();

                    $(this.ui.inpPass)
                        .removeAttr('disabled')
                        .parent().parent().show();
                    $(this.ui.inpRemind)
                        .removeAttr('enabled')
                        .attr('disabled','disabled');
                },

                registration: function(){
                    var self = this;
                    require(["bundle/registration/registration"],
                        function(Registration) {
                            var dlg = new Registration.AppLayoutView();
                            App.getRegion("dialogRegion").show(dlg);
                        }
                    );

                },

                onSuccess: function(data) {
                    console.log("user data: " + JSON.stringify(data));
                    App.User.set(data);
					if(App.User.isProducer()) { // TODO: Это нужно делать только при первом входе
						require(["bundle/buyer/password"],
							function (ChangePassword) {
								var dlg = new ChangePassword.View();
								App.getRegion("dialogRegion").show(dlg);
							}
						)
					}
                    this.trigger("dialog:hide");
                },

                onError: function(status, data) {
                    var that = this;
                    switch(status) {
                        case 400:
                            try {
                                var r = JSON.parse(data);
                                var msg = [];
                                r.forEach(function(er) {
                                    msg.push(er.message);
                                    try {
                                        var i = er.path.lastIndexOf(".");
                                        var name = er.path.substring(i + 1);
                                        var inp = that.$("input[name='" + name + "']")[0];
                                    } catch (ex) {
                                        console.log(ex);
                                    }
                               });
                                alert(msg.join());
                            } catch (ex) {
                                console.log(ex);
                            }
                            break;
                        case 403:
                            this.ui.status.show();
                            break;
                        default:
                            alert("ошибка сервера:  " + status);
                    }
                },

                formToJson: function (form){
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
                },

                // TODO remove this
                fillTestBuyer: function(e) {
                    this.$(this.ui.inpName).val("z@z.com");
                    this.$(this.ui.inpPass).val("z");
                    return false;
                },

                fillTestShop: function(e) {
                    this.$(this.ui.inpName).val("sale@GoGo.com");
                    this.$(this.ui.inpPass).val("1");
                    return false;
                },
				
                fillTestProducer: function(e) {
                    this.$(this.ui.inpName).val("sale@guru.com");
                    this.$(this.ui.inpPass).val("1");
                    return false;
                }

            });

            Authentication.logout = function () {
                console.log(App.User);
                $.ajax({
                    url : "rest/v0/user/logout",
                    type : "POST",
                    success : function () {
                        console.log("logged out");
                        App.token(true);
                        try{
                            App.User.set({
                                "loggedIn":false,
                                "firstName":"",
                                "lastName":"",
                                "registrationTimestamp":null,
                                "roles":[]
                            });
                        }catch(e){
                            console.log(e);
                            window.location.reload();
                        }

                    },
                    error : function(xhr, status, thrown) {
                        console.log("log out failed (" + xhr.status + "): " + xhr.responseText)
                    }
                });
            };


        });
        return App.Authentication;
    }
);



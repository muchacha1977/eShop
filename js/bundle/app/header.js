define(["app",
        "model/user",
        "bootbox",
        "syphon",
        "text!bundle/app/view/header.html",
        "text!bundle/app/view/logo.html",
        "text!bundle/app/view/contacts.html",
        "text!bundle/app/view/logged-out.html",
        "text!bundle/app/view/logged-in-t.html",
        "text!bundle/app/view/logged-in-b.html",
        "text!bundle/app/view/logged-in-p.html",
        "text!bundle/app/view/log-out-btn.html",
        "text!bundle/app/view/logged-in-b-info.html",
        "text!bundle/app/view/logged-in-t-info.html",
        "text!bundle/app/view/logged-in-p-info.html",
		"model/trader-info"
    ],

    function (
        App,
        Data,
        bootbox,
        syphon,
        headerTpl,
        logoTpl,
        contactsTpl,
        loggedOutTpl,
        loggedInTTpl,
        loggedInBTpl,
        loggedInPTpl,
        logOutBtnTpl,
        loggedInBInfoTpl,
        loggedInTInfoTpl,
        loggedInPInfoTpl
    ) {

        App.module("Header", function (Header, App, Backbone, Marionette, $, _) {

            Header.View = Marionette.LayoutView.extend({
                template: _.template(headerTpl),
                regions: {
                    logoRegion: "#logo-region",
                    contactsRegion: "#contacts-region",
                    loggedStateRegion: "#logged-state-region",
                    loggedStateInfoRegion: "#logged-state-info-region",
                    logOutBtnRegion: "#logout-btn-region",
                    cartRegion: "#cart-region"
                },

                onBeforeShow: function () {
                    this.logoRegion.show(new Header.LogoView());
                    this.contactsRegion.show(new Header.ContactsView());
                    this.loggedStateRegion.show(new Header.LoggedStateOutView());
                    var self = this;

                    require(["bundle/cart/basket"],
                        function (Basket) {
                            self.cartRegion.show(new Basket.Cart());
                        }
                    );
                },
                initialize: function(){
                    var self = this;

                    App.User.on('change', function(){
                       if ( !App.User.isBuyer() ){
                           self.$('#cart-region').hide(); //TODO Сделать нормальное включение и выключение корзины
						   
                       }else{
                           require(["bundle/cart/basket"],
                               function (Basket) {
                                   self.cartRegion.show(new Basket.Cart());
                               }
                           );
                           self.$('#cart-region').show();
                       }

                        if ( !App.User.get('loggedIn') ) self.$('#cart-region').show();




                        if (App.User.get("loggedIn")) {
                            self.logOutBtnRegion.show(new Header.LogOutBtnView());
                            if ( App.User.isTrader() ) {
                                self.loggedStateRegion.show(new Header.LoggedStateInTraderView());
                                self.loggedStateInfoRegion.show(new Header.LoggedStateInTraderInfoView());

                            } 
							else if(App.User.isProducer()) {
								self.loggedStateRegion.show(new Header.LoggedStateInProducerView());
								self.loggedStateInfoRegion.show(new Header.LoggedStateInProducerInfoView());
							} else {
								self.loggedStateRegion.show(new Header.LoggedStateInBuyerView());
								self.loggedStateInfoRegion.show(new Header.LoggedStateInBuyerInfoView());
							}
                        } else {
                            self.loggedStateRegion.show(new Header.LoggedStateOutView());
                            self.logOutBtnRegion.reset();
							self.loggedStateInfoRegion.reset();
                        }

                    });
                }

            });

            Header.LogoView = Marionette.ItemView.extend({

                template: _.template(logoTpl)

            });

            Header.ContactsView = Marionette.ItemView.extend({

                template: _.template(contactsTpl),
                events : {
                    "click #feedbackbtnHeader": "createContactWindow" 
                }, 
                createContactWindow: function() {
                    console.log("createContactWindow");
                    bootbox.dialog({
                    title: "Задать вопрос",
                    message: '<div class="row">  ' + 
                             '<div class="col-md-12"> ' +
                             '<p id="errorStatus" class="help-block"></p>' + 
                             '<form class="form-horizontal" id="feedback-theme-form"  method="post" enctype="text/plain"> ' + '<div class="form-group"> ' + '<label class="col-md-4 control-label" for="name">Представьтесь</label> ' +
                             '<div class="col-md-6"> ' +
                             '<input id="firstName" name="subject" type="text" placeholder="Ваше имя" class="form-control input-md required"> ' + 
                             '<p id="firstNameStatus" class="help-block"></p>' +
                             '</div> ' + 
                             '</div> ' + 
                             '<div class="form-group"> ' + 
                             '<label class="col-md-4 control-label" for="name">Адрес электронной почты</label> ' + 
                             '<div class="col-md-6"> ' + 
                             '<input id="email" name="from" type="text" placeholder="Е-mail" class="form-control input-md required"> ' + 
                             '<p id="emailStatus" class="help-block"></p>' + '</div> ' + '</div> ' + 
                             '<div class="form-group"> ' + 
                             '<label class="col-md-4 control-label" for="reason">Повод</label> ' + 
                             '<div class="col-md-4"> <div class="radio"> <label for="awesomeness-0"> ' + 
                             '<input type="radio" name="to" id="awesomeness-0" value="support@qweras.ru" checked="checked"> ' + 
                             'Техподдержка</label> ' + '</div><div class="radio"> <label for="awesomeness-1"> ' + 
                             '<input type="radio" name="to" id="awesomeness-1" value="complaint@qweras.ru">Жалоба</label> ' + 
                             '</div> ' + '<div class="radio"> <label for="awesomeness-2"> ' + 
                             '<input type="radio" name="to" id="awesomeness-2" value="cooperation@qweras.ru">Сотрудничество</label> ' + 
                             '</div>' + '<br/>' + '</div>' + '<div class=" col-md-offset-1">' + 
                             '<div class="col-md-10">' + 
                             '<textarea type="text" class="form-control login-form-phone" name="message" value="" placeholder="" rows="10" id="feedback" required></textarea>' + 
                             '<p id="textStatus" class="help-block"></p>' + 
                             '</form> </div>  </div>',
                    buttons: {
                        'Отправить': {
                            show: false,
                            callback: function(e) {
                                e.preventDefault();
                                var name = $('#name').val();
                                var answer = $("input[name='message']:checked").val();
                                var self = this;
                                var _contactModel = Backbone.Model.extend({
                                    validate: function(attrs, options) {
                                        var errors = [];
                                        if (attrs.subject.length < 2) {
                                            return $('#firstNameStatus').text('Напишите Ваше имя');
                                        } else {
                                            $('#firstNameStatus').text('');
                                        }
                                        var regEmail = /^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/;
                                        if (attrs.from.length == 0 || !regEmail.test(attrs.from)) {
                                            return $('#emailStatus').text('Напишите Ваш E-mail правильно');
                                        } else {
                                            $('#emailStatus').text('');
                                        }
                                        
                                        if (attrs.message.length < 11) {
                                            return $('#textStatus').text('Опишите Вашу проблему (не менее 11 символов)');
                                        } else {
                                            $('#textStatus').text('');
                                        }
                                    }
                                });
                                var contactModel = new _contactModel();
                                var endPoint = "rest/v0/misc/feedback";
                                var self = this;
                                contactModel.save(Backbone.Syphon.serialize(this), {
                                    url: endPoint,
                                    type: 'POST',
                                    error: function(model, xhr, options) {
                                        console.log("Error" + JSON.stringify(xhr) + JSON.stringify(model));
                                        return $('#errorStatus').text('Ошибка в системе');
                                    },
                                    success: function(model, response, options) {
                                        console.log("Success! " + JSON.stringify(response) + JSON.stringify(model));
                                        $('#errorStatus').text('Ваш вопрос был благопололучно отправлен.');
                                        setTimeout(function() {
                                             bootbox.hideAll();
                                        }, 2000);
 
                                    }
                                });
                                return false;
                            }
                        }
                    }
                });
            }
     
            });

            Header.LoggedStateOutView = Marionette.LayoutView.extend({

                model: Data.user,

                template: _.template(loggedOutTpl),

                regions: {
                    loginForm:'#login-form'
                },

                events: {
                    "click #login-button": "doLogin"
                },

                doLogin: function () {
                    var self = this;
                    require(["bundle/authentication/authentication"],
                        function (Authentication) {
                            self.loginForm.show(new Authentication.View(), {forceShow: true});
                        }
                    );
                }

            });

            Header.LoggedStateInBuyerView = Marionette.ItemView.extend({
                model: Data.user,
                template: _.template(loggedInBTpl)
            });

            Header.LoggedStateInTraderView = Marionette.ItemView.extend({
                model: Data.user,
                template: _.template(loggedInTTpl)
            });
            Header.LoggedStateInProducerView = Marionette.ItemView.extend({
                model: Data.user,
                template: _.template(loggedInPTpl)
            });

            Header.LoggedStateInBuyerInfoView = Marionette.ItemView.extend({
                model: Data.user,
                template: _.template(loggedInBInfoTpl),
				initialize: function() {
					this.model.set({balance: 7864}, {silent: true});
				}
            });

            Header.LoggedStateInTraderInfoView = Marionette.ItemView.extend({
                template: _.template(loggedInTInfoTpl),
				initialize: function() {
					this.model = new Data.TraderInfo;
					var self = this;
					this.model.fetch({
						success: function() {
							self.render();
						}
					});
					App.tooltip("#trader-info", "left", this.$el.find('.hidden').html());
				}
            });
			
            Header.LoggedStateInProducerInfoView = Marionette.ItemView.extend({
                model: Data.user,
                template: _.template(loggedInPInfoTpl),
				initialize: function() {
					this.model.set({balance: 7864}, {silent: true});
				}
            });

            Header.LogOutBtnView = Marionette.ItemView.extend({
                template: _.template(logOutBtnTpl),
                events: {
                    "click #logout-button": "doLogout"
                },

                doLogout: function () {
                    require(["bundle/authentication/authentication"],
                        function (Authentication) {
                            Authentication.logout();
                        }
                    );
                }
            });



            Header.onStart = function () {
                console.log("header started");
            };

            Header.onStop = function () {
                Header.stopListening(Data.user);
                console.log("header stopped");
            };

        });

        return App.Header;

    }
);
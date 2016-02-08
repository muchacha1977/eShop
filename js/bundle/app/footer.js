define(["app", "text!bundle/app/view/footer.html", "bootbox", "syphon", 'moment'], function(App, footerTpl, bootbox, syphon, moment) {
    return App.module("Footer", function(Footer, App, Backbone, Marionette, $, _) {
        Footer.View = Marionette.ItemView.extend({
            template: _.template(footerTpl),
            events: {
                "click #feedbackbtn": "createContactWindow",
                "submit form": "formSubmitted"
            },
            initialize: function(){
                var self = this;
                this.model.fetch().done(function(){
                    self.render();
                });
            },
            model: new App.Data.Misc.OffersAndShopsCounts(),
            serializeData: function(){
                var syear = '2015';
                var currYear = moment().format('YYYY');
                var qsyear = syear + ' - ' + currYear;
                if ( syear == currYear ) qsyear = syear;
                return _.extend(this.model.toJSON(),{
                    "qsyear": qsyear
                })
            },
            createContactWindow: function() {
                var box = bootbox.dialog({
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
                                var answer = $("input[name='to']:checked").val();
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
            },
            formSubmitted: function() {
                console.log("submit");
            }
        })
        Footer.onStart = function() {
            console.log("footer started");
        }
        Footer.onStop = function() {
            console.log("footer stopped");
        }
    });
});
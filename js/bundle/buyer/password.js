
define([
        "app",
        "model/user",
        "text!view/change-password-dialog.html"
    ],
    function (App, Data, chgPassDialogTpl) {

        App.module("ChangePassword", function(ChangePassword, App, Backbone, Marionette, $, _) {

            ChangePassword.View = Marionette.ItemView.extend({

                template: _.template(chgPassDialogTpl),

                events: {

                    "click #chgPassOkButton" : "changePassword",
                    "keyup #inputReNewPassword": "keyupReNewPassword",
                    "keyup #inputNewPassword": "keyupNewPassword"

                },



                changePassword: function(e) {
                    var that = this;
                    var form = this.$("#changePasswordForm")[0];
                    if (form.checkValidity()) {
                        this.doRequest();
                    } else {
                        this.$("#changePasswordForm")
                            .find(":input")
                            .filter(":visible")
                            .not(":button")
                            .each(function(i, item) {
                                if (item.validity) {
                                    that.setInputValidationState(item, item.validity.valid);
                                }
                            });
                    }
                },

                keyupNewPassword: function(e) {
                    this.changeIconPassword();
                },
                keyupReNewPassword: function(e) {
                    this.changeIconPassword();
                },

                changeIconPassword: function(){
                    var NewPass = this.$("#inputNewPassword")[0];
                    var ReNewPass = this.$("#inputReNewPassword")[0];
                    var elemNewPassIcon = this.$("#newPassIcon");
                    var elemNewRePassIcon = this.$("#newRePassIcon");
                    var result=true;
                    if (NewPass.value != ReNewPass.value)  result=false;
                    this.changeIcon(result,elemNewPassIcon);
                    this.changeIcon(result,elemNewRePassIcon);

                },
                changeIcon: function(result,elem){
                  if (result){
                      if (elem.hasClass("fa-exclamation")) elem.removeClass("fa-exclamation");
                      if (elem.hasClass("text-danger")) elem.removeClass("text-danger");
                      elem.addClass("fa-check");
                      elem.addClass("text-success");
                  } else {
                      if (elem.hasClass("fa-check")) elem.removeClass("fa-check");
                      if (elem.hasClass("text-success")) elem.removeClass("text-success");
                      elem.addClass("fa-exclamation");
                      elem.addClass("text-danger");

                  };
                },
//fa-exclamation fa-check
                reginp: "#inputPassword, #inputNewPassword, #inputReNewPassword",


                doRequest: function() {
                    var that = this;
                    var form = this.$("#changePasswordForm");
                    var url = "rest/v0/buyer";
                    var data = this.formToJson(form);

                    $.ajax({
                        url : url,
                        type : "POST",
                        headers: {"Content-Type" : "application/json"},
                        dataType : "json",
                        data : data,
                        success : function (data) {
                            that.onSuccess(data);
                        },
                        error : function(xhr, status, thrown) {
                            that.onError(xhr.status, xhr.responseText)
                        }
                    });

                },

                onSuccess: function(data) {
                    console.log("password changed: " + JSON.stringify(data));
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
                                        that.setInputValidationState(inp, false);
                                    } catch (ex) {
                                        lonsole.log(ex);
                                    }
                                });
                                this.setAlertMessage(msg.join());
                            } catch (ex) {
                                console.log(ex);
                            }
                            break;
                        case 403:
                            this.setLoginErrorState();
                            break;
                        default:
                            this.setAlertMessage("ошибка сервера:  " + status);
                    }
                },

                formToJson: function (form){
                    var data = {};
                    $(form).find("input")
                        .filter(":visible")
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

                setInputValidationState: function(item, valid) {
                    if (item) {
                        var p = item.parentElement;
                        for (i = 0; i < 3 && p; ++i) {
                            if ($(p).hasClass("form-group")) {
                                if (valid) {
                                    $(p).removeClass("has-error");
                                } else {
                                    $(p).addClass("has-error");
                                }
                                break;
                            }
                            p = p.parentElement;
                        }
                    }
                },

                setAlertMessage: function(msg) {
                    this.$("#responseMessage")
                        .addClass("alert alert-danger")
                        .attr("role", "alert")
                        .text(msg)
                },

                clearAlertMessage: function() {
                    this.$("#responseMessage")
                        .removeClass("alert alert-danger")
                        .removeAttr("role", "alert")
                        .text(null);
                },

                setLoginErrorState: function() {
                    var that = this;
                    this.setAlertMessage("Неправильные телефон, email или пароль");
                    this.$("#inputName, #inputPassword").each(function(idx, item) {
                        that.setInputValidationState(item, false);
                    });
                },

                clearLoginErrorState: function() {
                    var that = this;
                    this.clearAlertMessage();
                    this.$("#inputName, #inputPassword").each(function(idx, item) {
                        that.setInputValidationState(item, true);
                    });
                }

            });

            ChangePassword.cancel = function () {
                   console.log("отмена ввода пароля")
            }


        });
        return App.ChangePassword;
    }
);


